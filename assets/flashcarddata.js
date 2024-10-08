import { vocabularySectionFromArray } from "./cards/vocabulary.js";
import {
  VERBS_1_JSON,
  VERBS_2_JSON,
  VERBS_3_JSON,
  VERBS_4_JSON,
  VERBS_5_JSON,
  VERBS_6_JSON,
  VERBS_7_JSON,
  VERBS_8_JSON,
} from "./cards/verbs.js";

const ADJECTIVE = "adjective";
const AGES = "ages";
const BATHROOM = "bathroom";
const BODY = "body";
const BUSINESS = "business";
const CITY = "city";
const CULTURE = "culture";
const COMPUTERS = "computers";
const CONJUNCTION = "conjunction";
const DEMONSTRATIVE_PRONOUN = "demonstrative_pronoun";
const DESCRIPTIONS_EVENTS = "descriptions_events";
const DESCRIPTIONS_ITEMS = "descriptions_items";
const DESCRIPTIONS_ORGANIZATIONS = "descriptions_organizations";
const DESCRIPTIONS_PEOPLE = "descriptions_people";
const DESCRIPTIONS_PLACES = "descriptions_places";
const DIRECTIONS = "directions";
const EDUCATION = "education";
const FAMILY_RELATIVES = "family_relatives";
const FOOD = "food";
const FUN = "fun";
const N_IDEA = "n_idea";
const N_PERSON = "n_person";
const N_PLACE = "n_place";
const N_THING = "n_thing";
const NATURE = "nature";
const NOUN = "noun";
const NUMBERS_COUNTING = "numbers_counting";
const ORDINAL = "ordinal";
const PEOPLE = "people";
const PHRASES_EVERYDAY = "phrases_everyday";
const PHRASES_CULTURAL = "phrases_cultural";
const PHRASES_RESTAURANT = "phrases_restaurant";
const PHRASES_SHOPPING = "phrases_shopping";
const SIZES = "sizes";
const STUFF = "stuff";
const TIME = "time";
const TRAVEL = "travel";
const VERB_INF = "verb_infinitive";
const WEATHER = "weather";

const ADJECTIVES_1_JSON = [
  { english: "Good", latin: "Dobar", categories: [ADJECTIVE] },
  { english: "New", latin: "Nov", categories: [ADJECTIVE] },
  {
    english: "First",
    latin: "Prvi",
    categories: [ADJECTIVE, ORDINAL, NUMBERS_COUNTING],
  },
  { english: "Last", latin: "Poslednji", categories: [ADJECTIVE] },
  { english: "Long", latin: "Dug", categories: [ADJECTIVE] },
  { english: "Own", latin: "Svoj", categories: [ADJECTIVE] },
  { english: "Other", latin: "Drugi", categories: [ADJECTIVE] },
  {
    english: "Old",
    latin: "Stari",
    categories: [ADJECTIVE, AGES, DESCRIPTIONS_PEOPLE],
  },
  { english: "Right", latin: "Desni", categories: [ADJECTIVE, DIRECTIONS] },
  { english: "Big", latin: "Veliki", categories: [ADJECTIVE, SIZES] },
  { english: "High", latin: "Visok", categories: [ADJECTIVE] },
  { english: "Different", latin: "Razni", categories: [ADJECTIVE] },
  { english: "Small", latin: "Mali", categories: [ADJECTIVE, SIZES] },
  { english: "Next", latin: "Sljedeći", categories: [ADJECTIVE] },
  { english: "Early", latin: "Rano", categories: [ADJECTIVE, TIME] },
  {
    english: "Young",
    latin: "Mlad",
    categories: [ADJECTIVE, AGES, DESCRIPTIONS_PEOPLE],
  },
  { english: "Important", latin: "Važan", categories: [ADJECTIVE] },
];

export const ADJECTIVES_1 = vocabularySectionFromArray(
  "Adjectives I",
  "adjectives1",
  ADJECTIVES_1_JSON
);

const ADJECTIVES_2_JSON = [
  {
    english: "Few",
    latin: "Nekolicini",
    categories: [ADJECTIVE, NUMBERS_COUNTING],
  },
  {
    english: "Public",
    latin: "Državni",
    categories: [ADJECTIVE, DESCRIPTIONS_PLACES, DESCRIPTIONS_ORGANIZATIONS],
  },
  { english: "Bad", latin: "Loš", categories: [ADJECTIVE] },
  {
    english: "Able",
    latin: "Sposoban",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE],
  },
  { english: "Specific", latin: "Naročit", categories: [ADJECTIVE] },
  { english: "General", latin: "Opšti", categories: [ADJECTIVE] },
  { english: "Certain", latin: "Siguran", categories: [ADJECTIVE] },
  { english: "Free", latin: "Slobod", categories: [ADJECTIVE] },
  {
    english: "Open",
    latin: "Otvoren",
    categories: [ADJECTIVE, DESCRIPTIONS_PLACES],
  },
  { english: "Whole", latin: "Ceo", categories: [ADJECTIVE] },
  {
    english: "Short",
    latin: "Kratak",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE],
  },
  { english: "Easy", latin: "Lak", categories: [ADJECTIVE] },
  {
    english: "Strong",
    latin: "Jak",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE],
  },
  {
    english: "Special",
    latin: "Poseban",
    categories: [ADJECTIVE, DESCRIPTIONS_EVENTS],
  },
  { english: "Clear", latin: "Jasan", categories: [ADJECTIVE, WEATHER] },
  { english: "Recent", latin: "Nedavan", categories: [ADJECTIVE, TIME] },
  { english: "Late", latin: "Kasan", categories: [ADJECTIVE, TIME] },
  { english: "Single", latin: "Jedan", categories: [ADJECTIVE] },
  {
    english: "Medical",
    latin: "Medicinski",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS],
  },
  {
    english: "Central",
    latin: "Centralan",
    categories: [ADJECTIVE, DESCRIPTIONS_PLACES, DESCRIPTIONS_ORGANIZATIONS],
  },
];

export const ADJECTIVES_2 = vocabularySectionFromArray(
  "Adjectives II",
  "adjectives2",
  ADJECTIVES_2_JSON
);

const ADJECTIVES_3_JSON = [
  { english: "Common", latin: "Uobičajen", categories: [ADJECTIVE] },
  {
    english: "Poor",
    latin: "Jadan",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE],
  },
  {
    english: "Major",
    latin: "Glavan",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS, DESCRIPTIONS_EVENTS],
  },
  {
    english: "Happy",
    latin: "Sretan",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE, DESCRIPTIONS_EVENTS],
  },
  {
    english: "Serious",
    latin: "Ozbiljan",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE, DESCRIPTIONS_EVENTS],
  },
  { english: "Ready", latin: "Spreman", categories: [ADJECTIVE] },
  {
    english: "Environmental",
    latin: "Ekološki",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS, DESCRIPTIONS_EVENTS],
  },
  {
    english: "Financial",
    latin: "Financijski",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS],
  },
  {
    english: "Federal",
    latin: "Federalni",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS],
  },
  {
    english: "Necessary",
    latin: "Potreban",
    categories: [ADJECTIVE, DESCRIPTIONS_EVENTS],
  },
  {
    english: "Military",
    latin: "Vojan",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS],
  },
  { english: "Original", latin: "Izvoran", categories: [ADJECTIVE] },
  {
    english: "Successful",
    latin: "Uspješan",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE],
  },
  { english: "Sufficient", latin: "Dovoljan", categories: [ADJECTIVE] },
  { english: "Electrical", latin: "Električni", categories: [ADJECTIVE] },
  { english: "Expensive", latin: "Skupi", categories: [ADJECTIVE] },
  {
    english: "Academic",
    latin: "Akademski",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS],
  },
  { english: "Aware", latin: "Svjestan", categories: [ADJECTIVE] },
  { english: "Additional", latin: "Dodatan", categories: [ADJECTIVE] },
];

export const ADJECTIVES_3 = vocabularySectionFromArray(
  "Adjectives III",
  "adjectives3",
  ADJECTIVES_3_JSON
);

const ADJECTIVES_4_JSON = [
  { english: "Available", latin: "Dostupan", categories: [ADJECTIVE] },
  {
    english: "Comfortable",
    latin: "Udoban",
    categories: [ADJECTIVE, DESCRIPTIONS_ITEMS],
  },
  {
    english: "Traditional",
    latin: "Tradicionalno",
    categories: [ADJECTIVE, DESCRIPTIONS_ITEMS, DESCRIPTIONS_EVENTS],
  },
  {
    english: "Cultural",
    latin: "Kulturan",
    categories: [ADJECTIVE, DESCRIPTIONS_EVENTS, DESCRIPTIONS_ORGANIZATIONS],
  },
  { english: "Primary", latin: "Primaran", categories: [ADJECTIVE] },
  {
    english: "Professional",
    latin: "Profesionalni",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS, DESCRIPTIONS_PEOPLE],
  },
  {
    english: "International",
    latin: "Međunarodni",
    categories: [ADJECTIVE, TRAVEL],
  },
  {
    english: "Useful",
    latin: "Koristan",
    categories: [ADJECTIVE, DESCRIPTIONS_ITEMS, DESCRIPTIONS_PEOPLE],
  },
  {
    english: "Historical",
    latin: "Istorijski",
    categories: [
      ADJECTIVE,
      DESCRIPTIONS_ORGANIZATIONS,
      DESCRIPTIONS_EVENTS,
      TIME,
    ],
  },
  {
    english: "Effective",
    latin: "Učinkovito",
    categories: [ADJECTIVE, DESCRIPTIONS_ITEMS],
  },
  {
    english: "Similar",
    latin: "Sličan",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE, DESCRIPTIONS_ITEMS],
  },
  {
    english: "Psychological",
    latin: "Psihološki",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS],
  },
  {
    english: "Reasonable",
    latin: "Razuman",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE],
  },
  { english: "Accurate", latin: "Točno", categories: [ADJECTIVE] },
  { english: "Difficult", latin: "Teško", categories: [ADJECTIVE] },
  {
    english: "Administrative",
    latin: "Upravni",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS],
  },
  { english: "Critical", latin: "Kritičan", categories: [ADJECTIVE] },
  { english: "Unable", latin: "Nesposoban", categories: [ADJECTIVE] },
  { english: "Efficient", latin: "Efikasan", categories: [ADJECTIVE] },
  {
    english: "Interesting",
    latin: "Zanimljiv",
    categories: [
      ADJECTIVE,
      DESCRIPTIONS_PEOPLE,
      DESCRIPTIONS_ITEMS,
      DESCRIPTIONS_EVENTS,
    ],
  },
];

