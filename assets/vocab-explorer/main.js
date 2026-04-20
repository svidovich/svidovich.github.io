import {
  AmbientLight, Box3, Clock, Color, DirectionalLight, PCFSoftShadowMap,
  PerspectiveCamera, Raycaster, Scene, Vector2, Vector3, WebGLRenderer,
} from "./lib/three.module.min.js";
import { VOCABULARY, latinToCyrillic } from "./vocabulary.js";
import { build as buildRoom } from "./room.js";
import { init as initPlayer, requestLock, isLocked, update as updatePlayer, destroy as destroyPlayer, setSolids } from "./player.js";
import { start as startQuiz } from "./quiz.js";
import { DIFFICULTIES, ALPHABETS, HIGHLIGHTS, load as loadSettings, save as saveSettings, getTimerSeconds } from "./settings.js";
import { get as getScore, record as recordScore } from "./scores.js";

const EMISSIVE_FADE_SECONDS = 1;
const SEEN_EMISSIVE_G = 0x33 / 0xFF; // green channel of 0x003300
const INVENTORY_SIZE = 5;

let renderer, scene, camera;
let interactables = [];
let raycaster, clock;
let timerSeconds = 0;
let timerRunning = false;
let currentRoomKey = null;
let currentGazeId = null;
let paused = false;
let gameActive = false;
let timerWasRunning = false;
let inventory = new Array(INVENTORY_SIZE).fill(null);
let equippedSlot = -1;
let snapshotRenderer = null;
let settings = loadSettings();
let bubbleInterval = null;

const menuEl = document.getElementById("menu");
const bubblesEl = document.getElementById("menu-bubbles");
const gameEl = document.getElementById("game-container");
const timerEl = document.getElementById("timer");
const seenEl = document.getElementById("seen-count");
const labelBubble = document.getElementById("label-bubble");
const labelSerbian = labelBubble.querySelector(".serbian");
const labelEnglish = labelBubble.querySelector(".english");
const instructionsEl = document.getElementById("instructions");
const pauseOverlay = document.getElementById("pause-overlay");
const pauseResumeBtn = document.getElementById("pause-resume-btn");
const pauseQuitBtn = document.getElementById("pause-quit-btn");
const invSlots = document.querySelectorAll(".inv-slot");
const equippedCard = document.getElementById("equipped-card");
const equippedCardSerbian = equippedCard.querySelector(".serbian");
const equippedCardEnglish = equippedCard.querySelector(".english");
const tooBigFlash = document.getElementById("too-big-flash");
const invHint = document.getElementById("inv-hint");
let tooBigTimer = 0;

// ── Menu bubbles ──

function spawnBubble() {
  const el = document.createElement("div");
  el.className = "bubble";
  const size = 10 + Math.random() * 30;
  const duration = 6 + Math.random() * 8;
  const left = Math.random() * 100;
  const hueOffset = Math.random() * 360;
  el.style.width = size + "px";
  el.style.height = size + "px";
  el.style.left = left + "%";
  el.style.animationDuration = duration + "s, 6s";
  el.style.animationDelay = "0s, -" + (hueOffset / 360 * 6) + "s";
  el.style.opacity = 0.3 + Math.random() * 0.4;
  bubblesEl.appendChild(el);
  setTimeout(() => el.remove(), duration * 1000);
}

function startBubbles() {
  if (bubbleInterval) return;
  bubbleInterval = setInterval(spawnBubble, 400);
  // Seed a few immediately
  for (let i = 0; i < 8; i++) spawnBubble();
}

function stopBubbles() {
  clearInterval(bubbleInterval);
  bubbleInterval = null;
  bubblesEl.innerHTML = "";
}

startBubbles();

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
    btn.textContent = d.seconds === Infinity ? d.label : `${d.label} (${d.seconds}s)`;
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

  const hlEl = document.getElementById("highlight-options");
  hlEl.innerHTML = "";
  for (const h of HIGHLIGHTS) {
    const btn = document.createElement("button");
    btn.className = "option-btn" + (settings.highlight === h.key ? " active" : "");
    btn.textContent = h.label;
    btn.addEventListener("click", () => {
      settings.highlight = h.key;
      saveSettings(settings);
      buildSettingsUI();
    });
    hlEl.appendChild(btn);
  }
}

buildSettingsUI();

// ── Room buttons + scores ──

function serbianDisplay(latinWord) {
  return settings.alphabet === "latin" ? latinWord : latinToCyrillic(latinWord);
}

