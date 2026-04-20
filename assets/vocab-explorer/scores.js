/**
 * Per-room score tracking in localStorage.
 * Stores: { [roomKey]: { bestTime: n|null, total: n, completions: n } }
 * bestTime and completions only update on perfect scores.
 */

const STORAGE_KEY = "vocabExplorerScores";

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function saveAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function record(roomKey, score, total, elapsedSeconds) {
  const all = loadAll();
  if (!all[roomKey]) {
    all[roomKey] = { bestTime: null, total, completions: 0 };
  }
  all[roomKey].total = total;

  if (score === total) {
    all[roomKey].completions++;
    if (!all[roomKey].bestTime || elapsedSeconds < all[roomKey].bestTime) {
      all[roomKey].bestTime = elapsedSeconds;
    }
  }

  saveAll(all);
  return all[roomKey];
}

function get(roomKey) {
  const all = loadAll();
  return all[roomKey] || null;
}

export { record, get };
