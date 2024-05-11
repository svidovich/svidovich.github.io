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

const ADJECTIVES_1_JSON = [
  { english: "Good", latin: "Dobar" },
  { english: "New", latin: "Nov" },
  { english: "First", latin: "Prvi" },
  { english: "Last", latin: "Poslednji" },
  { english: "Long", latin: "Dug" },
  { english: "Own", latin: "Svoj" },
  { english: "Other", latin: "Drugi" },
  { english: "Old", latin: "Stari" },
  { english: "Right", latin: "Desni" },
  { english: "Big", latin: "Veliki" },
  { english: "High", latin: "Visok" },
  { english: "Different", latin: "Razni" },
  { english: "Small", latin: "Mali" },
  { english: "Next", latin: "Sljedeći" },
  { english: "Early", latin: "Rano" },
  { english: "Young", latin: "Mlad" },
  { english: "Important", latin: "Važan" },
];

export const ADJECTIVES_1 = vocabularySectionFromArray(
  "Adjectives I",
  "adjectives1",
  ADJECTIVES_1_JSON
);

const ADJECTIVES_2_JSON = [
  { english: "Few", latin: "Nekolicini" },
  { english: "Public", latin: "Državni" },
  { english: "Bad", latin: "Loš" },
  { english: "Able", latin: "Sposoban" },
  { english: "Specific", latin: "Naročit" },
  { english: "General", latin: "Opšti" },
  { english: "Certain", latin: "Siguran" },
  { english: "Free", latin: "Slobod" },
  { english: "Open", latin: "Otvoren" },
  { english: "Whole", latin: "Ceo" },
  { english: "Short", latin: "Kratak" },
  { english: "Easy", latin: "Lak" },
  { english: "Strong", latin: "Jak" },
  { english: "Special", latin: "Poseban" },
  { english: "Clear", latin: "Jasan" },
  { english: "Recent", latin: "Nedavan" },
  { english: "Late", latin: "Kasan" },
  { english: "Single", latin: "Jedan" },
  { english: "Medical", latin: "Medicinski" },
  { english: "Central", latin: "Centralan" },
];

export const ADJECTIVES_2 = vocabularySectionFromArray(
  "Adjectives II",
  "adjectives2",
  ADJECTIVES_2_JSON
);

const ADJECTIVES_3_JSON = [
  { english: "Common", latin: "Uobičajen" },
  { english: "Poor", latin: "Jadan" },
  { english: "Major", latin: "Glavan" },
  { english: "Happy", latin: "Sretan" },
  { english: "Serious", latin: "Ozbiljan" },
  { english: "Ready", latin: "Spreman" },
  { english: "Environmental", latin: "Ekološki" },
  { english: "Financial", latin: "Financijski" },
  { english: "Federal", latin: "Federalni" },
  { english: "Necessary", latin: "Potreban" },
  { english: "Military", latin: "Vojan" },
  { english: "Original", latin: "Izvoran" },
  { english: "Successful", latin: "Uspješan" },
  { english: "Sufficient", latin: "Dovoljan" },
  { english: "Electrical", latin: "Električni" },
  { english: "Expensive", latin: "Skupi" },
  { english: "Academic", latin: "Akademski" },
  { english: "Aware", latin: "Svjestan" },
  { english: "Additional", latin: "Dodatan" },
];

export const ADJECTIVES_3 = vocabularySectionFromArray(
  "Adjectives III",
  "adjectives3",
  ADJECTIVES_3_JSON
);

const ADJECTIVES_4_JSON = [
  { english: "Available", latin: "Dostupan" },
  { english: "Comfortable", latin: "Udoban" },
  { english: "Traditional", latin: "Tradicionalno" },
  { english: "Cultural", latin: "Kulturan" },
  { english: "Primary", latin: "Primaran" },
  { english: "Professional", latin: "Profesionalni" },
  { english: "International", latin: "Međunarodni" },
  { english: "Useful", latin: "Koristan" },
  { english: "Historical", latin: "Istorijski" },
  { english: "Effective", latin: "Učinkovito" },
  { english: "Similar", latin: "Sličan" },
  { english: "Psychological", latin: "Psihološki" },
  { english: "Reasonable", latin: "Razuman" },
  { english: "Accurate", latin: "Točno" },
  { english: "Difficult", latin: "Teško" },
  { english: "Administrative", latin: "Upravni" },
  { english: "Critical", latin: "Kritičan" },
  { english: "Unable", latin: "Nesposoban" },
  { english: "Efficient", latin: "Efikasan" },
  { english: "Interesting", latin: "Zanimljiv" },
];

