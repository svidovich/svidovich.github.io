export const FORMAT_FLASHCARDS = "flashcards";
export const FORMAT_QUIZ = "quiz";

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
    this.formats = [FORMAT_FLASHCARDS, FORMAT_QUIZ];
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
  new VocabularyObject("Apple", "Jabuka"),
  new VocabularyObject("Blueberry", "Borovnica"),
  new VocabularyObject("Can I help you?", "Izvolite?"),
  new VocabularyObject("Cheers!", "Živeli!"),
  new VocabularyObject("Give me a coffee", "Dajte mi kafu"),
  new VocabularyObject("Give us...", "Dajte nam..."),
  new VocabularyObject("Here you go.", "Izvolite."),
  new VocabularyObject("I'm thirsty.", "Žedan sam."),
  new VocabularyObject("Immediately", "Odmah"),
  new VocabularyObject("Mineral water", "Kisela voda"),
  new VocabularyObject("OK", "U redu"),
  new VocabularyObject("One juice", "Jedan sok"),
  new VocabularyObject("Or", "Ili", "Или"),
  new VocabularyObject("Please", "Molim vas"),
  new VocabularyObject("Raspberry", "Malina"),
  new VocabularyObject("Strawberry", "Jagoda"),
  new VocabularyObject("Thank you", "Hvala vam"),
  new VocabularyObject("Two beers", "Dva piva"),
  new VocabularyObject("Waitress", "Konobarica"),
  new VocabularyObject("What do you want?", "Šta želite?"),
  new VocabularyObject("You too", "I vi"),
  new VocabularyObject("You're welcome", "Molim"),
]);

export const UNIT_5_VOCAB = new VocabularySection('"Teach Yourself" Unit 5 Vocab', "teachYourselfUnit5Vocab", [
  new VocabularyObject("Beef soup", "Goveđa supa"),
  new VocabularyObject("Bill ($)", "Račun"),
  new VocabularyObject("Bottle", "Flaša"),
  new VocabularyObject("Bread", "Hleb"),
  new VocabularyObject("Clear soup", "Supa"),
  new VocabularyObject("Crescent roll", "Kifle"),
  new VocabularyObject("Desserts", "Slatkiši"),
  new VocabularyObject("Filo pie", "Burek"),
  new VocabularyObject("Grilled Mushrooms", "Pečurka na žaru"),
  new VocabularyObject("Here", "Ovde"),
  new VocabularyObject("Hungry", "Gladan"),
  new VocabularyObject("Menu", "Jelovnik"),
  new VocabularyObject("Mince burger", "Pljeskavica"),
  new VocabularyObject("Mince Sausage", "Ćevapčići"),
  new VocabularyObject("Prosciutto", "Pršut"),
  new VocabularyObject("Salad", "Salata"),
  new VocabularyObject("Saleswoman", "Prodavačica"),
  new VocabularyObject("Sandwich", "Sendvić"),
  new VocabularyObject("Thick soup", "Čorba"),
  new VocabularyObject("We have", "Imamo"),
  new VocabularyObject("With cheese", "Sa sirom"),
  new VocabularyObject("With ham", "Sa šunkom"),
  new VocabularyObject("With meat", "Sa mesom"),
  new VocabularyObject("Yogurt", "Jogurt"),
]);

