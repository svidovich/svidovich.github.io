/**
 * Builds a room scene from vocabulary data.
 * Objects with a `model` field load a GLB file; others fall back to colored boxes.
 * Returns a promise that resolves to interactables: [{ mesh, english, serbian, id, seen }]
 */

import {
  AmbientLight, BoxGeometry, DoubleSide, Mesh, MeshStandardMaterial,
  PlaneGeometry, PointLight,
} from "./lib/three.module.min.js";
import { GLTFLoader } from "./lib/GLTFLoader.js";

const ROOM_W = 10;
const ROOM_H = 3.5;
const ROOM_D = 10;
const DEG2RAD = Math.PI / 180;

const loader = new GLTFLoader();

function build(scene, roomData) {
  // Floor
  const floor = new Mesh(
    new PlaneGeometry(ROOM_W, ROOM_D),
    new MeshStandardMaterial({ color: 0x8b6f47, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Ceiling
  const ceiling = new Mesh(
    new PlaneGeometry(ROOM_W, ROOM_D),
    new MeshStandardMaterial({ color: 0xf5f5f0 })
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM_H;
  scene.add(ceiling);

  // Walls
  const wallMat = new MeshStandardMaterial({ color: 0xdedcb8, side: DoubleSide });
  addWall(scene, wallMat, ROOM_W, ROOM_H, { x: 0, y: ROOM_H / 2, z: -ROOM_D / 2 }, 0);
  addWall(scene, wallMat, ROOM_W, ROOM_H, { x: 0, y: ROOM_H / 2, z: ROOM_D / 2 }, Math.PI);
  addWall(scene, wallMat, ROOM_D, ROOM_H, { x: -ROOM_W / 2, y: ROOM_H / 2, z: 0 }, Math.PI / 2);
  addWall(scene, wallMat, ROOM_D, ROOM_H, { x: ROOM_W / 2, y: ROOM_H / 2, z: 0 }, -Math.PI / 2);

  // Lighting
  scene.add(new AmbientLight(0xffffff, 0.4));
  const overhead = new PointLight(0xfff5e0, 0.8, 20);
  overhead.position.set(0, ROOM_H - 0.3, 0);
  scene.add(overhead);

  // Vocab objects — load models in parallel, fall back to boxes
  const promises = roomData.objects.map((obj) => {
    if (obj.model) {
      return loadModel(obj).then((group) => {
        group.userData.vocabId = obj.id;
        scene.add(group);
        return { mesh: group, english: obj.english, serbian: obj.serbian, id: obj.id, seen: false };
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
  scene.add(mesh);
  return { mesh, english: obj.english, serbian: obj.serbian, id: obj.id, seen: false };
}

function addWall(scene, material, width, height, pos, rotY) {
  const wall = new Mesh(new PlaneGeometry(width, height), material);
  wall.position.set(pos.x, pos.y, pos.z);
  wall.rotation.y = rotY;
  scene.add(wall);
}

export { build };