export const ADJECTIVES_4 = vocabularySectionFromArray(
  "Adjectives IV",
  "adjectives4",
  ADJECTIVES_4_JSON
);

const ADJECTIVES_5_JSON = [
  {
    english: "Legal",
    latin: "Legalan",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS],
  },
  {
    english: "Responsible",
    latin: "Odgovorno",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE],
  },
  {
    english: "Residential",
    latin: "Stambeni",
    categories: [ADJECTIVE, DESCRIPTIONS_PLACES],
  },
  { english: "Widespread", latin: "Rasprostranjena", categories: [ADJECTIVE] },
  {
    english: "Spiritual",
    latin: "Duhovan",
    categories: [
      ADJECTIVE,
      DESCRIPTIONS_PEOPLE,
      DESCRIPTIONS_ORGANIZATIONS,
      DESCRIPTIONS_EVENTS,
      DESCRIPTIONS_ITEMS,
    ],
  },
  {
    english: "Cute",
    latin: "Sladak",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE],
  },
  {
    english: "Civil",
    latin: "Građanski",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS, DESCRIPTIONS_EVENTS],
  },
  { english: "Detailed", latin: "Detaljan", categories: [ADJECTIVE] },
  {
    english: "Valuable",
    latin: "Vredan",
    categories: [ADJECTIVE, DESCRIPTIONS_ITEMS, DESCRIPTIONS_PEOPLE],
  },
  {
    english: "Popular",
    latin: "Popularan",
    categories: [
      ADJECTIVE,
      DESCRIPTIONS_PEOPLE,
      DESCRIPTIONS_EVENTS,
      DESCRIPTIONS_PLACES,
    ],
  },
  {
    english: "Technical",
    latin: "Tehnički",
    categories: [ADJECTIVE, DESCRIPTIONS_ORGANIZATIONS, DESCRIPTIONS_PEOPLE],
  },
  { english: "Typical", latin: "Tipičan", categories: [ADJECTIVE] },
  {
    english: "Competitive",
    latin: "Natjecateljski",
    categories: [
      ADJECTIVE,
      DESCRIPTIONS_PEOPLE,
      DESCRIPTIONS_ORGANIZATIONS,
      DESCRIPTIONS_EVENTS,
    ],
  },
  { english: "Appropriate", latin: "Prikladan", categories: [ADJECTIVE] },
  {
    english: "Private",
    latin: "Privatan",
    categories: [ADJECTIVE, DESCRIPTIONS_PLACES],
  },
  { english: "Essential", latin: "Suštinski", categories: [ADJECTIVE] },
  { english: "Physical", latin: "Fizički", categories: [ADJECTIVE] },
  {
    english: "Remarkable",
    latin: "Izvanredan",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE, DESCRIPTIONS_PLACES],
  },
  { english: "Temporary", latin: "Privremen", categories: [ADJECTIVE] },
  {
    english: "Reliable",
    latin: "Pouzdan",
    categories: [ADJECTIVE, DESCRIPTIONS_ITEMS, DESCRIPTIONS_PEOPLE],
  },
];

export const ADJECTIVES_5 = vocabularySectionFromArray(
  "Adjectives V",
  "adjectives5",
  ADJECTIVES_5_JSON
);

const NOUNS_1_JSON = [
  { english: "Time", latin: "Vremena", categories: [NOUN, TIME, N_THING] },
  { english: "Year", latin: "Godina", categories: [NOUN, TIME, N_THING] },
  { english: "People", latin: "Ljudi", categories: [NOUN, N_PERSON, PEOPLE] },
  {
    english: "Way",
    latin: "Put",
    categories: [NOUN, DIRECTIONS, N_IDEA, N_PLACE],
  },
  { english: "Day", latin: "Dan", categories: [NOUN, TIME, N_THING] },
  { english: "Man", latin: "Čovijek", categories: [NOUN, N_PERSON, PEOPLE] },
  { english: "Thing", latin: "Stvar", categories: [NOUN, N_THING] },
  { english: "Woman", latin: "Žena", categories: [NOUN, PEOPLE] },
  { english: "Life", latin: "Život", categories: [NOUN, N_IDEA, N_THING] },
  { english: "Child", latin: "Deca", categories: [NOUN, N_PERSON, PEOPLE] },
  { english: "World", latin: "Zemlja", categories: [NOUN, N_PLACE, N_THING] },
  { english: "School", latin: "Škola", categories: [NOUN, N_PLACE] },
  { english: "State", latin: "Država", categories: [NOUN, N_IDEA] },
  { english: "Family", latin: "Porodica", categories: [NOUN, PEOPLE, N_THING] },
  { english: "Student", latin: "Đak", categories: [NOUN, PEOPLE, N_PERSON] },
  { english: "Group", latin: "Grupa", categories: [NOUN, PEOPLE, N_THING] },
  { english: "Country", latin: "Zemlja", categories: [NOUN, N_PLACE, N_IDEA] },
  { english: "Problem", latin: "Problem", categories: [NOUN, N_THING] },
  { english: "Hand", latin: "Ruk", categories: [NOUN, N_THING, BODY] },
];

const NOUNS_1 = vocabularySectionFromArray("Nouns I", "nouns1", NOUNS_1_JSON);

const NOUNS_2_JSON = [
  { english: "Part", latin: "Dio", categories: [NOUN, N_THING, N_IDEA] },
  {
    english: "Place",
    latin: "Mjesto",
    categories: [NOUN, N_PLACE, N_THING, N_IDEA],
  },
  { english: "Case", latin: "Slučaj", categories: [NOUN, BUSINESS, N_THING] },
  { english: "Week", latin: "Nedelja", categories: [NOUN, N_THING, TIME] },
  {
    english: "Company",
    latin: "Firman",
    categories: [NOUN, BUSINESS, N_THING, N_IDEA],
  },
  {
    english: "System",
    latin: "Sistem",
    categories: [NOUN, BUSINESS, COMPUTERS, N_THING, N_IDEA, N_PLACE],
  },
  {
    english: "Program",
    latin: "Programa",
    categories: [NOUN, BUSINESS, COMPUTERS, N_THING, N_IDEA],
  },
  {
    english: "Question",
    latin: "Pitanja",
    categories: [NOUN, N_THING, N_IDEA, EDUCATION],
  },
  {
    english: "Work",
    latin: "Posla",
    categories: [NOUN, BUSINESS, N_THING, N_IDEA],
  },
  {
    english: "Government",
    latin: "Vlada",
    categories: [NOUN, N_THING, N_IDEA],
  },
  {
    english: "Number",
    latin: "Broj",
    categories: [NOUN, N_THING, N_IDEA, NUMBERS_COUNTING],
  },
  { english: "Night", latin: "Noć", categories: [NOUN, TIME, N_THING] },
  {
    english: "Point",
    latin: "Točka",
    categories: [NOUN, N_THING, NUMBERS_COUNTING],
  },
  { english: "Home", latin: "Kuć", categories: [NOUN, N_PLACE, N_IDEA] },
  { english: "Water", latin: "Voda", categories: [NOUN, N_THING] },
  { english: "Room", latin: "Soba", categories: [NOUN, N_PLACE, N_THING] },
  { english: "Mother", latin: "Majka", categories: [NOUN, PEOPLE, N_PERSON] },
  { english: "Area", latin: "Mjesto", categories: [NOUN, N_PLACE] },
  { english: "Money", latin: "Novac", categories: [NOUN, N_THING, N_IDEA] },
  {
    english: "Story",
    latin: "Priča",
    categories: [NOUN, EDUCATION, N_THING, N_IDEA],
  },
];
const NOUNS_2 = vocabularySectionFromArray("Nouns II", "nouns2", NOUNS_2_JSON);

