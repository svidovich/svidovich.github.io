class VocabularyObject {
  constructor(english, latin, cyrillic) {
    this.english = english;
    this.latin = latin;
    // Probably null, for now.
    this.cyrillic = cyrillic;
  }

  get asObject() {
    return {
      english: this.english,
      latin: this.latin,
      cyrillic: this.cyrillic,
    };
  }
}

class VocabularySection {
  constructor(friendlyName, vocabularyObjects) {
    this.friendlyName = friendlyName;
    this.vocabularyObjects = vocabularyObjects;
  }

  get asObject() {
    return {
      friendlyName: this.friendlyName,
      vocabularyObjects: [...this.vocabularyObjects].map((obj) => {
        obj.asObject;
      }),
    };
  }
}

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
  // TODO: This function sucks because you're bad
  // at javascript. Make it better eventually lol

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

export const UNIT_4_VOCAB = new VocabularySection("Sam's Unit 4 Vocab", [
  new VocabularyObject("Can I help you?", "Izvolite?", "Изволите?"),
  new VocabularyObject("Here you go.", "Izvolite.", "Изволите."),
  new VocabularyObject("Waitress", "Konobarica", "Конобарица"),
  new VocabularyObject("You're welcome", "Molim", "Молим"),
  new VocabularyObject("Thank you", "Hvala vam", "Хвала вам"),
  new VocabularyObject("Please", "Molim vas", "Молим вас"),
  new VocabularyObject("Cheers!", "Živeli!", "Живели!"),
  new VocabularyObject("Two beers", "Dva piva", "Два пива"),
  new VocabularyObject("One juice", "Jedan sok", "Један сок"),
  new VocabularyObject("Or", "Ili", "Или"),
  new VocabularyObject("Give me a coffee", "Dajte mi kafu", "Дајте ми кафу"),
  new VocabularyObject("Mineral water", "Kisela voda", "Кисела вода"),
  new VocabularyObject("OK", "U redu", "У реду"),
  new VocabularyObject("Immediately", "Odmah", "Одмах"),
  new VocabularyObject("Blueberry", "Borovnica", "Боровница"),
  new VocabularyObject("Raspberry", "Malina", "Малина"),
  new VocabularyObject("Strawberry", "Jagoda", "Јагода"),
  new VocabularyObject("Apple", "Jabuka", "Јабука"),
  new VocabularyObject("What do you want?", "Šta želite?", "Шта желите?"),
  new VocabularyObject("I'm thirsty.", "Žedan sam.", "Жедан сам"),
  new VocabularyObject("You too", "I vi", "И ви"),
  new VocabularyObject("Give us...", "Dajte nam...", "Дајте нам..."),
]);