function formatBestTime(seconds) {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return "No best time!";
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 10);
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    return `${m}:${s.toString().padStart(2, "0")}.${ms}`;
  }
  return `${s}.${ms}s`;
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
    if (scoreData && scoreData.completions > 0) {
      const timeStr = formatBestTime(scoreData.bestTime);
      const stars = "\u2B50 \u00D7 " + scoreData.completions;
      statsEl.textContent = `Best: ${timeStr} | ${stars}`;
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

  stopBubbles();
  menuEl.style.display = "none";
  gameEl.style.display = "block";

  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  gameEl.insertBefore(renderer.domElement, gameEl.firstChild);

  scene = new Scene();
  scene.background = new Color(0x1a1a2e);
  camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 50);
  scene.add(camera);

  // Load models (async) then start
  interactables = await buildRoom(scene, roomData);

  initPlayer(camera, renderer.domElement);
  setSolids(interactables.filter((i) => i.bounds).map((i) => i.bounds));
  renderer.domElement.addEventListener("click", () => requestLock());

  raycaster = new Raycaster();
  raycaster.far = 6;

  timerSeconds = getTimerSeconds(settings);
  timerRunning = false;
  clock = new Clock();

  updateHUD();
  instructionsEl.style.opacity = "1";

  document.addEventListener("pointerlockchange", onFirstLock);
  document.addEventListener("keydown", onGameKey);
  window.addEventListener("resize", onResize);

  tick();
}

// ── Start timer on first pointer lock ──

function onFirstLock() {
  if (document.pointerLockElement === renderer.domElement) {
    timerRunning = true;
    gameActive = true;
    clock.getDelta(); // reset delta so first frame isn't huge
    document.removeEventListener("pointerlockchange", onFirstLock);
    document.addEventListener("pointerlockchange", onPauseCheck);
    instructionsEl.style.opacity = "0";
  }
}

// ── Pause ──

function onPauseCheck() {
  if (!document.pointerLockElement && gameActive && !paused) {
    paused = true;
    timerWasRunning = timerRunning;
    timerRunning = false;
    clock.getDelta(); // drain accumulated dt
    labelBubble.style.display = "none";
    pauseOverlay.classList.add("active");
  }
}

function resumeGame() {
  paused = false;
  pauseOverlay.classList.remove("active");
  requestLock();
  // Restore timer once lock is actually acquired
  const onResumeLock = () => {
    if (document.pointerLockElement === renderer.domElement) {
      timerRunning = timerWasRunning;
      clock.getDelta(); // drain dt accumulated while paused
      document.removeEventListener("pointerlockchange", onResumeLock);
    }
  };
  document.addEventListener("pointerlockchange", onResumeLock);
}

function quitToMenu() {
  paused = false;
  gameActive = false;
  pauseOverlay.classList.remove("active");
  cleanup();
  menuEl.style.display = "flex";
  updateRoomButtons();
  startBubbles();
}

pauseResumeBtn.addEventListener("click", resumeGame);
pauseQuitBtn.addEventListener("click", quitToMenu);

// ── Game keys ──