export const UNIT_6_VOCAB = new VocabularySection('"Teach Yourself" Unit 6 Vocab', "teachYourselfUnit6Vocab", [
  new VocabularyObject("Breakfast", "Doručak"),
  new VocabularyObject("Butter", "Buter"),
  new VocabularyObject("Can (drink)", "Limenka"),
  new VocabularyObject("Grocery Store", "Bakalnica"),
  new VocabularyObject("How many", "Koliko"),
  new VocabularyObject("I don't want...", "Neću..."),
  new VocabularyObject("I must...", "Moram..."),
  new VocabularyObject("It costs", "Košta"),
  new VocabularyObject("Kilogram", "Kilo"),
  new VocabularyObject("Lemon", "Limun"),
  new VocabularyObject("Litre", "Litar"),
  new VocabularyObject("Map", "Mapa"),
  new VocabularyObject("Milk", "Mleko"),
  new VocabularyObject("New", "Nov"),
  new VocabularyObject("Nothing more", "Ništa više"),
  new VocabularyObject("Only", "Samo"),
  new VocabularyObject("Plan", "Plan"),
  new VocabularyObject("Postcards", "Razglednice"),
  new VocabularyObject("Salesman", "Prodavac"),
  new VocabularyObject("See ya!", "Prijatno!"),
  new VocabularyObject("Shampoo", "Šampon"),
  new VocabularyObject("Soap", "Sapun"),
  new VocabularyObject("Something else", "Još nešto"),
  new VocabularyObject("Something", "Nešto"),
  new VocabularyObject("That (f)", "Ta"),
  new VocabularyObject("That (m)", "Taj"),
  new VocabularyObject("That (n)", "To"),
  new VocabularyObject("That's all", "To je sve"),
  new VocabularyObject("There", "Tamo"),
  new VocabularyObject("These", "Ove"),
  new VocabularyObject("Thing", "Stvar"),
  new VocabularyObject("This", "Ovaj"),
  new VocabularyObject("Toothpaste", "Zubna pasta"),
  new VocabularyObject("We don't have...", "Nemamo..."),
  new VocabularyObject("We don't sell...", "Ne prodajemo..."),
  new VocabularyObject("Your change ($)", "Vaš kusur"),
]);

export const UNIT_7_VOCAB = new VocabularySection('"Teach Yourself" Unit 7 Vocab', "teachYourselfUnit7Vocab", [
  new VocabularyObject("We are", "Mi smo"),
  new VocabularyObject("That is", "To je"),
  new VocabularyObject("Large", "Veliki"),
  new VocabularyObject("In the park", "U parku"),
  new VocabularyObject("Fortress", "Tvrđava"),
  new VocabularyObject("Above", "Iznad"),
  new VocabularyObject("River", "Rijeka"),
  new VocabularyObject("Street", "Ulica"),
  new VocabularyObject("To be found", "Nalaziti se"),
  new VocabularyObject("Near", "Blizu"),
  new VocabularyObject("Long", "Dug"),
  new VocabularyObject("In the street", "U ulicu"),
  new VocabularyObject("They are", "Oni su"),
  new VocabularyObject("Gallery", "Galerija"),
  new VocabularyObject("On the square", "Na trgu"),
  new VocabularyObject("National museum", "Narodni muzej"),
  new VocabularyObject("To watch", "Gledati"),
  new VocabularyObject("Opera", "Opera"),
  new VocabularyObject("Ballet", "Balet"),
  new VocabularyObject("To reside", "Stanovati"),
  new VocabularyObject("His", "Njegov"),
  new VocabularyObject("Address", "Adresa"),
  new VocabularyObject("Phone number", "Telefonski broj"),
  new VocabularyObject("Below", "Ispod"),
  new VocabularyObject("Where", "Đe"),
  new VocabularyObject("Apartment", "Stan"),
  new VocabularyObject("Far", "Daleko"),
  new VocabularyObject("From", "Od"),
  new VocabularyObject("Who's that?", "Ko je to?"),
  new VocabularyObject("That woman", "Ona žena"),
  new VocabularyObject("In the pharmacy", "U apoteci"),
  new VocabularyObject("Is that...?", "Je li to...?"),
  new VocabularyObject("He / She / It is", "Jeste"),
  new VocabularyObject("Your", "Tvoj"),
  new VocabularyObject("Teacher", "Nastavnica"),
  new VocabularyObject("Are we...?", "Jesmo li...?"),
  new VocabularyObject("Well", "Pa"),
  new VocabularyObject("Now", "Sada"),
  new VocabularyObject("Class", "Čas"),
  new VocabularyObject("Come", "Dođi"),
  new VocabularyObject("Tomorrow", "Sutra"),
  new VocabularyObject("At / To my house", "Kod mene"),
  new VocabularyObject("For lunch", "Na ručak"),
  new VocabularyObject("Number", "Broj"),
  new VocabularyObject("Next to", "Pored"),
  new VocabularyObject("To know", "Znati"),
  new VocabularyObject("Opposite", "Preko Puta"),
  new VocabularyObject("After", "Posle"),
  new VocabularyObject("To stroll", "Šetati"),
  new VocabularyObject("Excellent", "Odlično"),
  new VocabularyObject("Until tomorrow", "Do sutra"),
  new VocabularyObject("From / Out of", "Iz"),
  new VocabularyObject("Where are you from?", "Odakle ste vi?"),
  new VocabularyObject("To live", "Živeti"),
  new VocabularyObject("Nice / Beautiful", "Lijep"),
  new VocabularyObject("Area", "Kraj"),
  new VocabularyObject("To work / To do", "Raditi"),
  new VocabularyObject("What's that?", "Šta je to?"),
  new VocabularyObject("Cinema", "Bioskop"),
  new VocabularyObject("Office", "Kancelarija"),
  new VocabularyObject("Exactly", "Tačno"),
  new VocabularyObject("Between", "Između"),
  new VocabularyObject("Doctor", "Lekar"),
  new VocabularyObject("Hospital", "Bolnica"),
]);