export const ADJECTIVES_4 = vocabularySectionFromArray(
  "Adjectives IV",
  "adjectives4",
  ADJECTIVES_4_JSON
);

const ADJECTIVES_5_JSON = [
  { english: "Legal", latin: "Legalan" },
  { english: "Responsible", latin: "Odgovorno" },
  { english: "Residential", latin: "Stambeni" },
  { english: "Widespread", latin: "Rasprostranjena" },
  { english: "Spiritual", latin: "Duhovan" },
  { english: "Cute", latin: "Sladak" },
  { english: "Civil", latin: "Građanski" },
  { english: "Detailed", latin: "Detaljan" },
  { english: "Valuable", latin: "Vredan" },
  { english: "Popular", latin: "Popularan" },
  { english: "Technical", latin: "Tehnički" },
  { english: "Typical", latin: "Tipičan" },
  { english: "Competitive", latin: "Natjecateljski" },
  { english: "Appropriate", latin: "Prikladan" },
  { english: "Private", latin: "Privatan" },
  { english: "Essential", latin: "Suštinski" },
  { english: "Physical", latin: "Fizički" },
  { english: "Remarkable", latin: "Izvanredan" },
  { english: "Temporary", latin: "Privremen" },
  { english: "Reliable", latin: "Pouzdan" },
];

export const ADJECTIVES_5 = vocabularySectionFromArray(
  "Adjectives V",
  "adjectives5",
  ADJECTIVES_5_JSON
);

const NOUNS_1_JSON = [
  { english: "Time", latin: "Vremena" },
  { english: "Year", latin: "Godina" },
  { english: "People", latin: "Ljudi" },
  { english: "Way", latin: "Put" },
  { english: "Day", latin: "Dan" },
  { english: "Man", latin: "Čovijek" },
  { english: "Thing", latin: "Stvar" },
  { english: "Woman", latin: "Žena" },
  { english: "Life", latin: "Život" },
  { english: "Child", latin: "Deca" },
  { english: "World", latin: "Zemlja" },
  { english: "School", latin: "Škola" },
  { english: "State", latin: "Država" },
  { english: "Family", latin: "Porodica" },
  { english: "Student", latin: "Đak" },
  { english: "Group", latin: "Grupa" },
  { english: "Country", latin: "Zemlja" },
  { english: "Problem", latin: "Problem" },
  { english: "Hand", latin: "Ruk" },
];

const NOUNS_1 = vocabularySectionFromArray("Nouns I", "nouns1", NOUNS_1_JSON);

const NOUNS_2_JSON = [
  { english: "Part", latin: "Dio" },
  { english: "Place", latin: "Mjesto" },
  { english: "Case", latin: "Slučaj" },
  { english: "Week", latin: "Nedelja" },
  { english: "Company", latin: "Firman" },
  { english: "System", latin: "Sistem" },
  { english: "Program", latin: "Programa" },
  { english: "Question", latin: "Pitanja" },
  { english: "Work", latin: "Posla" },
  { english: "Government", latin: "Vlada" },
  { english: "Number", latin: "Broj" },
  { english: "Night", latin: "Noć" },
  { english: "Point", latin: "Točka" },
  { english: "Home", latin: "Kuć" },
  { english: "Water", latin: "Voda" },
  { english: "Room", latin: "Soba" },
  { english: "Mother", latin: "Majka" },
  { english: "Area", latin: "Mjesto" },
  { english: "Money", latin: "Novac" },
  { english: "Story", latin: "Priča" },
];
const NOUNS_2 = vocabularySectionFromArray("Nouns II", "nouns2", NOUNS_2_JSON);

