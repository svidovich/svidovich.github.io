/**
 * Builds a room scene from vocabulary data.
 * Objects with a `model` field load a GLB file; others fall back to colored boxes.
 * Returns a promise that resolves to interactables: [{ mesh, english, serbian, id, seen }]
 */

import {
  Box3, BoxGeometry, DirectionalLight, DoubleSide, HemisphereLight, Mesh,
  MeshStandardMaterial, PlaneGeometry, PointLight,
} from "./lib/three.module.min.js";
import { GLTFLoader } from "./lib/GLTFLoader.js";

const DEFAULT_SIZE = { x: 10, y: 3.5, z: 10 };
const DEFAULT_WALL_COLOR = "#dedcb8";
const DEFAULT_FLOOR_COLOR = "#8b6f47";
const DEFAULT_CEILING_COLOR = "#f5f5f0";
const DEG2RAD = Math.PI / 180;

const loader = new GLTFLoader();

function build(scene, roomData) {
  const sz = roomData.size || DEFAULT_SIZE;
  const ROOM_W = sz.x;
  const ROOM_H = sz.y;
  const ROOM_D = sz.z;

  // Floor
  const floor = new Mesh(
    new PlaneGeometry(ROOM_W, ROOM_D),
    new MeshStandardMaterial({ color: roomData.floorColor || DEFAULT_FLOOR_COLOR, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Ceiling
  const ceiling = new Mesh(
    new PlaneGeometry(ROOM_W, ROOM_D),
    new MeshStandardMaterial({ color: roomData.ceilingColor || DEFAULT_CEILING_COLOR })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM_H;
  scene.add(ceiling);

  // Walls
  const wallMat = new MeshStandardMaterial({ color: roomData.wallColor || DEFAULT_WALL_COLOR, side: DoubleSide });
  const walls = [
    addWall(scene, wallMat, ROOM_W, ROOM_H, { x: 0, y: ROOM_H / 2, z: -ROOM_D / 2 }, 0),
    addWall(scene, wallMat, ROOM_W, ROOM_H, { x: 0, y: ROOM_H / 2, z: ROOM_D / 2 }, Math.PI),
    addWall(scene, wallMat, ROOM_D, ROOM_H, { x: -ROOM_W / 2, y: ROOM_H / 2, z: 0 }, Math.PI / 2),
    addWall(scene, wallMat, ROOM_D, ROOM_H, { x: ROOM_W / 2, y: ROOM_H / 2, z: 0 }, -Math.PI / 2),
  ];
  for (const w of walls) w.receiveShadow = true;

  // Lighting — hemisphere for natural ambient variation, directional for shadows
  scene.add(new HemisphereLight(0xc8d8f0, 0x806040, 0.4));

  const dirLight = new DirectionalLight(0xfff5e0, 0.9);
  dirLight.position.set(1, ROOM_H + 3, 1);
  dirLight.target.position.set(0, 0, 0);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  dirLight.shadow.camera.left = -ROOM_W / 2;
  dirLight.shadow.camera.right = ROOM_W / 2;
  dirLight.shadow.camera.top = ROOM_D / 2;
  dirLight.shadow.camera.bottom = -ROOM_D / 2;
  scene.add(dirLight);
  scene.add(dirLight.target);

  // Warm fill light from the opposite side
  const fill = new PointLight(0xffc080, 0.3, 15);
  fill.position.set(-3, ROOM_H - 0.5, -2);
  scene.add(fill);

  // Vocab objects — load models in parallel, fall back to boxes
  const promises = roomData.objects.map((obj) => {
    if (obj.model) {
      return loadModel(obj).then((group) => {
        group.userData.vocabId = obj.id;
        scene.add(group);
        const bounds = obj.solid ? new Box3().setFromObject(group) : null;
        return { mesh: group, english: obj.english, serbian: obj.serbian, id: obj.id, seen: false, bounds, quizExclude: !!obj.quizExclude, large: !!obj.large };
      }).catch((err) => {
        console.warn(`Failed to load model for "${obj.id}", using fallback box:`, err);
        return addFallbackBox(scene, obj);
      });
    } else {
      return Promise.resolve(addFallbackBox(scene, obj));
    }
  });

  return Promise.all(promises);
}

function loadModel(obj) {
  return new Promise((resolve, reject) => {
    loader.load(
      obj.model,
      (gltf) => {
        const group = gltf.scene;

        // Apply scale
        const s = obj.scale || 1;
        group.scale.set(s, s, s);

        // Apply position
        group.position.set(obj.position.x, obj.position.y, obj.position.z);

        // Apply rotation (degrees → radians)
        if (obj.rotation) {
          group.rotation.set(
            (obj.rotation.x || 0) * DEG2RAD,
            (obj.rotation.y || 0) * DEG2RAD,
            (obj.rotation.z || 0) * DEG2RAD
          );
        }

        // Tag every child mesh so raycasting hits register the vocab id
        group.traverse((child) => {
          if (child.isMesh) {
            child.userData.vocabId = obj.id;
            child.castShadow = obj.shadows !== false;
            child.receiveShadow = true;
          }
        });

        resolve(group);
      },
      undefined,
      reject
    );
  });
}

function addFallbackBox(scene, obj) {
  const { w, h, d } = obj.size;
  const mesh = new Mesh(
    new BoxGeometry(w, h, d),
    new MeshStandardMaterial({ color: obj.color, roughness: 0.7, metalness: 0.1 })
  );
  mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
  mesh.userData.vocabId = obj.id;
  mesh.castShadow = obj.shadows !== false;
  mesh.receiveShadow = true;
  scene.add(mesh);
  const bounds = obj.solid ? new Box3().setFromObject(mesh) : null;
  return { mesh, english: obj.english, serbian: obj.serbian, id: obj.id, seen: false, bounds, quizExclude: !!obj.quizExclude, large: !!obj.large };
}

function addWall(scene, material, width, height, pos, rotY) {
  const wall = new Mesh(new PlaneGeometry(width, height), material);
  wall.position.set(pos.x, pos.y, pos.z);
  wall.rotation.y = rotY;
  scene.add(wall);
  return wall;
}

export { build };