function onGameKey(e) {
  if (!gameActive || paused) return;

  switch (e.code) {
    case "KeyR":
      if (timerRunning) {
        timerSeconds = 0;
        timerRunning = false;
        endExploration();
      }
      break;
    case "KeyF":
      if (isLocked()) handleInteract();
      break;
    case "Digit1": case "Digit2": case "Digit3": case "Digit4": case "Digit5":
      if (isLocked()) toggleEquip(parseInt(e.code.charAt(5)) - 1);
      break;
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

  if (!paused) {
    updatePlayer(dt);
    checkGaze();
    updateEmissives(dt);
  }
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
  if (settings.highlight === "on") {
    item.emissiveLevel = 1;
    applyEmissive(item);
  }
  updateHUD();
}

function applyEmissive(item) {
  const g = SEEN_EMISSIVE_G * (item.emissiveLevel || 0);
  item.mesh.traverse((child) => {
    if (child.isMesh && child.material && child.material.emissive) {
      child.material.emissive.setRGB(0, g, 0);
    }
  });
}

function updateEmissives(dt) {
  if (settings.highlight !== "on") return;
  for (const item of interactables) {
    if (!item.seen) continue;
    if (item.id === currentGazeId) {
      item.emissiveLevel = 1;
    } else {
      item.emissiveLevel = Math.max(0, (item.emissiveLevel || 0) - dt / EMISSIVE_FADE_SECONDS);
    }
    applyEmissive(item);
  }
}

function checkGaze() {
  if (!isLocked()) {
    labelBubble.style.display = "none";
    currentGazeId = null;
    return;
  }

  raycaster.setFromCamera(new Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(interactables.map((i) => i.mesh), true);

  if (hits.length > 0) {
    const vocabId = hits[0].object.userData.vocabId
      || findVocabIdUp(hits[0].object);
    const item = interactables.find((i) => i.id === vocabId);
    if (item) {
      currentGazeId = item.id;
      if (!item.seen) markSeen(item);
      labelSerbian.textContent = serbianDisplay(item.serbian);
      labelEnglish.textContent = item.english;
      labelBubble.style.display = "block";
      updateInvHint();
      return;
    }
  }

  currentGazeId = null;
  labelBubble.style.display = "none";
  updateInvHint();
}

// ── Inventory ──

function handleInteract() {
  if (equippedSlot >= 0 && inventory[equippedSlot]) {
    placeEquippedItem();
  } else {
    pickUpGazedItem();
  }
}

function pickUpGazedItem() {
  if (!currentGazeId) return;

  const itemIndex = interactables.findIndex((i) => i.id === currentGazeId);
  if (itemIndex < 0) return;

  const item = interactables[itemIndex];
  if (item.large) {
    showTooBig();
    return;
  }

  const slot = inventory.indexOf(null);
  if (slot < 0) return;

  scene.remove(item.mesh);
  interactables.splice(itemIndex, 1);

  const snapshot = generateSnapshot(item.mesh);

  inventory[slot] = {
    mesh: item.mesh,
    english: item.english,
    serbian: item.serbian,
    id: item.id,
    seen: item.seen,
    quizExclude: item.quizExclude,
    large: item.large,
    snapshot,
    origPosition: item.mesh.position.clone(),
    origRotation: item.mesh.rotation.clone(),
    origScale: item.mesh.scale.clone(),
  };

  currentGazeId = null;
  labelBubble.style.display = "none";

  refreshSolids();
  updateInventoryUI();
  updateHUD();
}

function generateSnapshot(mesh) {
  const size = 96;
  if (!snapshotRenderer) {
    snapshotRenderer = new WebGLRenderer({ alpha: true, antialias: true });
    snapshotRenderer.setSize(size, size);
  }
  snapshotRenderer.setClearColor(0x000000, 0);

  const tempScene = new Scene();
  tempScene.add(new AmbientLight(0xffffff, 0.8));
  const dl = new DirectionalLight(0xffffff, 0.5);
  dl.position.set(1, 2, 3);
  tempScene.add(dl);

  const clone = mesh.clone();
  clone.position.set(0, 0, 0);
  clone.rotation.set(0, Math.PI / 6, 0);

  const box = new Box3().setFromObject(clone);
  const center = box.getCenter(new Vector3());
  const bsize = box.getSize(new Vector3());
  clone.position.sub(center);
  tempScene.add(clone);

  const maxDim = Math.max(bsize.x, bsize.y, bsize.z);
  const tempCam = new PerspectiveCamera(40, 1, 0.01, maxDim * 10);
  tempCam.position.set(0, maxDim * 0.3, maxDim * 1.8);
  tempCam.lookAt(0, 0, 0);

  snapshotRenderer.render(tempScene, tempCam);
  return snapshotRenderer.domElement.toDataURL();
}

function toggleEquip(slot) {
  if (slot === equippedSlot) {
    unequipItem();
  } else if (inventory[slot]) {
    if (equippedSlot >= 0) unequipItem();
    equipItem(slot);
  }
  updateInventoryUI();
}

function equipItem(slot) {
  const item = inventory[slot];
  equippedSlot = slot;

  const box = new Box3().setFromObject(item.mesh);
  const bsize = box.getSize(new Vector3());
  const maxDim = Math.max(bsize.x, bsize.y, bsize.z);
  const handScale = 0.25 / maxDim;

  item.mesh.position.set(0.35, -0.25, -0.5);
  item.mesh.rotation.set(0, -Math.PI / 8, 0);
  item.mesh.scale.set(handScale, handScale, handScale);

  camera.add(item.mesh);

  equippedCardSerbian.textContent = serbianDisplay(item.serbian);
  equippedCardEnglish.textContent = item.english;
  equippedCard.style.display = "block";
}

function unequipItem() {
  if (equippedSlot < 0) return;
  const item = inventory[equippedSlot];
  if (item) {
    camera.remove(item.mesh);
    item.mesh.position.copy(item.origPosition);
    item.mesh.rotation.copy(item.origRotation);
    item.mesh.scale.copy(item.origScale);
  }
  equippedSlot = -1;
  equippedCard.style.display = "none";
}

function placeEquippedItem() {
  const item = inventory[equippedSlot];
  if (!item) return;

  raycaster.setFromCamera(new Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(scene.children, true);

  let hit = null;
  for (const h of hits) {
    if (isChildOf(h.object, camera)) continue;
    if (h.face.normal.y < 0.7) continue; // only horizontal surfaces
    hit = h;
    break;
  }
  if (!hit) return;

  camera.remove(item.mesh);

  item.mesh.scale.copy(item.origScale);

  const pos = hit.point.clone().add(hit.face.normal.clone().multiplyScalar(0.01));
  item.mesh.position.copy(pos);

  const angle = Math.atan2(
    pos.x - camera.position.x,
    pos.z - camera.position.z
  );
  item.mesh.rotation.set(0, angle, 0);

  scene.add(item.mesh);

  item.mesh.traverse((child) => {
    if (child.isMesh) child.userData.vocabId = item.id;
  });

  interactables.push({
    mesh: item.mesh,
    english: item.english,
    serbian: item.serbian,
    id: item.id,
    seen: item.seen,
    bounds: null,
    quizExclude: item.quizExclude || false,
    large: item.large || false,
  });

  inventory[equippedSlot] = null;
  equippedSlot = -1;
  equippedCard.style.display = "none";

  refreshSolids();
  updateInventoryUI();
  updateHUD();
}

function isChildOf(obj, ancestor) {
  let cur = obj;
  while (cur) {
    if (cur === ancestor) return true;
    cur = cur.parent;
  }
  return false;
}

function refreshSolids() {
  setSolids(interactables.filter((i) => i.bounds).map((i) => i.bounds));
}

function updateInventoryUI() {
  invSlots.forEach((el, i) => {
    el.classList.toggle("active", i === equippedSlot);
    const item = inventory[i];
    el.classList.toggle("occupied", !!item);
    el.style.backgroundImage = item ? `url(${item.snapshot})` : "";
  });
  updateInvHint();
}

function showTooBig() {
  tooBigFlash.classList.remove("visible");
  void tooBigFlash.offsetWidth; // force reflow to restart animation
  tooBigFlash.classList.add("visible");
  clearTimeout(tooBigTimer);
  tooBigTimer = setTimeout(() => tooBigFlash.classList.remove("visible"), 600);
}

function updateInvHint() {
  if (equippedSlot >= 0 && inventory[equippedSlot]) {
    invHint.innerHTML = "<kbd>F</kbd> Bacaj / Toss";
    invHint.classList.add("visible");
  } else if (currentGazeId) {
    invHint.innerHTML = "<kbd>F</kbd> Uzmi / Take";
    invHint.classList.add("visible");
  } else {
    invHint.classList.remove("visible");
  }
}

// ── HUD ──

function allItems() {
  const items = [...interactables];
  for (const inv of inventory) {
    if (inv) items.push(inv);
  }
  return items;
}

function uniqueVocabCounts() {
  const seenWords = new Set();
  const allWords = new Set();
  for (const item of allItems()) {
    if (item.quizExclude) continue;
    allWords.add(item.english);
    if (item.seen) seenWords.add(item.english);
  }
  return { seen: seenWords.size, total: allWords.size };
}

function updateHUD() {
  if (timerSeconds === Infinity) {
    timerEl.textContent = "\u221E";
  } else {
    const m = Math.floor(timerSeconds / 60);
    const s = Math.floor(timerSeconds % 60);
    timerEl.textContent = `${m}:${s.toString().padStart(2, "0")}`;
  }
  const counts = uniqueVocabCounts();
  seenEl.textContent = `${counts.seen} / ${counts.total} seen`;
}

// ── Exploration ends → quiz ──

function endExploration() {
  gameActive = false;
  document.exitPointerLock();
  labelBubble.style.display = "none";

  startQuiz(allItems(), onQuizDone, settings.alphabet);
}

function onQuizDone(score, total, elapsedSeconds) {
  recordScore(currentRoomKey, score, total, elapsedSeconds);
  cleanup();
  menuEl.style.display = "flex";
  updateRoomButtons();
  startBubbles();
}

// ── Cleanup ──

function cleanup() {
  document.removeEventListener("pointerlockchange", onFirstLock);
  document.removeEventListener("pointerlockchange", onPauseCheck);
  document.removeEventListener("keydown", onGameKey);
  window.removeEventListener("resize", onResize);
  gameActive = false;
  paused = false;

  // Clear inventory
  if (equippedSlot >= 0 && inventory[equippedSlot]) {
    camera.remove(inventory[equippedSlot].mesh);
  }
  inventory.fill(null);
  equippedSlot = -1;
  equippedCard.style.display = "none";
  updateInventoryUI();

  if (snapshotRenderer) {
    snapshotRenderer.dispose();
    snapshotRenderer = null;
  }

  destroyPlayer();
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
    renderer = null;
  }
  scene = null;
  camera = null;
  interactables = [];
  currentGazeId = null;
  gameEl.style.display = "none";
}

function onResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