const NOUNS_3_JSON = [
  { english: "Fact", latin: "Činjenica" },
  { english: "Month", latin: "Mjesec" },
  { english: "Lot (of land)", latin: "Zemljište" },
  { english: "Right", latin: "Pravo" },
  { english: "Study", latin: "Studija" },
  { english: "Book", latin: "Knjiga" },
  { english: "Eye", latin: "Oko" },
  { english: "Job", latin: "Posa" },
  { english: "Word", latin: "Reč" },
  { english: "Business", latin: "Bisnes" },
  { english: "Issue (e.g. magazine)", latin: "Izdanje" },
  { english: "Side", latin: "Strana" },
  { english: "Kind", latin: "Vrsta" },
  { english: "Head", latin: "Glava" },
  { english: "House", latin: "Dom" },
  { english: "Service", latin: "Služba" },
  { english: "Friend", latin: "Prijatelja" },
  { english: "Father", latin: "Otac" },
  { english: "Power", latin: "Vlast" },
  { english: "Hour", latin: "Sat" },
];
const NOUNS_3 = vocabularySectionFromArray("Nouns III", "nouns3", NOUNS_3_JSON);

const NOUNS_4_JSON = [
  { english: "Game", latin: "Igra" },
  { english: "Line", latin: "Linja" },
  { english: "End", latin: "Kraj" },
  { english: "Member", latin: "Član" },
  { english: "Law", latin: "Zakon" },
  { english: "Car", latin: "Kola" },
  { english: "City", latin: "Grad" },
  { english: "Community", latin: "Zajednica" },
  { english: "Name", latin: "Ime" },
  { english: "President", latin: "Presjednik" },
  { english: "Team", latin: "Ekipa" },
  { english: "Minute", latin: "Minut" },
  { english: "Idea", latin: "Ideja" },
  { english: "Kid", latin: "Mladić" },
  { english: "Body", latin: "Tijelo" },
  { english: "Information", latin: "Informacija" },
  { english: "Back", latin: "Leđa" },
  { english: "Parent", latin: "Rojitelja" },
  { english: "Face", latin: "Lica" },
  { english: "Other", latin: "Drugi" },
];
const NOUNS_4 = vocabularySectionFromArray("Nouns IV", "nouns4", NOUNS_4_JSON);

const NOUNS_5_JSON = [
  { english: "Level", latin: "Sprat" },
  { english: "Office", latin: "Kancelarija" },
  { english: "Door", latin: "Vrat" },
  { english: "Health", latin: "Zdravlje" },
  { english: "Person", latin: "Čovijek" },
  { english: "Art", latin: "Umetnost" },
  { english: "War", latin: "Rat" },
  { english: "History", latin: "Istorija" },
  { english: "Party", latin: "Zabava" },
  { english: "Result", latin: "Ishod" },
  { english: "Change", latin: "Promena" },
  { english: "Morning", latin: "Jutro" },
  { english: "Reason", latin: "Razlog" },
  { english: "Research", latin: "Izučavanje" },
  { english: "Girl", latin: "Devojka" },
  { english: "Guy", latin: "Momak" },
  { english: "Moment", latin: "Trenut" },
  { english: "Air", latin: "Vazduh" },
  { english: "Teacher", latin: "Nastavnica" },
  { english: "Force", latin: "Sila" },
  { english: "Education", latin: "Obrazovanje" },
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
  { english: "Apple", latin: "Jabuka" },
  { english: "Blueberry", latin: "Borovnica" },
  { english: "Can I help you?", latin: "Izvolite?" },
  { english: "Cheers!", latin: "Živeli!" },
  { english: "Give me a coffee", latin: "Dajte mi kafu" },
  { english: "Give us...", latin: "Dajte nam..." },
  { english: "Here you go.", latin: "Izvolite." },
  { english: "I'm thirsty.", latin: "Žedan sam." },
  { english: "Immediately", latin: "Odmah" },
  { english: "Mineral water", latin: "Kisela voda" },
  { english: "OK", latin: "U redu" },
  { english: "One juice", latin: "Jedan sok" },
  { english: "Or", latin: "Ili" },
  { english: "Please", latin: "Molim vas" },
  { english: "Raspberry", latin: "Malina" },
  { english: "Strawberry", latin: "Jagoda" },
  { english: "Thank you", latin: "Hvala vam" },
  { english: "Two beers", latin: "Dva piva" },
  { english: "Waitress", latin: "Konobarica" },
  { english: "What do you want?", latin: "Šta želite?" },
  { english: "You too", latin: "I vi" },
  { english: "You're welcome", latin: "Molim" },
];

