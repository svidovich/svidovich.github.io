// Locations
const BOSNIA = "Bosnia";
const BULGARIA = "Bulgaria";
const CRNAGORA = "Crna Gora";
const CROATIA = "Croatia";
const HERCEGOVINA = "Hercegovina";
const MACEDONIA = "Macedonia";
const SERBIA = "Serbia";

const LEVAC = "Levač";

const NORTH = "North";
const SOUTH = "South";
const EAST = "East";
const WEST = "West";

// Location types
const ANY_LOCATION = "Any Location";
const BROAD_REGION = "Broad Region";
const CITY = "City";
const COUNTRY = "Country";
const COUNTY = "County";
const HISTORICAL_REGION = "Historical Region";
const VILLAGE = "Village";

// Effect types
const DISEASE = "Disease";
const DEATH = "Death";

// Specific Effects
const EFFECT_CURSE = "Curse";
const HAS_THE_BUGS = "Has the bugs";
const PLAGUE = "Plague";

// Body Parts
const HEAD = "Head";

// Cause types
const ANIMAL = "Animal";
const CAUSE_RITUAL = "Ritual";

// Specific causes
const BUGS = "Bugs";
const SNAKE = "Snake";
const DOORWAY_RITUAL = "Doorway ritual";

// Solutions
const MURDER = "Murder";
const SOLUTION_RITUAL = "Ritual";

// Specific Solutions
const POTION = "Potion";

// Ingredients
const INGREDIENT_KNIFE = "Knife";
const INGREDIENT_HOLY_WATER = "Holy Water";

// Citations
const ARNDAUDOV_SEVERNA_DOBRUDZA = "M. Arnaudov, Severna Dobrudža";
const KRAUSS_SUDSLAVISCHE_PESTSAGEN = "Krauss, Sudslavische Pestsagen";
const MIJATOVIC_NARODNA_MEDICINA_SRBA =
  "S.M. Mijatović, Narodna Medicina Srba u Seljaka u Levču i Temniču";

const ENTRIES_STORIES = [
  {
    storySubject: DISEASE,
    location: BULGARIA,
    locationType: COUNTRY,
    story:
      "God was building a monastery. He sent plague to fetch innocent \
      souls -- of old people for the foundations, of young men for the \
      walls, young women for the windows, children for the transept, \
      and so on. Plague went to Janko's house, but she could not get \
      into the courtyard, for Janko's dogs had been born on a Saturday \
      of Holy Week and recognized her for what she was, though she came \
      disguised as a gypsy. God told her to take the form of a bear, \
      which she did, and appeared as a savage and terrible bear, and \
      accomplished her mission.",
    page: 65,
    cited: ARNDAUDOV_SEVERNA_DOBRUDZA,
  },
];

const ENTRIES_DESCRIPTIONS = [
  {
    entityName: PLAGUE,
    entityType: DISEASE,
    entityDescription:
      "Crna kosa--zarudjena uša,\n\
        Mutno čelo, tisno i lakomo,\n\
        Mačije oči, razbludna pogleda,\n\
        Oštar nosić pun zmijanja jeda,\n\
        Široka joj prozdrita usta.\n\
        Žuto lice, nenavidno suho.\n\
        Od lienosti podavite ruke,\n\
        Zajarila sivokastne stjuke...",
    page: 63,
    cited: KRAUSS_SUDSLAVISCHE_PESTSAGEN,
    location: ANY_LOCATION,
    locationType: ANY_LOCATION,
  },
];

const ENTRIES_REMEDIES = [
  {
    effectType: DISEASE,
    effectDetail: HAS_THE_BUGS,
    effectBodyPart: HEAD,
    solutionType: SOLUTION_RITUAL,
    solutionDetail: POTION,
    causeType: ANIMAL,
    causeDetail: BUGS,
    location: LEVAC,
    locationType: HISTORICAL_REGION,
    page: 30,
    cited: MIJATOVIC_NARODNA_MEDICINA_SRBA,
    prose:
      "For insect in the head, they take nine larvae of cockroach \
        found in the corners of the house, mix them with fat, and put \
        them on the child's head. The insects begin to creep over the \
        back of the head and are driven off with a comb, to the \
        following formula: 'Naprat Napratinov Napratko insects on NN's \
        head to suck his blood, eat his brains, take his life. But his \
        blood is not for drinking, nor his brains for food, nor his \
        life to be taken away. Therefore they cannot remain here but \
        let them go.'",
  },
  {
    effectType: DISEASE,
    effectDetail: null,
    effectBodyPart: null,
    solutionType: MURDER,
    solutionDetail: null,
    causeType: ANIMAL,
    causeDetail: SNAKE,
    location: ANY_LOCATION,
    locationType: ANY_LOCATION,
    page: 30,
    cited: null,
    prose:
      "A wounded snake seeks vengeance and can send disease, \
      unless it is killed outright or in a certain way, e.g. \
      with a stick that is 'poisonous' to snakes.",
  },
  {
    effectType: DEATH,
    effectDetail: EFFECT_CURSE,
    effectBodyPart: null,
    solutionType: null,
    solutionDetail: null,
    causeType: CAUSE_RITUAL,
    causeDetail: DOORWAY_RITUAL,
    location: ANY_LOCATION,
    locationType: ANY_LOCATION,
    page: 30,
    cited: null,
    prose:
      "To bring about the death of an enemy, kill a snake \
      and leave it at his doorway, then he will surely die, \
      as though bitten by the snake.",
  },
];
