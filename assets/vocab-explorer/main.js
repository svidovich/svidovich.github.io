import {
  Clock, Color, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer,
} from "./lib/three.module.min.js";
import { VOCABULARY, latinToCyrillic } from "./vocabulary.js";
import { build as buildRoom } from "./room.js";
import { init as initPlayer, requestLock, isLocked, update as updatePlayer, destroy as destroyPlayer } from "./player.js";
import { start as startQuiz } from "./quiz.js";
import { DIFFICULTIES, ALPHABETS, load as loadSettings, save as saveSettings, getTimerSeconds } from "./settings.js";
import { get as getScore, record as recordScore } from "./scores.js";

let renderer, scene, camera;
let interactables = [];
let raycaster, clock;
let timerSeconds = 0;
let timerRunning = false;
let seenCount = 0;
let currentRoomKey = null;
let settings = loadSettings();

const menuEl = document.getElementById("menu");
const gameEl = document.getElementById("game-container");
const timerEl = document.getElementById("timer");
const seenEl = document.getElementById("seen-count");
const labelBubble = document.getElementById("label-bubble");
const labelSerbian = labelBubble.querySelector(".serbian");
const labelEnglish = labelBubble.querySelector(".english");
const instructionsEl = document.getElementById("instructions");

// ── Settings panel ──

const settingsToggle = document.getElementById("settings-toggle");
const settingsPanel = document.getElementById("settings-panel");

settingsToggle.addEventListener("click", () => {
  const visible = settingsPanel.style.display !== "none";
  settingsPanel.style.display = visible ? "none" : "block";
});

function buildSettingsUI() {
  const diffEl = document.getElementById("difficulty-options");
  diffEl.innerHTML = "";
  for (const d of DIFFICULTIES) {
    const btn = document.createElement("button");
    btn.className = "option-btn" + (settings.difficulty === d.key ? " active" : "");
    btn.textContent = `${d.label} (${d.seconds}s)`;
    btn.addEventListener("click", () => {
      settings.difficulty = d.key;
      saveSettings(settings);
      buildSettingsUI();
    });
    diffEl.appendChild(btn);
  }

  const alphaEl = document.getElementById("alphabet-options");
  alphaEl.innerHTML = "";
  for (const a of ALPHABETS) {
    const btn = document.createElement("button");
    btn.className = "option-btn" + (settings.alphabet === a.key ? " active" : "");
    btn.textContent = a.label;
    btn.addEventListener("click", () => {
      settings.alphabet = a.key;
      saveSettings(settings);
      buildSettingsUI();
      updateRoomButtons();
    });
    alphaEl.appendChild(btn);
  }
}

buildSettingsUI();

// ── Room buttons + scores ──

function serbianDisplay(latinWord) {
  return settings.alphabet === "latin" ? latinWord : latinToCyrillic(latinWord);
}

function updateRoomButtons() {
  document.querySelectorAll(".room-btn").forEach((btn) => {
    const roomKey = btn.dataset.room;
    const roomData = VOCABULARY[roomKey];
    if (!roomData) return;

    const nameEl = btn.querySelector(".room-name");
    nameEl.textContent = `${serbianDisplay(roomData.name.latin)} — ${roomData.name.english}`;

    const statsEl = btn.querySelector(".room-stats");
    const scoreData = getScore(roomKey);
    if (scoreData) {
      const stars = "\u2B50 \u00D7 " + scoreData.completions;
      statsEl.textContent = `Best: ${scoreData.best}/${scoreData.total} | ${stars}`;
    } else {
      statsEl.textContent = "";
    }
  });
}

updateRoomButtons();

document.querySelectorAll(".room-btn").forEach((btn) => {
  btn.addEventListener("click", () => startRoom(btn.dataset.room));
});

// ── Start a room ──

