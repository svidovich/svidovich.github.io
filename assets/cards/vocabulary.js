// For your copy-pasting pleasure
// Đ đ
// Ž ž
// Ć ć
// Č č
// Dž dž
// Š š

export const FORMAT_FLASHCARDS = "flashcards";
export const FORMAT_QUIZ = "quiz";
export const FORMAT_T_OR_F = "true or false";

export const CSV_HEADER = "english,latin,cyrillic";

const JUGOSLAV_SINGLE_CHARACTER_MAP = {
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

export const latinToJugoslavCyrillic = (inputString) => {
  // Manually replace the  two-character substitutions
  let incompleteReplacement = inputString
    .replace("Nj", "Њ")
    .replace("nj", "њ")
    .replace("Dž", "Џ")
    .replace("dž", "џ")
    .replace("Lj", "Љ")
    .replace("lj", "љ");
  let newString = "";
  [...incompleteReplacement].forEach((character) => {
    if (JUGOSLAV_SINGLE_CHARACTER_MAP.hasOwnProperty(character)) {
      newString += JUGOSLAV_SINGLE_CHARACTER_MAP[character];
    } else {
      newString += character;
    }
  });
  return newString;
};

export class VocabularyObject {
  constructor(english, latin) {
    this.english = english;
    this.latin = latin;
    this.cyrillic = latinToJugoslavCyrillic(latin);
  }

  get asObject() {
    return {
      english: this.english,
      latin: this.latin,
      cyrillic: this.cyrillic,
    };
  }
}

export class VocabularySection {
  constructor(friendlyName, unfriendlyName, vocabularyObjects) {
    this.friendlyName = friendlyName;
    this.unfriendlyName = unfriendlyName;
    this.vocabularyObjects = vocabularyObjects;
    this.formats = [FORMAT_FLASHCARDS, FORMAT_QUIZ, FORMAT_T_OR_F];
  }

  get asObject() {
    const vocabularyObjects = new Array();
    this.vocabularyObjects.forEach((obj) => {
      vocabularyObjects.push(obj.asObject);
    });
    return {
      friendlyName: this.friendlyName,
      unfriendlyName: this.unfriendlyName,
      vocabularyObjects: vocabularyObjects,
    };
  }

  get asJSON() {
    return JSON.stringify(this.asObject.vocabularyObjects);
  }

  get asCSV() {
    let textCSV = `${CSV_HEADER}\n`;
    this.vocabularyObjects.forEach((vocabularyObject) => {
      textCSV = textCSV.concat(`${vocabularyObject.english},${vocabularyObject.latin},${vocabularyObject.cyrillic}\n`);
    });
    return textCSV;
  }
}

// obj shoulld be of the form {english: <str>, latin: <str>}
export const vocabularyObjectFromObject = (obj) => {
  return new VocabularyObject(obj.english, obj.latin);
};

// An array of objects of the form accepted by vocabularyObjectFromObject
export const vocabularySectionFromArray = (friendlyName, unfriendlyName, arr) => {
  const vocabularyObjects = [];
  arr.forEach((obj) => {
    vocabularyObjects.push(vocabularyObjectFromObject(obj));
  });
  return new VocabularySection(friendlyName, unfriendlyName, vocabularyObjects);
};