const NOUNS_3_JSON = [
  {
    english: "Fact",
    latin: "Činjenica",
    categories: [NOUN, N_THING, N_IDEA, EDUCATION],
  },
  { english: "Month", latin: "Mjesec", categories: [NOUN, N_THING, TIME] },
  { english: "Lot (of land)", latin: "Zemljište", categories: [NOUN, N_PLACE] },
  { english: "Right", latin: "Pravo", categories: [NOUN, DIRECTIONS] },
  { english: "Study", latin: "Studija", categories: [NOUN, EDUCATION, N_IDEA] },
  { english: "Book", latin: "Knjiga", categories: [NOUN, N_THING, EDUCATION] },
  { english: "Eye", latin: "Oko", categories: [NOUN, BODY, N_THING] },
  {
    english: "Job",
    latin: "Posa",
    categories: [NOUN, N_THING, BUSINESS, N_IDEA],
  },
  {
    english: "Word",
    latin: "Reč",
    categories: [NOUN, EDUCATION, N_THING, N_IDEA],
  },
  {
    english: "Business",
    latin: "Bisnes",
    categories: [NOUN, BUSINESS, N_THING, N_IDEA],
  },
  {
    english: "Issue (e.g. magazine)",
    latin: "Izdanje",
    categories: [NOUN, N_THING],
  },
  { english: "Side", latin: "Strana", categories: [NOUN, DIRECTIONS] },
  { english: "Kind", latin: "Vrsta", categories: [NOUN] },
  {
    english: "Head",
    latin: "Glava",
    categories: [NOUN, BODY, BUSINESS, N_THING],
  },
  { english: "House", latin: "Dom", categories: [NOUN, N_PLACE, N_THING] },
  { english: "Service", latin: "Služba", categories: [NOUN, BUSINESS, N_IDEA] },
  {
    english: "Friend",
    latin: "Prijatelja",
    categories: [NOUN, PEOPLE, N_PERSON],
  },
  {
    english: "Father",
    latin: "Otac",
    categories: [NOUN, PEOPLE, N_PERSON, FAMILY_RELATIVES],
  },
  { english: "Power", latin: "Vlast", categories: [NOUN, BUSINESS, N_IDEA] },
  { english: "Hour", latin: "Sat", categories: [NOUN, TIME, N_THING] },
];
const NOUNS_3 = vocabularySectionFromArray("Nouns III", "nouns3", NOUNS_3_JSON);

const NOUNS_4_JSON = [
  { english: "Game", latin: "Igra", categories: [NOUN, N_THING, FUN] },
  { english: "Line", latin: "Linja", categories: [NOUN, EDUCATION, N_THING] },
  {
    english: "End",
    latin: "Kraj",
    categories: [NOUN, N_PLACE, N_THING, DIRECTIONS],
  },
  {
    english: "Member",
    latin: "Član",
    categories: [NOUN, PEOPLE, N_THING, N_IDEA],
  },
  {
    english: "Law",
    latin: "Zakon",
    categories: [NOUN, BUSINESS, EDUCATION, N_IDEA, N_THING],
  },
  { english: "Car", latin: "Kola", categories: [NOUN, N_THING] },
  { english: "City", latin: "Grad", categories: [NOUN, N_PLACE, N_THING] },
  {
    english: "Community",
    latin: "Zajednica",
    categories: [NOUN, N_THING, PEOPLE],
  },
  { english: "Name", latin: "Ime", categories: [NOUN, PEOPLE, N_THING] },
  {
    english: "President",
    latin: "Presjednik",
    categories: [NOUN, N_PERSON, BUSINESS],
  },
  {
    english: "Team",
    latin: "Ekipa",
    categories: [NOUN, N_THING, N_IDEA, BUSINESS],
  },
  { english: "Minute", latin: "Minut", categories: [NOUN, N_THING, TIME] },
  { english: "Idea", latin: "Ideja", categories: [NOUN, N_THING, N_IDEA] },
  { english: "Kid", latin: "Mladić", categories: [NOUN, PEOPLE, N_PERSON] },
  { english: "Body", latin: "Tijelo", categories: [NOUN, BODY] },
  {
    english: "Information",
    latin: "Informacija",
    categories: [NOUN, N_THING, N_IDEA, COMPUTERS],
  },
  { english: "Back", latin: "Leđa", categories: [NOUN, DIRECTIONS, N_IDEA] },
  {
    english: "Parent",
    latin: "Roditelja",
    categories: [NOUN, N_PERSON, PEOPLE, FAMILY_RELATIVES],
  },
  { english: "Face", latin: "Lica", categories: [NOUN, N_THING, BODY] },
  { english: "Other", latin: "Drugi", categories: [NOUN] },
];
const NOUNS_4 = vocabularySectionFromArray("Nouns IV", "nouns4", NOUNS_4_JSON);

const NOUNS_5_JSON = [
  { english: "Level", latin: "Sprat", categories: [NOUN, N_PLACE, DIRECTIONS] },
  {
    english: "Office",
    latin: "Kancelarija",
    categories: [NOUN, N_PLACE, BUSINESS],
  },
  { english: "Door", latin: "Vrat", categories: [NOUN, N_PLACE] },
  { english: "Health", latin: "Zdravlje", categories: [NOUN, N_IDEA, BODY] },
  { english: "Person", latin: "Čovijek", categories: [NOUN, N_PERSON, PEOPLE] },
  {
    english: "Art",
    latin: "Umetnost",
    categories: [NOUN, N_IDEA, N_THING, EDUCATION, CULTURE],
  },
  { english: "War", latin: "Rat", categories: [NOUN, N_IDEA, N_THING] },
  {
    english: "History",
    latin: "Istorija",
    categories: [NOUN, N_IDEA, N_THING, EDUCATION],
  },
  { english: "Party", latin: "Zabava", categories: [NOUN, FUN, N_THING] },
  { english: "Result", latin: "Ishod", categories: [NOUN, N_THING] },
  { english: "Change", latin: "Promena", categories: [NOUN, N_THING, N_IDEA] },
  { english: "Morning", latin: "Jutro", categories: [NOUN, TIME, N_THING] },
  { english: "Reason", latin: "Razlog", categories: [NOUN, N_THING] },
  {
    english: "Research",
    latin: "Izučavanje",
    categories: [NOUN, EDUCATION, N_THING],
  },
  { english: "Girl", latin: "Devojka", categories: [NOUN, N_PERSON, PEOPLE] },
  { english: "Guy", latin: "Momak", categories: [NOUN, N_PERSON, PEOPLE] },
  {
    english: "Moment",
    latin: "Trenut",
    categories: [NOUN, TIME, N_THING, N_IDEA],
  },
  { english: "Air", latin: "Vazduh", categories: [NOUN, N_THING] },
  {
    english: "Teacher",
    latin: "Nastavnica",
    categories: [NOUN, EDUCATION, PEOPLE, N_PERSON],
  },
  { english: "Force", latin: "Sila", categories: [NOUN, N_THING, N_IDEA] },
  {
    english: "Education",
    latin: "Obrazovanje",
    categories: [NOUN, EDUCATION, N_IDEA, N_THING],
  },
];
const NOUNS_5 = vocabularySectionFromArray("Nouns V", "nouns5", NOUNS_5_JSON);

const VERBS_1 = vocabularySectionFromArray("Verbs I", "verbs1", VERBS_1_JSON);
const VERBS_2 = vocabularySectionFromArray("Verbs II", "verbs2", VERBS_2_JSON);
const VERBS_3 = vocabularySectionFromArray("Verbs III", "verbs3", VERBS_3_JSON);
const VERBS_4 = vocabularySectionFromArray("Verbs IV", "verbs4", VERBS_4_JSON);
const VERBS_5 = vocabularySectionFromArray("Verbs V", "verbs5", VERBS_5_JSON);
const VERBS_6 = vocabularySectionFromArray("Verbs VI", "verbs6", VERBS_6_JSON);
const VERBS_7 = vocabularySectionFromArray("Verbs VII", "verbs7", VERBS_7_JSON);
const VERBS_8 = vocabularySectionFromArray(
  "Verbs VIII",
  "verbs8",
  VERBS_8_JSON
);

const UNIT_4_VOCAB_JSON = [
  { english: "Apple", latin: "Jabuka", categories: [N_THING, FOOD] },
  { english: "Blueberry", latin: "Borovnica", categories: [N_THING, FOOD] },
  {
    english: "Can I help you?",
    latin: "Izvolite?",
    categories: [PHRASES_EVERYDAY, PHRASES_RESTAURANT],
  },
  { english: "Cheers!", latin: "Živeli!", categories: [PHRASES_CULTURAL, FUN] },
  {
    english: "Give me a coffee",
    latin: "Dajte mi kafu",
    categories: [PHRASES_RESTAURANT],
  },
  {
    english: "Give us...",
    latin: "Dajte nam...",
    categories: [PHRASES_RESTAURANT],
  },
  {
    english: "Here you go.",
    latin: "Izvolite.",
    categories: [PHRASES_EVERYDAY, PHRASES_RESTAURANT],
  },
  {
    english: "I'm thirsty.",
    latin: "Žedan sam.",
    categories: [PHRASES_EVERYDAY],
  },
  { english: "Immediately", latin: "Odmah", categories: [ADJECTIVE] },
  {
    english: "Mineral water",
    latin: "Kisela voda",
    categories: [N_THING, FOOD],
  },
  { english: "OK", latin: "U redu", categories: [PHRASES_EVERYDAY] },
  {
    english: "One juice",
    latin: "Jedan sok",
    categories: [PHRASES_RESTAURANT],
  },
  { english: "Or", latin: "Ili", categories: [CONJUNCTION] },
  { english: "Please", latin: "Molim vas", categories: [PHRASES_EVERYDAY] },
  { english: "Raspberry", latin: "Malina", categories: [FOOD, N_THING] },
  { english: "Strawberry", latin: "Jagoda", categories: [FOOD, N_THING] },
  {
    english: "Thank you",
    latin: "Hvala vam",
    categories: [PHRASES_EVERYDAY, PHRASES_RESTAURANT, PHRASES_CULTURAL],
  },
  {
    english: "Two beers",
    latin: "Dva piva",
    categories: [, PHRASES_RESTAURANT],
  },
  {
    english: "Waitress",
    latin: "Konobarica",
    categories: [NOUN, N_PERSON, BUSINESS],
  },
  {
    english: "What do you want?",
    latin: "Šta želite?",
    categories: [PHRASES_RESTAURANT],
  },
  { english: "You too", latin: "I vi", categories: [PHRASES_EVERYDAY] },
  {
    english: "You're welcome",
    latin: "Molim",
    categories: [PHRASES_CULTURAL, PHRASES_EVERYDAY, PHRASES_RESTAURANT],
  },
];

