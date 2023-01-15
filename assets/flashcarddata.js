class VocabularyObject {
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

class VocabularySection {
  constructor(friendlyName, unfriendlyName, vocabularyObjects) {
    this.friendlyName = friendlyName;
    this.unfriendlyName = unfriendlyName;
    this.vocabularyObjects = vocabularyObjects;
  }

  get asObject() {
    return {
      friendlyName: this.friendlyName,
      unfriendlyName: this.unfriendlyName,
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

// For your copy-pasting pleasure
// A a
// B b
// V v
// G g
// D d
// Đ đ
// E e
// Ž ž
// Z z
// I i
// J j
// K k
// L l
// Lj lj
// M m
// N n
// Nj nj
// O o
// P p
// R r
// S s
// T t
// Ć ć
// U u
// F f
// H h
// C c
// Č č
// Dž dž
// Š š

export const UNIT_4_VOCAB = new VocabularySection('"Teach Yourself" Unit 4 Vocab', "teachYourselfUnit4Vocab", [
  new VocabularyObject("Can I help you?", "Izvolite?"),
  new VocabularyObject("Here you go.", "Izvolite."),
  new VocabularyObject("Waitress", "Konobarica"),
  new VocabularyObject("You're welcome", "Molim"),
  new VocabularyObject("Thank you", "Hvala vam"),
  new VocabularyObject("Please", "Molim vas"),
  new VocabularyObject("Cheers!", "Živeli!"),
  new VocabularyObject("Two beers", "Dva piva"),
  new VocabularyObject("One juice", "Jedan sok"),
  new VocabularyObject("Or", "Ili", "Или"),
  new VocabularyObject("Give me a coffee", "Dajte mi kafu"),
  new VocabularyObject("Mineral water", "Kisela voda"),
  new VocabularyObject("OK", "U redu"),
  new VocabularyObject("Immediately", "Odmah"),
  new VocabularyObject("Blueberry", "Borovnica"),
  new VocabularyObject("Raspberry", "Malina"),
  new VocabularyObject("Strawberry", "Jagoda"),
  new VocabularyObject("Apple", "Jabuka"),
  new VocabularyObject("What do you want?", "Šta želite?"),
  new VocabularyObject("I'm thirsty.", "Žedan sam."),
  new VocabularyObject("You too", "I vi"),
  new VocabularyObject("Give us...", "Dajte nam..."),
]);

export const UNIT_5_VOCAB = new VocabularySection('"Teach Yourself" Unit 5 Vocab', "teachYourselfUnit5Vocab", [
  new VocabularyObject("Hungry", "Gladan"),
  new VocabularyObject("Sandwich", "Sendvić"),
  new VocabularyObject("Here", "Ovde"),
  new VocabularyObject("With ham", "Sa šunkom"),
  new VocabularyObject("Saleswoman", "Prodavačica"),
  new VocabularyObject("We have", "Imamo"),
  new VocabularyObject("Bread", "Hleb"),
  new VocabularyObject("Filo pie", "Burek"),
  new VocabularyObject("With cheese", "Sa sirom"),
  new VocabularyObject("Crescent roll", "Kifle"),
  new VocabularyObject("With meat", "Sa mesom"),
  new VocabularyObject("Yogurt", "Jogurt"),
  new VocabularyObject("Menu", "Jelovnik"),
  new VocabularyObject("Mince Sausage", "Ćevapčići"),
  new VocabularyObject("Bottle", "Flaša"),
  new VocabularyObject("Bill ($)", "Račun"),
  new VocabularyObject("Desserts", "Slatkiši"),
  new VocabularyObject("Salad", "Salata"),
  new VocabularyObject("Clear soup", "Supa"),
  new VocabularyObject("Thick soup", "Čorba"),
  new VocabularyObject("Prosciutto", "Pršut"),
  new VocabularyObject("Beef soup", "Goveđa supa"),
  new VocabularyObject("Grilled Mushrooms", "Pečurka na žaru"),
  new VocabularyObject("Mince burger", "Pljeskavica"),
]);

export const NUMBERS_5_to_100 = new VocabularySection("Numbers 5 to 100", "numbers5To100", [
  new VocabularyObject("5", "pet"),
  new VocabularyObject("6", "šest"),
  new VocabularyObject("7", "sedam"),
  new VocabularyObject("8", "osam"),
  new VocabularyObject("9", "devet"),
  new VocabularyObject("10", "deset"),
  new VocabularyObject("11", "jedanaest"),
  new VocabularyObject("12", "dvanaest"),
  new VocabularyObject("13", "trinaest"),
  new VocabularyObject("14", "četrnaest"),
  new VocabularyObject("15", "petnaest"),
  new VocabularyObject("16", "šestnaest"),
  new VocabularyObject("17", "sedamnaest"),
  new VocabularyObject("18", "osamnaest"),
  new VocabularyObject("19", "devetnaest"),
  new VocabularyObject("20", "dvadeset"),
  new VocabularyObject("30", "trideset"),
  new VocabularyObject("40", "četrdeset"),
  new VocabularyObject("50", "pedeset"),
  new VocabularyObject("60", "šezdeset"),
  new VocabularyObject("70", "sedamdeset"),
  new VocabularyObject("80", "osamdeset"),
  new VocabularyObject("90", "devedeset"),
  new VocabularyObject("100", "sto"),
]);

// Generates a mapping like
// {
//   <object.unfriendlyName>: object,...
// }
export const practiceMap = [NUMBERS_5_to_100, UNIT_4_VOCAB, UNIT_5_VOCAB].reduce((newObject, practiceObject) => {
  newObject[practiceObject.unfriendlyName] = practiceObject;
  return newObject;
}, {});
