/**
 * Settings: difficulty + alphabet, persisted to localStorage.
 */

const STORAGE_KEY = "vocabExplorerSettings";

const DIFFICULTIES = [
  { key: "study",      label: "Study Mode", seconds: Infinity },
  { key: "easy",       label: "Easy",       seconds: 30 },
  { key: "medium",     label: "Medium",     seconds: 20 },
  { key: "hard",       label: "Hard",       seconds: 10 },
  { key: "impossible", label: "Impossible", seconds: 5  },
];

const ALPHABETS = [
  { key: "cyrillic", label: "Ћирилица (Cyrillic)" },
  { key: "latin",    label: "Latinica (Latin)" },
];

const HIGHLIGHTS = [
  { key: "on",  label: "On" },
  { key: "off", label: "Off" },
];

const DEFAULTS = { difficulty: "easy", alphabet: "cyrillic", highlight: "on" };

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULTS };
}

function save(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

function getTimerSeconds(settings) {
  const d = DIFFICULTIES.find((d) => d.key === settings.difficulty);
  return d ? d.seconds : DIFFICULTIES[0].seconds;
}

export { DIFFICULTIES, ALPHABETS, HIGHLIGHTS, DEFAULTS, load, save, getTimerSeconds };