async function startRoom(roomKey) {
  const roomData = VOCABULARY[roomKey];
  if (!roomData) return;

  currentRoomKey = roomKey;
  settings = loadSettings();

  menuEl.style.display = "none";
  gameEl.style.display = "block";

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  gameEl.insertBefore(renderer.domElement, gameEl.firstChild);

  scene = new Scene();
  scene.background = new Color(0x1a1a2e);
  camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 50);

  // Load models (async) then start
  interactables = await buildRoom(scene, roomData);
  seenCount = 0;

  initPlayer(camera, renderer.domElement);
  renderer.domElement.addEventListener("click", () => requestLock());

  raycaster = new Raycaster();
  raycaster.far = 6;

  timerSeconds = getTimerSeconds(settings);
  timerRunning = false;
  clock = new Clock();

  updateHUD();
  instructionsEl.style.opacity = "1";

  document.addEventListener("pointerlockchange", onFirstLock);
  document.addEventListener("keydown", onReadyKey);
  window.addEventListener("resize", onResize);

  tick();
}

// ── Start timer on first pointer lock ──

function onFirstLock() {
  if (document.pointerLockElement === renderer.domElement) {
    timerRunning = true;
    clock.getDelta(); // reset delta so first frame isn't huge
    document.removeEventListener("pointerlockchange", onFirstLock);
    instructionsEl.style.opacity = "0";
  }
}

// ── R key to skip to quiz ──

function onReadyKey(e) {
  if (e.code === "KeyR" && timerRunning) {
    timerSeconds = 0;
    timerRunning = false;
    endExploration();
  }
}

// ── Game loop ──

function tick() {
  if (!renderer) return;
  requestAnimationFrame(tick);

  const dt = clock.getDelta();

  if (timerRunning) {
    timerSeconds -= dt;
    if (timerSeconds <= 0) {
      timerSeconds = 0;
      timerRunning = false;
      endExploration();
    }
    updateHUD();
  }

  updatePlayer(dt);
  checkGaze();
  renderer.render(scene, camera);
}

// ── Gaze / label ──

function findVocabIdUp(obj) {
  let cur = obj;
  while (cur) {
    if (cur.userData && cur.userData.vocabId) return cur.userData.vocabId;
    cur = cur.parent;
  }
  return null;
}

function markSeen(item) {
  item.seen = true;
  seenCount++;
  // Tint all meshes in the object (works for both single boxes and loaded models)
  const root = item.mesh;
  if (root.isMesh && root.material) {
    root.material.emissive = new Color(0x003300);
  }
  root.traverse((child) => {
    if (child.isMesh && child.material && child.material.emissive) {
      child.material.emissive = new Color(0x003300);
    }
  });
  updateHUD();
}

function checkGaze() {
  if (!isLocked()) {
    labelBubble.style.display = "none";
    return;
  }

  raycaster.setFromCamera(new Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(interactables.map((i) => i.mesh), true);

  if (hits.length > 0) {
    const vocabId = hits[0].object.userData.vocabId
      || findVocabIdUp(hits[0].object);
    const item = interactables.find((i) => i.id === vocabId);
    if (item) {
      if (!item.seen) markSeen(item);
      labelSerbian.textContent = serbianDisplay(item.serbian);
      labelEnglish.textContent = item.english;
      labelBubble.style.display = "block";
    }
  } else {
    labelBubble.style.display = "none";
  }
}

// ── HUD ──

function updateHUD() {
  const m = Math.floor(timerSeconds / 60);
  const s = Math.floor(timerSeconds % 60);
  timerEl.textContent = `${m}:${s.toString().padStart(2, "0")}`;
  seenEl.textContent = `${seenCount} / ${interactables.length} seen`;
}

// ── Exploration ends → quiz ──

function endExploration() {
  document.exitPointerLock();
  labelBubble.style.display = "none";

  startQuiz(interactables, onQuizDone, settings.alphabet);
}

function onQuizDone(score, total) {
  recordScore(currentRoomKey, score, total);
  cleanup();
  menuEl.style.display = "flex";
  updateRoomButtons();
}

// ── Cleanup ──

function cleanup() {
  document.removeEventListener("pointerlockchange", onFirstLock);
  document.removeEventListener("keydown", onReadyKey);
  window.removeEventListener("resize", onResize);
  destroyPlayer();
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
    renderer = null;
  }
  scene = null;
  camera = null;
  interactables = [];
  gameEl.style.display = "none";
}

function onResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