export const UNIT_4_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 4 Vocab',
  "teachYourselfUnit4Vocab",
  UNIT_4_VOCAB_JSON
);

const UNIT_5_VOCAB_JSON = [
  { english: "Beef soup", latin: "Goveđa supa", categories: [N_THING, FOOD] },
  { english: "Bill ($)", latin: "Račun", categories: [N_THING, BUSINESS] },
  { english: "Bottle", latin: "Flaša", categories: [FOOD, N_THING] },
  { english: "Bread", latin: "Hleb", categories: [FOOD, N_THING] },
  { english: "Clear soup", latin: "Supa", categories: [FOOD, N_THING] },
  { english: "Crescent roll", latin: "Kifle", categories: [FOOD, N_THING] },
  { english: "Desserts", latin: "Slatkiši", categories: [FOOD, N_THING] },
  { english: "Filo pie", latin: "Burek", categories: [FOOD, N_THING] },
  {
    english: "Grilled Mushrooms",
    latin: "Pečurka na žaru",
    categories: [FOOD, N_THING],
  },
  { english: "Here", latin: "Ovde", categories: [N_PLACE, N_IDEA, DIRECTIONS] },
  {
    english: "Hungry",
    latin: "Gladan",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE],
  },
  { english: "Menu", latin: "Jelovnik", categories: [N_THING, FOOD] },
  {
    english: "Mince burger",
    latin: "Pljeskavica",
    categories: [FOOD, N_THING],
  },
  { english: "Mince Sausage", latin: "Ćevapčići", categories: [FOOD, N_THING] },
  { english: "Prosciutto", latin: "Pršut", categories: [FOOD, N_THING] },
  { english: "Salad", latin: "Salata", categories: [FOOD, N_THING] },
  {
    english: "Saleswoman",
    latin: "Prodavačica",
    categories: [BUSINESS, N_PERSON],
  },
  { english: "Sandwich", latin: "Sendvić", categories: [FOOD, N_THING] },
  { english: "Thick soup", latin: "Čorba", categories: [FOOD, N_THING] },
  {
    english: "We have",
    latin: "Imamo",
    categories: [PHRASES_EVERYDAY, PHRASES_RESTAURANT],
  },
  {
    english: "With cheese",
    latin: "Sa sirom",
    categories: [PHRASES_RESTAURANT],
  },
  { english: "With ham", latin: "Sa šunkom", categories: [PHRASES_RESTAURANT] },
  { english: "With meat", latin: "Sa mesom", categories: [PHRASES_RESTAURANT] },
  { english: "Yogurt", latin: "Jogurt", categories: [FOOD, N_THING] },
];

export const UNIT_5_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 5 Vocab',
  "teachYourselfUnit5Vocab",
  UNIT_5_VOCAB_JSON
);

const UNIT_6_VOCAB_JSON = [
  {
    english: "Breakfast",
    latin: "Doručak",
    categories: [FOOD, N_THING, N_IDEA],
  },
  { english: "Butter", latin: "Puter", categories: [FOOD, N_THING] },
  { english: "Can (drink)", latin: "Limenka", categories: [FOOD, N_THING] },
  { english: "Grocery Store", latin: "Bakalnica", categories: [N_PLACE, FOOD] },
  { english: "How many", latin: "Koliko", categories: [PHRASES_EVERYDAY] },
  {
    english: "I don't want...",
    latin: "Neću...",
    categories: [PHRASES_EVERYDAY, PHRASES_RESTAURANT, PHRASES_SHOPPING],
  },
  { english: "I must...", latin: "Moram...", categories: [PHRASES_EVERYDAY] },
  { english: "It costs", latin: "Košta", categories: [PHRASES_SHOPPING] },
  { english: "Kilogram", latin: "Kilo", categories: [N_IDEA, SIZES] },
  { english: "Lemon", latin: "Limun", categories: [FOOD, N_THING] },
  { english: "Litre", latin: "Litar", categories: [SIZES, N_IDEA] },
  { english: "Map", latin: "Mapa", categories: [N_THING, TRAVEL] },
  { english: "Milk", latin: "Mleko", categories: [FOOD, N_THING] },
  {
    english: "New",
    latin: "Nov",
    categories: [
      ADJECTIVE,
      DESCRIPTIONS_ITEMS,
      DESCRIPTIONS_PEOPLE,
      DESCRIPTIONS_PLACES,
    ],
  },
  {
    english: "Nothing more",
    latin: "Ništa više",
    categories: [PHRASES_SHOPPING, PHRASES_RESTAURANT],
  },
  {
    english: "Only",
    latin: "Samo",
    categories: [ADJECTIVE, DESCRIPTIONS_PEOPLE, DESCRIPTIONS_ITEMS],
  },
  { english: "Plan", latin: "Plan", categories: [N_THING, TRAVEL] },
  { english: "Postcards", latin: "Razglednice", categories: [N_THING, TRAVEL] },
  { english: "Salesman", latin: "Prodavac", categories: [BUSINESS, N_PERSON] },
  {
    english: "See ya!",
    latin: "Prijatno!",
    categories: [PHRASES_CULTURAL, PHRASES_EVERYDAY],
  },
  { english: "Shampoo", latin: "Šampon", categories: [N_THING, BATHROOM] },
  { english: "Soap", latin: "Sapun", categories: [N_THING, BATHROOM] },
  {
    english: "Something else",
    latin: "Još nešto",
    categories: [PHRASES_SHOPPING, PHRASES_RESTAURANT, PHRASES_EVERYDAY],
  },
  {
    english: "Something",
    latin: "Nešto",
    categories: [PHRASES_EVERYDAY, PHRASES_RESTAURANT, PHRASES_SHOPPING],
  },
  { english: "That (f)", latin: "Ta", categories: [DEMONSTRATIVE_PRONOUN] },
  { english: "That (m)", latin: "Taj", categories: [DEMONSTRATIVE_PRONOUN] },
  { english: "That (n)", latin: "To", categories: [DEMONSTRATIVE_PRONOUN] },
  {
    english: "That's all",
    latin: "To je sve",
    categories: [
      PHRASES_EVERYDAY,
      PHRASES_CULTURAL,
      PHRASES_RESTAURANT,
      PHRASES_SHOPPING,
    ],
  },
  { english: "There", latin: "Tamo", categories: [DIRECTIONS, N_PLACE] },
  { english: "These", latin: "Ove", categories: [DEMONSTRATIVE_PRONOUN] },
  { english: "Thing", latin: "Stvar", categories: [N_THING] },
  { english: "This", latin: "Ovaj", categories: [DEMONSTRATIVE_PRONOUN] },
  {
    english: "Toothpaste",
    latin: "Zubna pasta",
    categories: [BATHROOM, N_THING],
  },
  {
    english: "We don't have...",
    latin: "Nemamo...",
    categories: [PHRASES_SHOPPING, PHRASES_RESTAURANT],
  },
  {
    english: "We don't sell...",
    latin: "Ne prodajemo...",
    categories: [PHRASES_SHOPPING],
  },
  {
    english: "Your change ($)",
    latin: "Vaš kusur",
    categories: [PHRASES_SHOPPING, PHRASES_RESTAURANT],
  },
];

export const UNIT_6_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 6 Vocab',
  "teachYourselfUnit6Vocab",
  UNIT_6_VOCAB_JSON
);