export const UNIT_4_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 4 Vocab',
  "teachYourselfUnit4Vocab",
  UNIT_4_VOCAB_JSON
);

const UNIT_5_VOCAB_JSON = [
  { english: "Beef soup", latin: "Goveđa supa" },
  { english: "Bill ($)", latin: "Račun" },
  { english: "Bottle", latin: "Flaša" },
  { english: "Bread", latin: "Hleb" },
  { english: "Clear soup", latin: "Supa" },
  { english: "Crescent roll", latin: "Kifle" },
  { english: "Desserts", latin: "Slatkiši" },
  { english: "Filo pie", latin: "Burek" },
  { english: "Grilled Mushrooms", latin: "Pečurka na žaru" },
  { english: "Here", latin: "Ovde" },
  { english: "Hungry", latin: "Gladan" },
  { english: "Menu", latin: "Jelovnik" },
  { english: "Mince burger", latin: "Pljeskavica" },
  { english: "Mince Sausage", latin: "Ćevapčići" },
  { english: "Prosciutto", latin: "Pršut" },
  { english: "Salad", latin: "Salata" },
  { english: "Saleswoman", latin: "Prodavačica" },
  { english: "Sandwich", latin: "Sendvić" },
  { english: "Thick soup", latin: "Čorba" },
  { english: "We have", latin: "Imamo" },
  { english: "With cheese", latin: "Sa sirom" },
  { english: "With ham", latin: "Sa šunkom" },
  { english: "With meat", latin: "Sa mesom" },
  { english: "Yogurt", latin: "Jogurt" },
];

export const UNIT_5_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 5 Vocab',
  "teachYourselfUnit5Vocab",
  UNIT_5_VOCAB_JSON
);

const UNIT_6_VOCAB_JSON = [
  { english: "Breakfast", latin: "Doručak" },
  { english: "Butter", latin: "Buter" },
  { english: "Can (drink)", latin: "Limenka" },
  { english: "Grocery Store", latin: "Bakalnica" },
  { english: "How many", latin: "Koliko" },
  { english: "I don't want...", latin: "Neću..." },
  { english: "I must...", latin: "Moram..." },
  { english: "It costs", latin: "Košta" },
  { english: "Kilogram", latin: "Kilo" },
  { english: "Lemon", latin: "Limun" },
  { english: "Litre", latin: "Litar" },
  { english: "Map", latin: "Mapa" },
  { english: "Milk", latin: "Mleko" },
  { english: "New", latin: "Nov" },
  { english: "Nothing more", latin: "Ništa više" },
  { english: "Only", latin: "Samo" },
  { english: "Plan", latin: "Plan" },
  { english: "Postcards", latin: "Razglednice" },
  { english: "Salesman", latin: "Prodavac" },
  { english: "See ya!", latin: "Prijatno!" },
  { english: "Shampoo", latin: "Šampon" },
  { english: "Soap", latin: "Sapun" },
  { english: "Something else", latin: "Još nešto" },
  { english: "Something", latin: "Nešto" },
  { english: "That (f)", latin: "Ta" },
  { english: "That (m)", latin: "Taj" },
  { english: "That (n)", latin: "To" },
  { english: "That's all", latin: "To je sve" },
  { english: "There", latin: "Tamo" },
  { english: "These", latin: "Ove" },
  { english: "Thing", latin: "Stvar" },
  { english: "This", latin: "Ovaj" },
  { english: "Toothpaste", latin: "Zubna pasta" },
  { english: "We don't have...", latin: "Nemamo..." },
  { english: "We don't sell...", latin: "Ne prodajemo..." },
  { english: "Your change ($)", latin: "Vaš kusur" },
];

export const UNIT_6_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 6 Vocab',
  "teachYourselfUnit6Vocab",
  UNIT_6_VOCAB_JSON
);

