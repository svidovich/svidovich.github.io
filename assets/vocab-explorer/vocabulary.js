/**
 * Vocabulary data for each room.
 * Serbian words stored in Latin script; Cyrillic generated at runtime.
 */

// ── Latin → Cyrillic converter (same logic as flashcard app) ──

const CYRILLIC_MAP = {
  A: "А",
  a: "а",
  B: "Б",
  b: "б",
  V: "В",
  v: "в",
  G: "Г",
  g: "г",
  D: "Д",
  d: "д",
  Đ: "Ђ",
  đ: "ђ",
  E: "Е",
  e: "е",
  Ž: "Ж",
  ž: "ж",
  Z: "З",
  z: "з",
  I: "И",
  i: "и",
  J: "Ј",
  j: "ј",
  K: "К",
  k: "к",
  L: "Л",
  l: "л",
  M: "М",
  m: "м",
  N: "Н",
  n: "н",
  O: "О",
  o: "о",
  P: "П",
  p: "п",
  R: "Р",
  r: "р",
  S: "С",
  s: "с",
  T: "Т",
  t: "т",
  Ć: "Ћ",
  ć: "ћ",
  U: "У",
  u: "у",
  F: "Ф",
  f: "ф",
  H: "Х",
  h: "х",
  C: "Ц",
  c: "ц",
  Č: "Ч",
  č: "ч",
  Š: "Ш",
  š: "ш",
};

export function latinToCyrillic(str) {
  let s = str
    .replace(/Nj/g, "Њ")
    .replace(/nj/g, "њ")
    .replace(/Dž/g, "Џ")
    .replace(/dž/g, "џ")
    .replace(/Lj/g, "Љ")
    .replace(/lj/g, "љ");
  let out = "";
  for (const ch of s) {
    out += CYRILLIC_MAP[ch] || ch;
  }
  return out;
}

// ── Room data ──
// serbian field is Latin script; use latinToCyrillic() for Cyrillic display.

export const VOCABULARY = {
  kitchen: {
    name: { latin: "Kuhinja", cyrillic: "Кухиња", english: "Kitchen" },
    objects: [
      {
        id: "fridge",
        english: "refrigerator",
        serbian: "frižider",
        model: "models/kitchen/fridge.glb",
        position: { x: -4, y: 0, z: -4.5 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: 0.0015,
        // fallback if model fails to load
        size: { w: 1.2, h: 2.4, d: 0.8 },
        color: 0xcccccc,
      },
      {
        id: "stove",
        english: "stove",
        serbian: "šporet",
        model: "models/kitchen/stove.glb",
        scale: 1.25,
        position: { x: -1.5, y: 0.0, z: -4.5 },
        rotation: { x: 0, y: 270, z: 0 },
        size: { w: 1.0, h: 1.2, d: 0.8 },
        color: 0x444444,
      },
      {
        id: "sink",
        english: "sink",
        serbian: "sudopera",
        position: { x: 1.0, y: 0.6, z: -4.5 },
        size: { w: 1.0, h: 0.8, d: 0.6 },
        color: 0x888899,
      },
      {
        id: "table",
        english: "table",
        serbian: "sto",
        model: "models/general/table.glb",
        scale: 1.6,
        position: { x: 0, y: 0.0, z: 1.0 },
        size: { w: 1.8, h: 0.1, d: 1.2 },
        color: 0x8b5e3c,
      },
      {
        id: "chair",
        english: "chair",
        serbian: "stolica",
        position: { x: -1.2, y: 0.4, z: 1.0 },
        size: { w: 0.5, h: 0.8, d: 0.5 },
        color: 0x6b3a1f,
      },
      {
        id: "cup",
        english: "cup",
        serbian: "šolja",
        model: "models/kitchen/cup.glb",
        scale: 1.0,
        position: { x: -0.3, y: 1.1, z: 1.2 },
        size: { w: 0.12, h: 0.15, d: 0.12 },
        color: 0xf0e6d3,
      },
      {
        id: "plate",
        english: "plate",
        serbian: "tanjir",
        model: "models/kitchen/plate.glb",
        scale: 0.2,
        position: { x: -0.6, y: 1.05, z: 1.0 },
        size: { w: 0.3, h: 0.03, d: 0.3 },
        color: 0xffffff,
      },
      {
        id: "knife",
        english: "knife",
        serbian: "nož",
        position: { x: 0.0, y: 1.05, z: 0.5 },
        size: { w: 0.03, h: 0.02, d: 0.25 },
        color: 0xaaaaaa,
      },
      {
        id: "window",
        english: "window",
        serbian: "prozor",
        position: { x: 4.9, y: 2.0, z: -1.0 },
        size: { w: 0.05, h: 1.2, d: 1.5 },
        color: 0xaaddff,
      },
      {
        id: "door",
        english: "door",
        serbian: "vrata",
        position: { x: 0, y: 1.2, z: 4.9 },
        size: { w: 1.0, h: 2.4, d: 0.1 },
        color: 0x6b4226,
      },
      {
        id: "pot",
        english: "pot",
        serbian: "lonac",
        position: { x: -1.5, y: 1.3, z: -4.5 },
        size: { w: 0.3, h: 0.2, d: 0.3 },
        color: 0x666666,
      },
      {
        id: "spoon",
        english: "spoon",
        serbian: "kašika",
        position: { x: 0.4, y: 1.05, z: 0.6 },
        size: { w: 0.03, h: 0.02, d: 0.2 },
        color: 0xbbbbbb,
      },
    ],
  },
};