const UNIT_7_VOCAB_JSON = [
  { english: "We are", latin: "Mi smo", categories: [PHRASES_EVERYDAY] },
  { english: "That is", latin: "To je", categories: [PHRASES_EVERYDAY] },
  {
    english: "Large",
    latin: "Veliki",
    categories: [
      DESCRIPTIONS_PEOPLE,
      DESCRIPTIONS_PLACES,
      DESCRIPTIONS_ORGANIZATIONS,
      SIZES,
    ],
  },
  { english: "In the park", latin: "U parku", categories: [DIRECTIONS, CITY] },
  { english: "Fortress", latin: "Tvrđava", categories: [N_PLACE, CULTURE] },
  { english: "Above", latin: "Iznad", categories: [DIRECTIONS] },
  { english: "River", latin: "Rijeka", categories: [N_PLACE, N_THING, NATURE] },
  { english: "Street", latin: "Ulica", categories: [N_PLACE, N_THING, CITY] },
  { english: "To be found", latin: "Nalaziti se", categories: [DIRECTIONS] },
  { english: "Near", latin: "Blizu", categories: [DIRECTIONS] },
  { english: "Long", latin: "Dug", categories: [SIZES] },
  { english: "They are", latin: "Oni su", categories: [PHRASES_EVERYDAY] },
  {
    english: "Gallery",
    latin: "Galerija",
    categories: [CULTURE, EDUCATION, N_PLACE, N_THING],
  },
  { english: "On the square", latin: "Na trgu", categories: [CITY, N_PLACE] },
  {
    english: "National museum",
    latin: "Narodni muzej",
    categories: [CULTURE, CITY, N_PLACE, N_THING],
  },
  { english: "To watch", latin: "Gledati", categories: [VERB_INF] },
  {
    english: "Opera",
    latin: "Opera",
    categories: [CULTURE, N_THING, N_PLACE, FUN],
  },
  {
    english: "Ballet",
    latin: "Balet",
    categories: [CULTURE, N_THING, N_PLACE, FUN],
  },
  { english: "To reside", latin: "Stanovati", categories: [VERB_INF, CITY] },
  { english: "His", latin: "Njegov", categories: [] },
  { english: "Address", latin: "Adresa", categories: [CITY, N_THING] },
  { english: "Phone number", latin: "Telefonski broj", categories: [N_THING] },
  { english: "Below", latin: "Ispod", categories: [DIRECTIONS] },
  { english: "Where", latin: "Đe", categories: [DIRECTIONS] },
  { english: "Apartment", latin: "Stan", categories: [CITY, N_PLACE] },
  {
    english: "Far",
    latin: "Daleko",
    categories: [DIRECTIONS, DESCRIPTIONS_PLACES],
  },
  { english: "From", latin: "Od", categories: [DIRECTIONS] },
  {
    english: "Who's that?",
    latin: "Ko je to?",
    categories: [PHRASES_EVERYDAY],
  },
  { english: "That woman", latin: "Ona žena", categories: [] },
  { english: "In the pharmacy", latin: "U apoteci", categories: [] },
  {
    english: "Is that...?",
    latin: "Je li to...?",
    categories: [PHRASES_EVERYDAY],
  },
  {
    english: "He / She / It is",
    latin: "Jeste",
    categories: [PHRASES_EVERYDAY],
  },
  { english: "Your", latin: "Tvoj", categories: [] },
  {
    english: "Are we...?",
    latin: "Jesmo li...?",
    categories: [PHRASES_EVERYDAY],
  },
  { english: "Well", latin: "Pa", categories: [PHRASES_EVERYDAY] },
  { english: "Now", latin: "Sada", categories: [TIME, N_THING, N_IDEA] },
  { english: "Class", latin: "Čas", categories: [EDUCATION, N_THING] },
  { english: "Come", latin: "Dođi", categories: [] },
  { english: "Tomorrow", latin: "Sutra", categories: [TIME, N_THING] },
  {
    english: "At / To my house",
    latin: "Kod mene",
    categories: [PHRASES_EVERYDAY],
  },
  { english: "For lunch", latin: "Na ručak", categories: [] },
  { english: "Number", latin: "Broj", categories: [N_THING] },
  {
    english: "Next to",
    latin: "Pored",
    categories: [DIRECTIONS, DESCRIPTIONS_PLACES],
  },
  { english: "To know", latin: "Znati", categories: [VERB_INF] },
  {
    english: "Opposite",
    latin: "Preko Puta",
    categories: [DIRECTIONS, DESCRIPTIONS_PLACES],
  },
  { english: "After", latin: "Posle", categories: [TIME] },
  { english: "To stroll", latin: "Šetati", categories: [VERB_INF] },
  {
    english: "Excellent",
    latin: "Odlično",
    categories: [
      DESCRIPTIONS_ITEMS,
      DESCRIPTIONS_ORGANIZATIONS,
      DESCRIPTIONS_PEOPLE,
      DESCRIPTIONS_PLACES,
      ADJECTIVE,
    ],
  },
  {
    english: "Until tomorrow",
    latin: "Do sutra",
    categories: [PHRASES_CULTURAL, PHRASES_EVERYDAY],
  },
  { english: "From / Out of", latin: "Iz", categories: [DIRECTIONS] },
  {
    english: "Where are you from?",
    latin: "Odakle ste vi?",
    categories: [PHRASES_EVERYDAY],
  },
  { english: "To live", latin: "Živeti", categories: [VERB_INF] },
  {
    english: "Nice / Beautiful",
    latin: "Lijep",
    categories: [
      DESCRIPTIONS_PEOPLE,
      DESCRIPTIONS_PLACES,
      DESCRIPTIONS_ITEMS,
      DESCRIPTIONS_EVENTS,
      ADJECTIVE,
    ],
  },
  { english: "Area", latin: "Kraj", categories: [N_PLACE, N_THING] },
  { english: "To work / To do", latin: "Raditi", categories: [VERB_INF] },
  {
    english: "What's that?",
    latin: "Šta je to?",
    categories: [PHRASES_EVERYDAY],
  },
  { english: "Cinema", latin: "Bioskop", categories: [CULTURE, FUN] },
  { english: "Exactly", latin: "Tačno", categories: [ADJECTIVE] },
  { english: "Between", latin: "Između", categories: [DIRECTIONS] },
  { english: "Doctor", latin: "Lekar", categories: [BODY, N_PERSON, N_THING] },
  {
    english: "Hospital",
    latin: "Bolnica",
    categories: [BODY, N_THING, N_PLACE],
  },
];

export const UNIT_7_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 7 Vocab',
  "teachYourselfUnit7Vocab",
  UNIT_7_VOCAB_JSON
);

const UNIT_8_VOCAB_JSON = [
  { english: "Food", latin: "Hrana", categories: [N_THING, FOOD] },
  { english: "Very", latin: "Vrlo", categories: [ADJECTIVE] },
  { english: "On foot", latin: "Peške", categories: [DIRECTIONS, TRAVEL] },
  { english: "Idite gore", latin: "Go up", categories: [DIRECTIONS, TRAVEL] },
  { english: "I onda", latin: "And then", categories: [PHRASES_EVERYDAY] },
  {
    english: "To turn",
    latin: "Skrenuti",
    categories: [VERB_INF, TRAVEL, DIRECTIONS],
  },
  { english: "Right", latin: "Desno", categories: [DIRECTIONS] },
  { english: "Left", latin: "Levo", categories: [DIRECTIONS] },
  { english: "Straight", latin: "Pravo", categories: [DIRECTIONS] },
  {
    english: "The right side",
    latin: "Desne strane",
    categories: [DIRECTIONS, TRAVEL],
  },
  {
    english: "On the corner",
    latin: "Na ćošku",
    categories: [DIRECTIONS, CITY],
  },
  {
    english: "Excuse me...",
    latin: "Izvinite...",
    categories: [PHRASES_EVERYDAY, PHRASES_RESTAURANT],
  },
  {
    english: "Of course",
    latin: "Naravno",
    categories: [PHRASES_EVERYDAY, PHRASES_RESTAURANT],
  },
  {
    english: "A little further",
    latin: "Malo dalje",
    categories: [DIRECTIONS, TRAVEL],
  },
  { english: "Again", latin: "Opet", categories: [] },
  { english: "How?", latin: "Kako?", categories: [] },
  { english: "To", latin: "Do", categories: [DIRECTIONS, TRAVEL] },
  {
    english: "Don't go",
    latin: "Nemojte ići",
    categories: [DIRECTIONS, TRAVEL],
  },
  {
    english: "By bus",
    latin: "Autobusom",
    categories: [DIRECTIONS, TRAVEL, CITY],
  },
  { english: "Should", latin: "Treba", categories: [] },
  { english: "To take", latin: "Uzeti", categories: [VERB_INF] },
  { english: "In front of", latin: "Ispred", categories: [DIRECTIONS] },
  { english: "Get down", latin: "Sići", categories: [DIRECTIONS] },
  { english: "To repeat", latin: "Ponoviti", categories: [VERB_INF] },
  { english: "Stamp", latin: "Marka", categories: [N_THING] },
  {
    english: "Abroad",
    latin: "Inostranstvo",
    categories: [TRAVEL, N_PLACE, N_IDEA],
  },
  { english: "From here", latin: "Odavde", categories: [DIRECTIONS, TRAVEL] },
  { english: "Traffic light", latin: "Semafor", categories: [CITY, N_THING] },
  { english: "To enter", latin: "Ući", categories: [VERB_INF] },
  { english: "Window", latin: "Šalter", categories: [N_THING] },
  { english: "To look for", latin: "Tražiti", categories: [VERB_INF] },
  { english: "To see", latin: "Videti", categories: [VERB_INF] },
  { english: "Person", latin: "Čovek", categories: [N_PERSON, N_THING] },
  { english: "Clerk", latin: "Službenik", categories: [N_PERSON, BUSINESS] },
  { english: "Letter", latin: "Pismo", categories: [] },
  { english: "I send", latin: "Šaljem", categories: [] },
  { english: "By air", latin: "Avionom", categories: [TRAVEL] },
  { english: "Entrance", latin: "Ulaz", categories: [N_THING, N_PLACE] },
];

export const UNIT_8_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 8 Vocab',
  "teachYourselfUnit8Vocab",
  UNIT_8_VOCAB_JSON
);