const UNIT_7_VOCAB_JSON = [
  { english: "We are", latin: "Mi smo" },
  { english: "That is", latin: "To je" },
  { english: "Large", latin: "Veliki" },
  { english: "In the park", latin: "U parku" },
  { english: "Fortress", latin: "Tvrđava" },
  { english: "Above", latin: "Iznad" },
  { english: "River", latin: "Rijeka" },
  { english: "Street", latin: "Ulica" },
  { english: "To be found", latin: "Nalaziti se" },
  { english: "Near", latin: "Blizu" },
  { english: "Long", latin: "Dug" },
  { english: "In the street", latin: "U ulicu" },
  { english: "They are", latin: "Oni su" },
  { english: "Gallery", latin: "Galerija" },
  { english: "On the square", latin: "Na trgu" },
  { english: "National museum", latin: "Narodni muzej" },
  { english: "To watch", latin: "Gledati" },
  { english: "Opera", latin: "Opera" },
  { english: "Ballet", latin: "Balet" },
  { english: "To reside", latin: "Stanovati" },
  { english: "His", latin: "Njegov" },
  { english: "Address", latin: "Adresa" },
  { english: "Phone number", latin: "Telefonski broj" },
  { english: "Below", latin: "Ispod" },
  { english: "Where", latin: "Đe" },
  { english: "Apartment", latin: "Stan" },
  { english: "Far", latin: "Daleko" },
  { english: "From", latin: "Od" },
  { english: "Who's that?", latin: "Ko je to?" },
  { english: "That woman", latin: "Ona žena" },
  { english: "In the pharmacy", latin: "U apoteci" },
  { english: "Is that...?", latin: "Je li to...?" },
  { english: "He / She / It is", latin: "Jeste" },
  { english: "Your", latin: "Tvoj" },
  { english: "Teacher", latin: "Nastavnica" },
  { english: "Are we...?", latin: "Jesmo li...?" },
  { english: "Well", latin: "Pa" },
  { english: "Now", latin: "Sada" },
  { english: "Class", latin: "Čas" },
  { english: "Come", latin: "Dođi" },
  { english: "Tomorrow", latin: "Sutra" },
  { english: "At / To my house", latin: "Kod mene" },
  { english: "For lunch", latin: "Na ručak" },
  { english: "Number", latin: "Broj" },
  { english: "Next to", latin: "Pored" },
  { english: "To know", latin: "Znati" },
  { english: "Opposite", latin: "Preko Puta" },
  { english: "After", latin: "Posle" },
  { english: "To stroll", latin: "Šetati" },
  { english: "Excellent", latin: "Odlično" },
  { english: "Until tomorrow", latin: "Do sutra" },
  { english: "From / Out of", latin: "Iz" },
  { english: "Where are you from?", latin: "Odakle ste vi?" },
  { english: "To live", latin: "Živeti" },
  { english: "Nice / Beautiful", latin: "Lijep" },
  { english: "Area", latin: "Kraj" },
  { english: "To work / To do", latin: "Raditi" },
  { english: "What's that?", latin: "Šta je to?" },
  { english: "Cinema", latin: "Bioskop" },
  { english: "Office", latin: "Kancelarija" },
  { english: "Exactly", latin: "Tačno" },
  { english: "Between", latin: "Između" },
  { english: "Doctor", latin: "Lekar" },
  { english: "Hospital", latin: "Bolnica" },
];

export const UNIT_7_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 7 Vocab',
  "teachYourselfUnit7Vocab",
  UNIT_7_VOCAB_JSON
);

