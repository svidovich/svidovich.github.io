/**
 * Per-room score tracking in localStorage.
 * Stores: { [roomKey]: { best: n, total: n, completions: n } }
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

function record(roomKey, score, total) {
  const all = loadAll();
  if (!all[roomKey]) {
    all[roomKey] = { best: 0, total, completions: 0 };
  }
  all[roomKey].completions++;
  if (score > all[roomKey].best) {
    all[roomKey].best = score;
  }
  all[roomKey].total = total;
  saveAll(all);
  return all[roomKey];
}

function get(roomKey) {
  const all = loadAll();
  return all[roomKey] || null;
}

export { record, get };