const UNIT_9_VOCAB_JSON = [
  { english: "About", latin: "O", category: [] },
  { english: "Airplane", latin: "Avion", category: [TRAVEL, N_THING] },
  {
    english: "Airport",
    latin: "Aerodrom",
    category: [TRAVEL, N_THING, N_PLACE],
  },
  { english: "Already", latin: "Već", category: [PHRASES_CULTURAL] },
  {
    english: "Apartment",
    latin: "Apartman",
    category: [CITY, N_PLACE, N_THING],
  },
  { english: "Arrived", latin: "Stigao", category: [] },
  {
    english: "Bathroom",
    latin: "Kupatilo",
    category: [BATHROOM, N_PLACE, N_THING],
  },
  { english: "Bought", latin: "Kupio", category: [] },
  {
    english: "Come on!",
    latin: "Hajde!",
    category: [PHRASES_CULTURAL, PHRASES_EVERYDAY],
  },
  { english: "Customs", latin: "Carina", category: [N_THING, TRAVEL] },
  { english: "Elevator", latin: "Lift", category: [] },
  {
    english: "Embassy",
    latin: "Ambasada",
    category: [N_PLACE, N_THING, TRAVEL],
  },
  { english: "Exit", latin: "Izlaz", category: [] },
  { english: "Flight", latin: "Let", category: [TRAVEL, N_THING] },
  { english: "Garage", latin: "Garaža", category: [N_PLACE, N_THING, CITY] },
  { english: "Got / Received", latin: "Dobio", category: [] },
  { english: "His", latin: "Svoj", category: [] },
  {
    english: "Important",
    latin: "Važno",
    category: [
      ADJECTIVE,
      DESCRIPTIONS_ITEMS,
      DESCRIPTIONS_PLACES,
      DESCRIPTIONS_PEOPLE,
      DESCRIPTIONS_EVENTS,
      DESCRIPTIONS_ORGANIZATIONS,
    ],
  },
  { english: "Key", latin: "Ključ", category: [N_THING, STUFF] },
  { english: "Lounge", latin: "Salon", category: [N_PLACE, N_THING, TRAVEL] },
  { english: "Passport", latin: "Pasoš", category: [N_THING, TRAVEL] },
  { english: "Quickly", latin: "Brzo", category: [] },
  { english: "Really", latin: "Zaista", category: [] },
  {
    english: "Receptionist",
    latin: "Recepcioner",
    category: [BUSINESS, N_PERSON],
  },
  { english: "Reservation", latin: "Rezervacija", category: [N_THING] },
  { english: "Room", latin: "Soba", category: [N_THING, N_PLACE] },
  { english: "Sleepover!", latin: "Noćenje!", category: [] },
  { english: "Suitcase", latin: "Kofer", category: [N_THING, TRAVEL] },
  { english: "Surname", latin: "Prezime", category: [N_THING, PEOPLE] },
  { english: "Telephone", latin: "Telefon", category: [N_THING] },
  { english: "Through", latin: "Kroz", category: [] },
  { english: "Ticket", latin: "Karta", category: [N_THING, TRAVEL] },
  { english: "To Discuss", latin: "Razgovarati", category: [VERB_INF] },
  { english: "To Drink", latin: "Popiti", category: [VERB_INF] },
  { english: "To Find", latin: "Nalaziti", category: [VERB_INF] },
  { english: "To Send", latin: "Poslati", category: [VERB_INF] },
  { english: "To Sign", latin: "Potpisivati", category: [VERB_INF] },
  { english: "Travelled", latin: "Putovao", category: [TRAVEL] },
  { english: "Visa", latin: "Viza", category: [N_THING, TRAVEL] },
  { english: "Waited", latin: "Čekao", category: [] },
];

export const UNIT_9_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 9 Vocab',
  "teachYourselfUnit9Vocab",
  UNIT_9_VOCAB_JSON
);

const UNIT_10_VOCAB_JSON = [
  { english: "At", latin: "Kod" },
  { english: "Because of", latin: "Zbog" },
  { english: "Bedroom", latin: "Spavaća Soba" },
  { english: "Book", latin: "Knjiga" },
  { english: "Boy", latin: "Mladić" },
  { english: "Brother", latin: "Brat" },
  { english: "Cake Shop", latin: "Poslastičarnica" },
  { english: "Cake", latin: "Kolač" },
  { english: "CD", latin: "CD" },
  { english: "Chair", latin: "Stolica" },
  { english: "Clique", latin: "Društvo" },
  { english: "Dad", latin: "Ćaća" },
  { english: "Daughter", latin: "Ćerka" },
  { english: "Dear", latin: "Dragi" },
  { english: "Dining Room", latin: "Trpezaria" },
  { english: "Engineer", latin: "Inženjer" },
  { english: "Expensive", latin: "Skup" },
  { english: "Family", latin: "Porodica" },
  { english: "Film", latin: "Film" },
  { english: "Garden", latin: "Bašta" },
  { english: "Gift", latin: "Poklon" },
  { english: "Girl", latin: "Devojka" },
  { english: "Here is...", latin: "Evo..." },
  { english: "History", latin: "Istorija" },
  { english: "House", latin: "Kuća" },
  { english: "Housewife", latin: "Domaćica" },
  { english: "In the Evening", latin: "Uveče" },
  { english: "Kind", latin: "Ljubazan" },
  { english: "Kitchen", latin: "Kuhinja" },
  { english: "Like / As", latin: "Kao" },
  { english: "Living place", latin: "Boravište" },
  { english: "Married (f)", latin: "Udata" },
  { english: "Married (m)", latin: "Oženjen" },
  { english: "Message", latin: "Poruka" },
  { english: "Mom", latin: "Mama" },
  { english: "New", latin: "Nov" },
  { english: "No longer", latin: "Više Ne" },
  { english: "No?", latin: "Zar ne?" },
  { english: "Not yet", latin: "Još ne" },
  { english: "People", latin: "Ljudi" },
  { english: "Photograph", latin: "Fotografija" },
  { english: "Poster", latin: "Poster" },
  { english: "Profession", latin: "Zanimanje" },
  { english: "Rarely", latin: "Retko" },
  { english: "Secretary (f)", latin: "Sekretarica" },
  { english: "Sitting Room", latin: "Dnevna Soba" },
  { english: "Small", latin: "Mali" },
  { english: "Some", latin: "Neki" },
  { english: "Something", latin: "Nešto" },
  { english: "Son", latin: "Sin" },
  { english: "Soon", latin: "Uskoro" },
  { english: "Still", latin: "Još uvijek" },
  { english: "Student (f)", latin: "Studentkinja" },
  { english: "Table", latin: "Sto" },
  { english: "Three-roomed", latin: "Trosoban" },
  { english: "To Carry", latin: "Nositi" },
  { english: "To Eat", latin: "Jesti" },
  { english: "To Keep", latin: "Držati" },
  { english: "To Like / Love", latin: "Voleti" },
  { english: "To Study", latin: "Studirati" },
  { english: "To Wear", latin: "Nositi" },
  { english: "To Write", latin: "Pisati" },
  { english: "Two children", latin: "Dva deteta" },
  { english: "Unfortunately", latin: "Na žalost" },
  { english: "University", latin: "Universitet" },
  { english: "Usually", latin: "Obično" },
  { english: "Village", latin: "Selo" },
  { english: "With parents", latin: "Sa roditeljima" },
  { english: "Year", latin: "Godina" },
];

export const UNIT_10_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 10 Vocab',
  "teachYourselfUnit10Vocab",
  UNIT_10_VOCAB_JSON
);

const UNIT_19_VOCAB_JSON = [
  { english: "Welcome", latin: "Dobro Došli" },
  { english: "Relative", latin: "Rođaka" },
  { english: "To bother", latin: "Smetati" },
  { english: "To interrupt", latin: "Prekidati" },
  { english: "Conversation", latin: "Razgovor" },
  { english: "Cooperation", latin: "Saradnja" },
  { english: "To gather", latin: "Sakupiti" },
  { english: "Interested", latin: "Zainteresovan" },
  { english: "Party", latin: "Stranka" },
  { english: "'All the best!'", latin: "Sve Najbolje!" },
  { english: "To apologize", latin: "Izviniti se" },
  { english: "At the moment", latin: "trenutno" },
  { english: "To meet", latin: "Sastati se" },
  { english: "A bit ago", latin: "Malopre" },
  { english: "To receive", latin: "Primati" },
  { english: "Special", latin: "Naročit" },
  { english: "To open", latin: "Otvoriti" },
  { english: "OK!", latin: "Važi!" },
  { english: "To win", latin: "Pobediti" },
  { english: "Certainly", latin: "Svakako" },
  { english: "Journey", latin: "Put" },
  { english: "To depend on", latin: "Zavisiti od" },
  { english: "To be late", latin: "Zakasniti" },
  { english: "Of course", latin: "To se zna" },
  { english: "To bump into", latin: "Sresti se" },
  { english: "With myself", latin: "Kod sebe" },
  { english: "From where...", latin: "Odakle" },
];

export const UNIT_19_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 19 Vocab',
  "teachYourselfUnit19Vocab",
  UNIT_19_VOCAB_JSON
);