const UNIT_8_VOCAB_JSON = [
  { english: "Food", latin: "Hrana" },
  { english: "Very", latin: "Vrlo" },
  { english: "On foot", latin: "Peške" },
  { english: "Idite gore", latin: "Go up" },
  { english: "I onda", latin: "And then" },
  { english: "To turn", latin: "Skrenuti" },
  { english: "Right", latin: "Desno" },
  { english: "Left", latin: "Levo" },
  { english: "Straight", latin: "Pravo" },
  { english: "The right side", latin: "Desne strane" },
  { english: "On the corner", latin: "Na ćošku" },
  { english: "Excuse me...", latin: "Izvinite..." },
  { english: "Of course", latin: "Naravno" },
  { english: "A little further", latin: "Malo dalje" },
  { english: "Again", latin: "Opet" },
  { english: "How?", latin: "Kako?" },
  { english: "To", latin: "Do" },
  { english: "Don't go", latin: "Nemojte ići" },
  { english: "By bus", latin: "Autobusom" },
  { english: "Should", latin: "Treba" },
  { english: "To take", latin: "Uzeti" },
  { english: "In front of", latin: "Ispred" },
  { english: "Get down", latin: "Sići" },
  { english: "To repeat", latin: "Ponoviti" },
  { english: "Stamp", latin: "Marka" },
  { english: "Abroad", latin: "Inostranstvo" },
  { english: "Only", latin: "Samo" },
  { english: "From here", latin: "Odavde" },
  { english: "Traffic light", latin: "Semafor" },
  { english: "To enter", latin: "Ući" },
  { english: "Window", latin: "Šalter" },
  { english: "To look for", latin: "Tražiti" },
  { english: "To see", latin: "Videti" },
  { english: "Person", latin: "Čovek" },
  { english: "Clerk", latin: "Službenik" },
  { english: "Letter", latin: "Pismo" },
  { english: "I send", latin: "Šaljem" },
  { english: "By air", latin: "Avionom" },
  { english: "Entrance", latin: "Ulaz" },
];

export const UNIT_8_VOCAB = vocabularySectionFromArray(
  '"Teach Yourself" Unit 8 Vocab',
  "teachYourselfUnit8Vocab",
  UNIT_8_VOCAB_JSON
);

const UNIT_9_VOCAB_JSON = [
  { english: "About", latin: "O" },
  { english: "Airplane", latin: "Avion" },
  { english: "Airport", latin: "Aerodrom" },
  { english: "Already", latin: "Već" },
  { english: "Apartment", latin: "Apartman" },
  { english: "Arrived", latin: "Stigao" },
  { english: "Bathroom", latin: "Kupatilo" },
  { english: "Bought", latin: "Kupio" },
  { english: "Come on!", latin: "Hajde!" },
  { english: "Comfortable", latin: "Udoban" },
  { english: "Customs", latin: "Carina" },
  { english: "Elevator", latin: "Lift" },
  { english: "Embassy", latin: "Ambasada" },
  { english: "Exit", latin: "Izlaz" },
  { english: "Flight", latin: "Let" },
  { english: "Garage", latin: "Garaža" },
  { english: "Got / Received", latin: "Dobio" },
  { english: "His", latin: "Svoj" },
  { english: "Important", latin: "Važno" },
  { english: "Information", latin: "Informacija" },
  { english: "Key", latin: "Ključ" },
  { english: "Lounge", latin: "Salon" },
  { english: "Name", latin: "Ime" },
  { english: "Passport", latin: "Pasoš" },
  { english: "Quickly", latin: "Brzo" },
  { english: "Really", latin: "Zaista" },
  { english: "Receptionist", latin: "Recepcioner" },
  { english: "Reservation", latin: "Rezervacija" },
  { english: "Room", latin: "Soba" },
  { english: "Sleepover!", latin: "Noćenje!" },
  { english: "Suitcase", latin: "Kofer" },
  { english: "Surname", latin: "Prezime" },
  { english: "Telephone", latin: "Telefon" },
  { english: "Through", latin: "Kroz" },
  { english: "Ticket", latin: "Karta" },
  { english: "To Discuss", latin: "Razgovarati" },
  { english: "To Drink", latin: "Popiti" },
  { english: "To Find", latin: "Nalaziti" },
  { english: "To Send", latin: "Poslati" },
  { english: "To Sign", latin: "Potpisivati" },
  { english: "Travelled", latin: "Putovao" },
  { english: "Visa", latin: "Viza" },
  { english: "Waited", latin: "Čekao" },
  { english: "Was", latin: "Bio" },
  { english: "Went / Passed", latin: "Prošao" },
  { english: "Went", latin: "Išao" },
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
