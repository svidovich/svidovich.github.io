/**
 * First-person controls: WASD movement + mouse look via Pointer Lock.
 */

import { Vector3 } from "./lib/three.module.min.js";

const SPEED = 4.0;
const MOUSE_SENSITIVITY = 0.002;
const PLAYER_HEIGHT = 1.7;
const PLAYER_RADIUS = 0.3;
const ROOM_HALF = 4.8;
const JUMP_VELOCITY = 4.0;
const GRAVITY = 12.0;

let camera, domElement;
let euler = { x: 0, y: 0 };
let moveState = { forward: false, back: false, left: false, right: false };
let locked = false;
let solids = [];
let velocityY = 0;
let grounded = true;

function init(cam, canvas) {
  camera = cam;
  domElement = canvas;
  camera.position.set(0, PLAYER_HEIGHT, 3);
  camera.rotation.order = "YXZ";

  document.addEventListener("keydown", onKey);
  document.addEventListener("keyup", onKey);
  document.addEventListener("mousemove", onMouse);
  document.addEventListener("pointerlockchange", onLockChange);
}

function requestLock() {
  domElement.requestPointerLock();
}

function isLocked() {
  return locked;
}

function onLockChange() {
  locked = document.pointerLockElement === domElement;
}

function onKey(e) {
  const down = e.type === "keydown";
  switch (e.code) {
    case "KeyW": case "ArrowUp":    moveState.forward = down; break;
    case "KeyS": case "ArrowDown":  moveState.back    = down; break;
    case "KeyA": case "ArrowLeft":  moveState.left    = down; break;
    case "KeyD": case "ArrowRight": moveState.right   = down; break;
    case "Space":
      if (down && grounded) {
        velocityY = JUMP_VELOCITY;
        grounded = false;
      }
      break;
  }
}

function onMouse(e) {
  if (!locked) return;
  euler.y -= e.movementX * MOUSE_SENSITIVITY;
  euler.x -= e.movementY * MOUSE_SENSITIVITY;
  euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));
  camera.rotation.set(euler.x, euler.y, 0);
}

function update(dt) {
  if (!locked) return;

  const dir = new Vector3();
  const front = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
  front.y = 0;
  front.normalize();
  const right = new Vector3().crossVectors(front, new Vector3(0, 1, 0));

  if (moveState.forward) dir.add(front);
  if (moveState.back) dir.sub(front);
  if (moveState.left) dir.sub(right);
  if (moveState.right) dir.add(right);

  // Jump / gravity
  if (!grounded) {
    velocityY -= GRAVITY * dt;
    camera.position.y += velocityY * dt;
    if (camera.position.y <= PLAYER_HEIGHT) {
      camera.position.y = PLAYER_HEIGHT;
      velocityY = 0;
      grounded = true;
    }
  }

  if (dir.lengthSq() > 0) {
    dir.normalize().multiplyScalar(SPEED * dt);
    camera.position.add(dir);
  }

  // Push out of solid objects
  const pos = camera.position;
  for (const box of solids) {
    // Skip if player is above or below the object
    if (pos.y - PLAYER_HEIGHT > box.max.y || pos.y < box.min.y) continue;

    const minX = box.min.x - PLAYER_RADIUS;
    const maxX = box.max.x + PLAYER_RADIUS;
    const minZ = box.min.z - PLAYER_RADIUS;
    const maxZ = box.max.z + PLAYER_RADIUS;

    if (pos.x > minX && pos.x < maxX && pos.z > minZ && pos.z < maxZ) {
      const pushRight = maxX - pos.x;
      const pushLeft  = pos.x - minX;
      const pushFront = maxZ - pos.z;
      const pushBack  = pos.z - minZ;
      const min = Math.min(pushRight, pushLeft, pushFront, pushBack);

      if (min === pushLeft)       pos.x = minX;
      else if (min === pushRight) pos.x = maxX;
      else if (min === pushBack)  pos.z = minZ;
      else                        pos.z = maxZ;
    }
  }

  pos.x = Math.max(-ROOM_HALF, Math.min(ROOM_HALF, pos.x));
  pos.z = Math.max(-ROOM_HALF, Math.min(ROOM_HALF, pos.z));
}

function setSolids(boxes) {
  solids = boxes;
}

function destroy() {
  document.removeEventListener("keydown", onKey);
  document.removeEventListener("keyup", onKey);
  document.removeEventListener("mousemove", onMouse);
  document.removeEventListener("pointerlockchange", onLockChange);
  moveState = { forward: false, back: false, left: false, right: false };
  locked = false;
  solids = [];
  velocityY = 0;
  grounded = true;
}

export { init, requestLock, isLocked, update, destroy, setSolids };