export const ANIMALS = new VocabularySection("Animals", "animals", [
  new VocabularyObject("Animal", "Životinja"),
  new VocabularyObject("Badger", "Jazavac"),
  new VocabularyObject("Bear", "Medved"),
  new VocabularyObject("Bird", "Ptica"),
  new VocabularyObject("Cat", "Mačka"),
  new VocabularyObject("Chicken", "Piletina"),
  new VocabularyObject("Cow", "Krava"),
  new VocabularyObject("Dog", "Pas"),
  new VocabularyObject("Fox", "Lisica"),
  new VocabularyObject("Goat", "Koza"),
  new VocabularyObject("Goose", "Guska"),
  new VocabularyObject("Horse", "Konj"),
  new VocabularyObject("Lion", "Lav"),
  new VocabularyObject("Mouse", "Miš"),
  new VocabularyObject("Pig", "Svinja"),
  new VocabularyObject("Rabbit", "Zec"),
  new VocabularyObject("Rooster", "Petao"),
  new VocabularyObject("Sheep", "Ovca"),
]);

export const COLORS = new VocabularySection("Colors", "colors", [
  new VocabularyObject("Black", "Crn"),
  new VocabularyObject("Blue", "Plav"),
  new VocabularyObject("Brown", "Smeđ"),
  new VocabularyObject("Color", "Boja"),
  new VocabularyObject("Gold", "Zlat"),
  new VocabularyObject("Green", "Zelen"),
  new VocabularyObject("Grey", "Siv"),
  new VocabularyObject("Orange", "Narančast"),
  new VocabularyObject("Pink", "Ruž"),
  new VocabularyObject("Purple", "Ljubičast"),
  new VocabularyObject("Red", "Crven"),
  new VocabularyObject("Silver", "Srebro"),
  new VocabularyObject("White", "Beo"),
  new VocabularyObject("Yellow", "Žut"),
]);

export const FAMILY = new VocabularySection("Family", "family", [
  new VocabularyObject("Ancestor ( female )", "Pređa"),
  new VocabularyObject("Ancestor ( male )", "Predak"),
  new VocabularyObject("Brother", "Brat"),
  new VocabularyObject("Cousin ( female )", "Sestrićna"),
  new VocabularyObject("Cousin ( male )", "Bratić"),
  new VocabularyObject("Dad", "Ćaća"),
  new VocabularyObject("Daughter", "Ćerka"),
  new VocabularyObject("Father", "Otac"),
  new VocabularyObject("Fraternal nephew", "Sinovac"),
  new VocabularyObject("Fraternal niece", "Bratanica"),
  new VocabularyObject("Granddaughter", "Unuka"),
  new VocabularyObject("Grandfather", "Đed"),
  new VocabularyObject("Grandmother", "Baba"),
  new VocabularyObject("Grandson", "Unuk"),
  new VocabularyObject("Great-granddaughter", "Praunuka"),
  new VocabularyObject("Great-grandfather", "Prađed"),
  new VocabularyObject("Great-grandmother", "Prababa"),
  new VocabularyObject("Great-grandson", "Praunuk"),
  new VocabularyObject("Great-great-grandfather", "Šukunđed"),
  new VocabularyObject("Great-great-grandmother", "Šukunbaba"),
  new VocabularyObject("Maternal Uncle", "Ujak"),
  new VocabularyObject("Mom", "Mama"),
  new VocabularyObject("Mother", "Majka"),
  new VocabularyObject("Paternal Uncle", "Čiča"),
  new VocabularyObject("Relative ( female )", "Rođaka"),
  new VocabularyObject("Relative ( male )", "Rođak"),
  new VocabularyObject("Sister", "Sestra"),
  new VocabularyObject("Son", "Sin"),
  new VocabularyObject("Sororal nephew", "Sestrić"),
  new VocabularyObject("Sororal niece", "Sestričina"),
]);