const UNIT_20_VOCAB_JSON = [
  { english: "Dormitory", latin: "Studentski dom" },
  { english: "Since", latin: "Otkad" },
  { english: "Not at all", latin: "Uopšte ne" },
  { english: "To move", latin: "Seliti se" },
  { english: "Studies", latin: "Studije" },
  { english: "To teach", latin: "Predavati" },
  { english: "Never-the-less", latin: "Ipak" },
  { english: "To earn", latin: "Zaraditi" },
  { english: "Rent", latin: "Kirija" },
  { english: "Private", latin: "Privatan" },
  { english: "Sufficient", latin: "Dovoljan" },
  { english: "Offer", latin: "Ponuda" },
  { english: "To be friends", latin: "Družiti se" },
  { english: "Advertisement", latin: "Oglas" },
  { english: "In advance", latin: "Unapred" },
  { english: "The very center", latin: "Uži centar" },
  { english: "Narrow", latin: "Uzak" },
  { english: "Furnished", latin: "Namešten" },
  { english: "Central heating", latin: "Centralno grejanje" },
  { english: "Intercom", latin: "Interfon" },
  { english: "Advantage", latin: "Prednost" },
  { english: "Wide", latin: "Širok" },
  { english: "Empty", latin: "Prazan" },
  { english: "Space", latin: "Prostor" },
  { english: "By agreement", latin: "Po dogovoru" },
  { english: "Big-ish flat", latin: "Veći stan" },
  { english: "Small-ish flat", latin: "Manji stan" },
  { english: "Terrace", latin: "Terasa" },
  { english: "Translation", latin: "Prevod" },
  { english: "Experience", latin: "Iskustvo" },
  { english: "Grammar", latin: "Gramatika" },
  { english: "Age", latin: "Uzrast" },
  { english: "Adult", latin: "Odrastao" },
  { english: "Intense", latin: "Intenzivan" },
  { english: "Course", latin: "Kurs" },
];

export const UNIT_20_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 20 Vocab',
  "teachYourselfUnit20Vocab",
  UNIT_20_VOCAB_JSON
);

const ANIMALS_JSON = [
  { english: "Animal", latin: "Životinja" },
  { english: "Badger", latin: "Jazavac" },
  { english: "Bear", latin: "Medved" },
  { english: "Bird", latin: "Ptica" },
  { english: "Cat", latin: "Mačka" },
  { english: "Chicken", latin: "Piletina" },
  { english: "Cow", latin: "Krava" },
  { english: "Dog", latin: "Pas" },
  { english: "Fox", latin: "Lisica" },
  { english: "Goat", latin: "Koza" },
  { english: "Goose", latin: "Guska" },
  { english: "Horse", latin: "Konj" },
  { english: "Lion", latin: "Lav" },
  { english: "Mouse", latin: "Miš" },
  { english: "Pig", latin: "Svinja" },
  { english: "Rabbit", latin: "Zec" },
  { english: "Rooster", latin: "Petao" },
  { english: "Sheep", latin: "Ovca" },
];

export const ANIMALS = vocabularySectionFromArray(
  "Animals",
  "animals",
  ANIMALS_JSON
);

const COLORS_JSON = [
  { english: "Black", latin: "Crno" },
  { english: "Blue", latin: "Plavo" },
  { english: "Brown", latin: "Smeđ" },
  { english: "Color", latin: "Boja" },
  { english: "Gold", latin: "Zlato" },
  { english: "Green", latin: "Zeleno" },
  { english: "Grey", latin: "Sivo" },
  { english: "Orange", latin: "Narančast" },
  { english: "Pink", latin: "Ružo" },
  { english: "Purple", latin: "Ljubičast" },
  { english: "Red", latin: "Crveno" },
  { english: "Silver", latin: "Srebro" },
  { english: "White", latin: "Beo" },
  { english: "Yellow", latin: "Žuto" },
];

export const COLORS = vocabularySectionFromArray(
  "Colors",
  "colors",
  COLORS_JSON
);

const CLOTHES_JSON = [
  { english: "Outfit", latin: "Komplet" },
  { english: "Raincoat", latin: "Kabanica" },
  { english: "Scarf", latin: "Šal" },
  { english: "Sweater", latin: "Džemper" },
  { english: "Jeans", latin: "Farmerke" },
  { english: "Gloves", latin: "Rukavice" },
  { english: "Cap", latin: "Kapa" },
  { english: "Jacket", latin: "Jakna" },
  { english: "T-Shirt", latin: "Majica" },
  { english: "Skirt", latin: "Suknja" },
  { english: "Shoes", latin: "Cipele" },
  { english: "Clothing", latin: "Odeća" },
  { english: "Stripes", latin: "Pruge" },
  { english: "Footwear", latin: "Obuća" },
  { english: "Sneakers", latin: "Patke" },
  { english: "Suit Jacket", latin: "Sako" },
  { english: "Formal Shirt", latin: "Košulja" },
  { english: "To Wear", latin: "Nositi" },
  { english: "Socks", latin: "Čarape" },
  { english: "Boots", latin: "Čizme" },
];

export const CLOTHES = vocabularySectionFromArray(
  "Clothes",
  "clothes",
  CLOTHES_JSON
);

const CRAFT_TOOLS_JSON = [
  { english: "Anvil", latin: "Nakovanj" },
  { english: "Auger", latin: "Svrdlo" },
  { english: "Awl", latin: "Šilo" },
  { english: "Bellows", latin: "Meh" },
  { english: "Clothing iron", latin: "Metalna pegla" },
  { english: "File", latin: "Turpija" },
  { english: "Hammer", latin: "Čekić" },
  { english: "Hoe", latin: "Motika" },
  { english: "Hole punch", latin: "Zumba" },
  { english: "Mallet", latin: "Bat" },
  { english: "Needle", latin: "Igle" },
  { english: "Pattern", latin: "Šablon za krojenje" },
  { english: "Pliers", latin: "Klešta" },
  { english: "Plow", latin: "Plug" },
  { english: "Rake", latin: "Grabulje" },
  { english: "Scissors", latin: "Makaze" },
  { english: "Scythe", latin: "Kosa" },
  { english: "Shovel", latin: "Lopata" },
  { english: "Thimble", latin: "Naprstak" },
  { english: "Tool", latin: "Alat" },
  { english: "Workshop", latin: "Radionica" },
];

export const CRAFT_TOOLS = vocabularySectionFromArray(
  "Craft Tools",
  "crafttools",
  CRAFT_TOOLS_JSON
);

const FAMILY_JSON = [
  { english: "Ancestor ( female )", latin: "Pređa" },
  { english: "Ancestor ( male )", latin: "Predak" },
  { english: "Brother", latin: "Brat" },
  { english: "Cousin ( female )", latin: "Sestrićna" },
  { english: "Cousin ( male )", latin: "Bratić" },
  { english: "Dad", latin: "Ćaća" },
  { english: "Daughter", latin: "Ćerka" },
  { english: "Father", latin: "Otac" },
  { english: "Fraternal nephew", latin: "Sinovac" },
  { english: "Fraternal niece", latin: "Bratanica" },
  { english: "Granddaughter", latin: "Unuka" },
  { english: "Grandfather", latin: "Đed" },
  { english: "Grandmother", latin: "Baba" },
  { english: "Grandson", latin: "Unuk" },
  { english: "Greatgranddaughter", latin: "Praunuka" },
  { english: "Greatgrandfather", latin: "Prađed" },
  { english: "Greatgrandmother", latin: "Prababa" },
  { english: "Greatgrandson", latin: "Praunuk" },
  { english: "Maternal Uncle", latin: "Ujak" },
  { english: "Mom", latin: "Mama" },
  { english: "Mother", latin: "Majka" },
  { english: "Paternal Uncle", latin: "Čiča" },
  { english: "Relative ( female )", latin: "Rođaka" },
  { english: "Relative ( male )", latin: "Rođak" },
  { english: "Sister", latin: "Sestra" },
  { english: "Son", latin: "Sin" },
  { english: "Sororal nephew", latin: "Sestrić" },
  { english: "Sororal niece", latin: "Sestričina" },
];

export const FAMILY = vocabularySectionFromArray(
  "Family",
  "family",
  FAMILY_JSON
);

const INDEFINITE_PRONOUNS_JSON = [
  { english: "Who", latin: "Ko" },
  { english: "Somebody", latin: "Neko" },
  { english: "Nobody", latin: "Niko" },
  { english: "Anybody", latin: "Iko" },
  { english: "When", latin: "Kada" },
  { english: "Once", latin: "Nekada" },
  { english: "Never", latin: "Nikada" },
  { english: "Anytime", latin: "Ikada" },
  { english: "How", latin: "Kako" },
  { english: "Somehow", latin: "Nekako" },
  { english: "No way", latin: "Nikako" },
  { english: "Anyhow", latin: "Ikako" },
  { english: "What", latin: "Šta" },
  { english: "Something", latin: "Nešto" },
  { english: "Nothing", latin: "Ništa" },
  { english: "Where", latin: "Đe" },
  { english: "Somewhere", latin: "Negde" },
  { english: "Nowhere", latin: "Nigde" },
  { english: "Anywhere", latin: "Igde" },
  { english: "To where", latin: "Kuda" },
  { english: "To somewhere", latin: "Nekuda" },
  { english: "To nowhere", latin: "Nikuda" },
  { english: "To anywhere", latin: "Ikuda" },
  { english: "Any kind of", latin: "Ikakvo" },
  { english: "No kind of", latin: "Nikakvo" },
  { english: "Some kind of", latin: "Nekakvo" },
  { english: "Someone's", latin: "Nečiji" },
  { english: "Anyone's", latin: "Ičiji" },
  { english: "No-one's", latin: "Ničiji" },
];

