export const SAMPLES = [
  {
    cyrillic: "А",
    latin: "A",
    examples: [
      { bcms: "Alat", english: "Tool" },
      { bcms: "Ali", english: "But" },
    ],
  },
  {
    cyrillic: "Б",
    latin: "B",
    examples: [
      { bcms: "Brkovi", english: "Moustache" },
      { bcms: "Brod", english: "Boat" },
    ],
  },
  {
    cyrillic: "В",
    latin: "V",
    examples: [
      { bcms: "Voda", english: "Water" },
      { bcms: "Vrat", english: "Neck" },
    ],
  },
  {
    cyrillic: "Г",
    latin: "G",
    examples: [
      { bcms: "Gmaz", english: "Creeper" },
      { bcms: "Gdje", english: "Where" },
    ],
  },
  {
    cyrillic: "Д",
    latin: "D",
    examples: [
      { bcms: "Drina", english: "Drina" },
      { bcms: "Danas", english: "Today" },
    ],
  },
  {
    cyrillic: "Ђ",
    latin: "Đ",
    examples: [
      { bcms: "Đever", english: "Brother-in-Law" },
      { bcms: "Đevrek", english: "Sesame Ring" },
    ],
  },
  {
    cyrillic: "Е",
    latin: "E",
    examples: [
      { bcms: "Evropa", english: "Europe" },
      { bcms: "Ekipa", english: "Team" },
    ],
  },
  {
    cyrillic: "Ж",
    latin: "Ž",
    examples: [
      { bcms: "Žena", english: "Wife" },
      { bcms: "Žalost", english: "Sadness" },
    ],
  },
  {
    cyrillic: "З",
    latin: "Z",
    examples: [
      { bcms: "Zelen", english: "Green" },
      { bcms: "Zid", english: "Wall" },
    ],
  },
  {
    cyrillic: "И",
    latin: "I",
    examples: [
      { bcms: "Inostranstvo", english: "International" },
      { bcms: "Ime", english: "Name" },
    ],
  },
  {
    cyrillic: "Ј",
    latin: "J",
    examples: [
      { bcms: "Jelen", english: "Stag" },
      { bcms: "Juče", english: "Yesterday" },
    ],
  },
  {
    cyrillic: "К",
    latin: "K",
    examples: [
      { bcms: "Kamen", english: "Stone" },
      { bcms: "Krompir", english: "Potato" },
    ],
  },
  {
    cyrillic: "Л",
    latin: "L",
    examples: [
      { bcms: "Lijepo", english: "Pretty" },
      { bcms: "List", english: "Leaf" },
    ],
  },
  {
    cyrillic: "Љ",
    latin: "Lj",
    examples: [
      { bcms: "Ljudi", english: "People" },
      { bcms: "Ljut", english: "Angry" },
    ],
  },
  {
    cyrillic: "М",
    latin: "M",
    examples: [
      { bcms: "Majka", english: "Mother" },
      { bcms: "Muškarac", english: "Male" },
    ],
  },
  {
    cyrillic: "Н",
    latin: "N",
    examples: [
      { bcms: "Nakit", english: "Jewelry" },
      { bcms: "Narodni", english: "National" },
    ],
  },
  {
    cyrillic: "Њ",
    latin: "Nj",
    examples: [
      { bcms: "Njušiti", english: "To Sniff" },
      { bcms: "Njedra", english: "Bosom" },
    ],
  },
  {
    cyrillic: "О",
    latin: "O",
    examples: [
      { bcms: "Osam", english: "Eight" },
      { bcms: "Običaj", english: "Custom" },
    ],
  },
  {
    cyrillic: "П",
    latin: "P",
    examples: [
      { bcms: "Pastrmka", english: "Trout" },
      { bcms: "Priča", english: "Story" },
    ],
  },
  {
    cyrillic: "Р",
    latin: "R",
    examples: [
      { bcms: "Radost", english: "Joy" },
      { bcms: "Remen", english: "Strap" },
    ],
  },
  {
    cyrillic: "С",
    latin: "S",
    examples: [
      { bcms: "Selo", english: "Village" },
      { bcms: "Sajam", english: "Market" },
    ],
  },
  {
    cyrillic: "Т",
    latin: "T",
    examples: [
      { bcms: "Telo", english: "Body" },
      { bcms: "Trud", english: "Effort" },
    ],
  },
  {
    cyrillic: "Ћ",
    latin: "Ć",
    examples: [
      { bcms: "Ćevapi", english: "Kebab" },
      { bcms: "Ćud", english: "Mood" },
    ],
  },
  {
    cyrillic: "У",
    latin: "U",
    examples: [
      { bcms: "Uvijek", english: "Forever" },
      { bcms: "Ugao", english: "Angle" },
    ],
  },
  {
    cyrillic: "Ф",
    latin: "F",
    examples: [
      { bcms: "Fenjir", english: "Lantern" },
      { bcms: "Frula", english: "Flute" },
    ],
  },
  {
    cyrillic: "Х",
    latin: "H",
    examples: [
      { bcms: "Hleb", english: "Bread" },
      { bcms: "Hrast", english: "Oak" },
    ],
  },
  {
    cyrillic: "Ц",
    latin: "C",
    examples: [
      { bcms: "Crkva", english: "Church" },
      { bcms: "Cipele", english: "Shoes" },
    ],
  },
  {
    cyrillic: "Ч",
    latin: "Č",
    examples: [
      { bcms: "Čovijek", english: "Man" },
      { bcms: "Čvrst", english: "Stability" },
    ],
  },
  {
    cyrillic: "Џ",
    latin: "Dž",
    examples: [{ bcms: "Džemper", english: "Sweater" }],
  },
  {
    cyrillic: "Ш",
    latin: "Š",
    examples: [
      { bcms: "Šišmiš", english: "Bat" },
      { bcms: "Štapić", english: "Stick" },
    ],
  },
];

export const soundsData = {};

SAMPLES.forEach((sample) => {
  sample.examples.forEach((example) => {
    const soundKey = example.bcms.toLowerCase();
    const soundFilePath = `./pronounce/soundFiles/words/${soundKey}.mp3`;
    soundsData[soundKey] = soundFilePath;
  });
});

const loadAudio = (path) => {
  const audio = new Audio(path);
  return audio;
};

export const pronounceSound = (soundName, volume, delay) => {
  try {
    const soundEntry = soundsData[soundName];
    if (delay !== undefined) {
      sleep(delay);
    }
    if (typeof soundEntry === "string") {
      const sound = loadAudio(soundEntry);
      soundsData[soundName] = sound;
      sound.volume = volume || 1;
      sound.play();
    } else {
      soundEntry.volume = volume || 1;
      soundEntry.play();
    }
  } catch (error) {
    console.log(`Failed to play ${soundName}: ${error}`);
  }
};