export const INDEFINITE_PRONOUNS = new VocabularySection("Indefinite Pronouns", "indefinitePronouns", [
  new VocabularyObject("Who", "Ko"),
  new VocabularyObject("Somebody", "Neko"),
  new VocabularyObject("Nobody", "Niko"),
  new VocabularyObject("Anybody", "Iko"),
  new VocabularyObject("When", "Kada"),
  new VocabularyObject("Once", "Nekada"),
  new VocabularyObject("Never", "Nikada"),
  new VocabularyObject("Anytime", "Ikada"),
  new VocabularyObject("How", "Kako"),
  new VocabularyObject("Somehow", "Nekako"),
  new VocabularyObject("No way", "Nikako"),
  new VocabularyObject("Anyhow", "Ikako"),
  new VocabularyObject("What", "Šta"),
  new VocabularyObject("Something", "Nešto"),
  new VocabularyObject("Nothing", "Ništa"),
  new VocabularyObject("Where", "Đe"),
  new VocabularyObject("Somewhere", "Negde"),
  new VocabularyObject("Nowhere", "Nigde"),
  new VocabularyObject("Anywhere", "Igde"),
  new VocabularyObject("To where", "Kuda"),
  new VocabularyObject("To somewhere", "Nekuda"),
  new VocabularyObject("To nowhere", "Nikuda"),
  new VocabularyObject("To anywhere", "Ikuda"),
]);

export const NUMBERS_5_to_100 = new VocabularySection("Numbers 5 to 100", "numbers5To100", [
  new VocabularyObject("five", "pet"),
  new VocabularyObject("six", "šest"),
  new VocabularyObject("seven", "sedam"),
  new VocabularyObject("eight", "osam"),
  new VocabularyObject("nine", "devet"),
  new VocabularyObject("ten", "deset"),
  new VocabularyObject("eleven", "jedanaest"),
  new VocabularyObject("twelve", "dvanaest"),
  new VocabularyObject("thirteen", "trinaest"),
  new VocabularyObject("fourteen", "četrnaest"),
  new VocabularyObject("fifteen", "petnaest"),
  new VocabularyObject("sixteen", "šestnaest"),
  new VocabularyObject("seventeen", "sedamnaest"),
  new VocabularyObject("eighteen", "osamnaest"),
  new VocabularyObject("nineteen", "devetnaest"),
  new VocabularyObject("twenty", "dvadeset"),
  new VocabularyObject("thirty", "trideset"),
  new VocabularyObject("forty", "četrdeset"),
  new VocabularyObject("fifty", "pedeset"),
  new VocabularyObject("sixty", "šezdeset"),
  new VocabularyObject("seventy", "sedamdeset"),
  new VocabularyObject("eighty", "osamdeset"),
  new VocabularyObject("ninety", "devedeset"),
  new VocabularyObject("one-hundred", "sto"),
]);

const _DEBUG_SECTION = new VocabularySection("Debug", "debug", [
  new VocabularyObject("0", "0"),
  new VocabularyObject("1", "1"),
  new VocabularyObject("2", "2"),
  new VocabularyObject("3", "3"),
]);

// Generates a mapping like
// {
//   <object.unfriendlyName>: object,...
// }
export const practiceMap = [
  // _DEBUG_SECTION,
  ANIMALS,
  COLORS,
  FAMILY,
  INDEFINITE_PRONOUNS,
  NUMBERS_5_to_100,
  UNIT_4_VOCAB,
  UNIT_5_VOCAB,
  UNIT_6_VOCAB,
  UNIT_7_VOCAB,
].reduce((newObject, practiceObject) => {
  newObject[practiceObject.unfriendlyName] = practiceObject;
  return newObject;
}, {});