export const INDEFINITE_PRONOUNS = vocabularySectionFromArray(
  "Indefinite Pronouns",
  "indefinitePronouns",
  INDEFINITE_PRONOUNS_JSON
);

const JEWELRY_JSON = [
  { english: "Bracelet", latin: "Narukvica" },
  { english: "Brooch", latin: "Broš" },
  { english: "Jewelry", latin: "Nakita" },
  { english: "Necklace", latin: "Ogrlica" },
  { english: "Pin", latin: "Špala" },
  { english: "Ring", latin: "Prsten" },
];

export const JEWELRY = vocabularySectionFromArray(
  "Jewelry",
  "jewelry",
  JEWELRY_JSON
);

const NUMBERS_5_to_100_JSON = [
  { english: "Five", latin: "Pet" },
  { english: "Six", latin: "Šest" },
  { english: "Seven", latin: "Sedam" },
  { english: "Eight", latin: "Osam" },
  { english: "Nine", latin: "Devet" },
  { english: "Ten", latin: "Deset" },
  { english: "Eleven", latin: "Jedanaest" },
  { english: "Twelve", latin: "Dvanaest" },
  { english: "Thirteen", latin: "Trinaest" },
  { english: "Fourteen", latin: "Četrnaest" },
  { english: "Fifteen", latin: "Petnaest" },
  { english: "Sixteen", latin: "Šestnaest" },
  { english: "Seventeen", latin: "Sedamnaest" },
  { english: "Eighteen", latin: "Osamnaest" },
  { english: "Nineteen", latin: "Devetnaest" },
  { english: "Twenty", latin: "Dvadeset" },
  { english: "Thirty", latin: "Trideset" },
  { english: "Forty", latin: "Četrdeset" },
  { english: "Fifty", latin: "Pedeset" },
  { english: "Sixty", latin: "Šezdeset" },
  { english: "Seventy", latin: "Sedamdeset" },
  { english: "Eighty", latin: "Osamdeset" },
  { english: "Ninety", latin: "Devedeset" },
  { english: "One-hundred", latin: "Sto" },
];

export const NUMBERS_5_to_100 = vocabularySectionFromArray(
  "Numbers 5 to 100",
  "numbers5To100",
  NUMBERS_5_to_100_JSON
);

const KAD_SU_BILI_1_JSON = [
  { english: "Berg", latin: "Breg" },
  { english: "Coast", latin: "Obali" },
  { english: "Consume", latin: "Pojesti" },
  { english: "Huff", latin: "Zahrka" },
  { english: "Hung", latin: "Visili" },
  { english: "Idle", latin: "Dokoni" },
  { english: "It smells...", latin: "Miriše..." },
  { english: "Nap", latin: "Drema" },
  { english: "Odgovor", latin: "Answer" },
  { english: "Pleasure", latin: "Užitka" },
  { english: "Put down", latin: "Spustiti" },
  { english: "Puzzle", latin: "Zagonetku" },
  { english: "Resin", latin: "Smolu" },
  { english: "Shade", latin: "Hladovinu" },
  { english: "Shoulder", latin: "Rame" },
  { english: "Sleepily", latin: "Pospano" },
  { english: "Squeak", latin: "Škripi" },
  { english: "Started", latin: "Počeo je" },
  { english: "Tired", latin: "Umorni" },
  { english: "Window", latin: "Prozor" },
];

const KAD_SU_BILI_1 = vocabularySectionFromArray(
  "Kad Su Bili Dokoni, Ch. 1",
  "kadSuBiliCh1",
  KAD_SU_BILI_1_JSON
);

const BODY_PARTS_JSON = [
  { english: "Hair", latin: "Kosa" },
  { english: "Ears", latin: "Uši" },
  { english: "Mouth", latin: "Usta" },
  { english: "Throat", latin: "Grlo" },
  { english: "Forehead", latin: "Čelo" },
  { english: "Brain", latin: "Mozak" },
  { english: "Eyes", latin: "Oči" },
  { english: "Nose", latin: "Nos" },
  { english: "Chest", latin: "Grudi" },
  { english: "Stomach", latin: "Trbuh" },
  { english: "Head", latin: "Glava" },
  { english: "Shoulder", latin: "Rame" },
  { english: "Neck", latin: "Vrat" },
  { english: "Wrist", latin: "Šaka" },
  { english: "Finger", latin: "Prst" },
  { english: "Leg", latin: "Noga" },
  { english: "Knee", latin: "Koleno" },
  { english: "Foot", latin: "Stopalo" },
];

const BODY_PARTS = vocabularySectionFromArray(
  "Body Parts",
  "bodyParts",
  BODY_PARTS_JSON
);

const APPEARANCES_JSON = [
  { english: "Person", latin: "Osoba" },
  { english: "Hair", latin: "Kosa" },
  { english: "Nice", latin: "Simpatičan" },
  { english: "Man, Person", latin: "Čovijek" },
  { english: "Eyes", latin: "Oči" },
  { english: "Built Large", latin: "Krupan" },
  { english: "Man", latin: "Muškarac" },
  { english: "Height", latin: "Rast" },
  { english: "Full-Figured", latin: "Puniji" },
  { english: "Lad", latin: "Mladić" },
  { english: "Beard", latin: "Brada" },
  { english: "Witty", latin: "Duhovit" },
  { english: "Moustache", latin: "Brkovi" },
  { english: "Small", latin: "Sitan" },
  { english: "Handsome", latin: "Zgodan" },
  { english: "Thin", latin: "Mršav" },
  { english: "Clever", latin: "Pametan" },
  { english: "Smile", latin: "Osmeh" },
  { english: "Blonde", latin: "Plav" },
  { english: "Brown Hair", latin: "Smeđ" },
  { english: "Gray Hair", latin: "Sed" },
];

const APPEARANCES = vocabularySectionFromArray(
  "Appearances",
  "appearances",
  APPEARANCES_JSON
);

const REGIONALISMS_KORDUN_JSON = [
  { english: "Apron", latin: "Vertun" },
  { english: "Bewitch", latin: "Ocoprati" },
  { english: "Chestnut", latin: "Gorać" },
  { english: "Closed", latin: "Rešt" },
  { english: "Curtain", latin: "Firanga" },
  { english: "Feathered Blanket", latin: "Blazina" },
  { english: "Flax", latin: "Keten" },
  { english: "Foundation", latin: "Podumjenta" },
  { english: "Frying Pan", latin: "Tava" },
  { english: "Hemp Thread", latin: "Pređa" },
  { english: "Housewife", latin: "Planinka" },
  { english: "Kitchenette", latin: "Pecana" },
  { english: "Ladders", latin: "Lotra" },
  { english: "Little", latin: "Zeru" },
  { english: "Milk", latin: "Varenika" },
  { english: "Plantation", latin: "Padik" },
  { english: "Rough Land", latin: "Prljuga" },
  { english: "Saw", latin: "Žara" },
  { english: "Sheet", latin: "Plahta" },
  { english: "Skirt", latin: "Roklje" },
  { english: "Testicle", latin: "Stucka" },
  { english: "Towel", latin: "Ručinik" },
  { english: "Turkey Polenta", latin: "Žganjci" },
  { english: "Wallet", latin: "Šajtog" },
  { english: "Water Vessel", latin: "Kabao" },
  { english: "Water Well", latin: "Šternja" },
  { english: "Wool Blanket", latin: "Biljac" },
  { english: "Wool Fedora", latin: "Škiljak" },
];

const REGIONALISMS_KORDUN = vocabularySectionFromArray(
  "Regionalisms: Kordun",
  "regionalismsKordun",
  REGIONALISMS_KORDUN_JSON
);

const _DEBUG_SECTION = vocabularySectionFromArray("Debug", "debug", [
  { english: "0", latin: "0" },
  { english: "1", latin: "1" },
  { english: "2", latin: "2" },
  { english: "3", latin: "3" },
]);

// Generates a mapping like
// {
//   <object.unfriendlyName>: object,...
// }
export const practiceMap = [
  // _DEBUG_SECTION,
  ANIMALS,
  APPEARANCES,
  COLORS,
  CLOTHES,
  CRAFT_TOOLS,
  FAMILY,
  JEWELRY,
  BODY_PARTS,
  INDEFINITE_PRONOUNS,
  NUMBERS_5_to_100,
  ADJECTIVES_1,
  ADJECTIVES_2,
  ADJECTIVES_3,
  ADJECTIVES_4,
  ADJECTIVES_5,
  NOUNS_1,
  NOUNS_2,
  NOUNS_3,
  NOUNS_4,
  NOUNS_5,
  VERBS_1,
  VERBS_2,
  VERBS_3,
  VERBS_4,
  VERBS_5,
  VERBS_6,
  VERBS_7,
  VERBS_8,
  UNIT_4_VOCAB,
  UNIT_5_VOCAB,
  UNIT_6_VOCAB,
  UNIT_7_VOCAB,
  UNIT_8_VOCAB,
  UNIT_9_VOCAB,
  UNIT_10_VOCAB,
  UNIT_19_VOCAB,
  UNIT_20_VOCAB,
  // KAD_SU_BILI_1,
  REGIONALISMS_KORDUN,
].reduce((newObject, practiceObject) => {
  newObject[practiceObject.unfriendlyName] = practiceObject;
  return newObject;
}, {});
