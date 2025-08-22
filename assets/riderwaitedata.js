const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`Assertion error: ${message}`);
  }
};

// A special constant to use for the value of major arcana
// characters.
const CHARACTER = "CHARACTER";

// Some of the words are complicated. Let's get definitions
// that we can look up.

const DEFINITIONS_LOOKUP = {
  Abandonment:
    "The act of leaving something or someone behind, often with emotional consequences.",
  Absence: "The state of being away or missing from a place or situation.",
  Abundance: "A large quantity of something; plentifulness.",
  "Abuse of Power":
    "Using one's position or authority for harmful or selfish purposes.",
  Accomodation: "An adjustment or compromise to fit new conditions or people.",
  Action: "The process of doing something to achieve a result.",
  Address: "To deal with or focus attention on an issue or person.",
  Adversity: "Hardship or misfortune; challenging circumstances.",
  "A Great Person": "Someone of strong character, wisdom, or influence.",
  Aid: "Help or support offered in a time of need.",
  Apathy: "Lack of interest, emotion, or concern.",
  Arrogance: "Overbearing pride or sense of superiority.",
  "Assured Success": "A confident outcome that leads to achievement.",
  Attraction: "A force drawing people or things together.",
  Beauty: "A pleasing quality that evokes admiration or delight.",
  Benevolence: "A desire to do good and show kindness.",
  Bewrayment: "Betrayal or exposing of secrets; revealing what was hidden.",
  Bias: "A leaning or prejudice for or against something.",
  Bigotry: "Intolerance toward those who are different or hold other views.",
  Blindness: "Lack of insight or understanding; inability to perceive clearly.",
  "Body Politic":
    "The collective body of a nation or society under governance.",
  Calamity: "A sudden disaster or serious misfortune.",
  Calumny: "False and malicious statements meant to damage reputation.",
  Captivity: "The state of being imprisoned or confined.",
  Carelessness: "Failure to give proper attention or thought.",
  "Change of Place": "Movement from one location or environment to another.",
  "Change of Position": "A shift in role, stance, or influence.",
  "Churches and the Priesthood":
    "Religious institutions and spiritual authority.",
  Circumspection: "Cautious consideration of all circumstances.",
  Clandestine: "Something secretive, hidden, or illicit.",
  Compassion: "Empathy and concern for the suffering of others.",
  "Competing Interests": "Opposing desires or goals in conflict.",
  Concealment: "The act of hiding something from view or awareness.",
  Conceit: "Excessive pride in oneself or one's abilities.",
  Concord: "Harmony and agreement among people or ideas.",
  "Confusion to Enemies": "A turning of opposition into disorder or chaos.",
  Contentment: "A peaceful satisfaction with what one has.",
  Conviction: "A firmly held belief or moral certainty.",
  Corruption: "Dishonest or immoral behavior, especially in power.",
  Courage: "The strength to face fear or difficulty.",
  Credit: "Recognition or trust in one\u2019s character or worth.",
  Danger: "A situation that poses risk or harm.",
  Darkness: "A state of ignorance, fear, or evil.",
  Deception: "Misleading or hiding the truth to gain advantage.",
  Decision: "A choice or judgment made after consideration.",
  Defeat: "Loss or failure in a struggle or challenge.",
  Deliberation: "Careful thought and discussion before action.",
  Delirium: "Confused, disturbed state of mind, often intense.",
  Despotism: "Absolute power exercised cruelly or oppressively.",
  Destiny: "A predetermined course of events beyond control.",
  Destruction: "Complete ruin or end of something\u2019s form.",
  Difficulty: "A challenge that requires effort to overcome.",
  Diplomacy: "Skilled negotiation in sensitive or difficult matters.",
  Disaster: "A sudden, extreme misfortune or failure.",
  Discernment: "The ability to judge well or perceive clearly.",
  Discord: "Lack of harmony; conflict or disagreement.",
  Disgrace: "Loss of respect or honor due to shame.",
  Disguise: "A false appearance to conceal identity or intent.",
  Dispute: "A disagreement or argument between parties.",
  Disquiet: "A feeling of anxiety or unease.",
  Dissimulation: "Hiding one's thoughts or intentions.",
  Distress: "Extreme anxiety, sorrow, or pain.",
  Distribution: "The act of sharing or spreading something.",
  Disunion: "Separation or division from a unified whole.",
  Divination: "Seeking knowledge through supernatural means.",
  Doubt: "Uncertainty or lack of conviction.",
  Economy: "Efficient use of resources; thriftiness.",
  Emigration: "Leaving one\u2019s country to live elsewhere.",
  End: "A final point; the conclusion or cessation.",
  Energy: "Vital force or capacity for activity.",
  Equity: "Fairness and impartiality in judgment.",
  Error: "A mistake or incorrect judgment.",
  "Evil Fatality": "A harmful or doomed outcome seen as unavoidable.",
  "Excessive Severity": "Harshness that goes beyond what is just.",
  Executive: "One who carries out plans or decisions.",
  "Extraordinary Efforts": "Unusual strength or determination beyond the norm.",
  Extravagance: "Reckless or excessive spending or behavior.",
  Failure: "Lack of success or desired result.",
  Fatality: "A death or destiny that cannot be avoided.",
  Fear: "A feeling of threat or danger.",
  Felicity: "Intense happiness or bliss.",
  Fixity: "The quality of being unchanging or stable.",
  Flight: "Escape or retreat from danger or duty.",
  Folly: "Lack of good sense; foolishness.",
  "Foolish Designs": "Unwise or ill-conceived plans.",
  Force: "Strength or power applied actively.",
  "Fortunate Marriage": "A union that brings luck or prosperity.",
  Fortune: "Chance events shaping outcomes or wealth.",
  Frenzy: "Wild, uncontrolled excitement or behavior.",
  Frugality: "Careful and restrained spending or use.",
  Fruitfulness: "Productive success or fertility.",
  "Good Understanding": "Mutual comprehension and respect.",
  Haughtiness: "Arrogant pride or disdain.",
  "Hidden Enemies": "Unknown or secret opposition.",
  Ignorance: "Lack of knowledge or awareness.",
  Immaturity: "Underdeveloped emotional or mental state.",
  Impotence: "Powerlessness or inability to act.",
  Imprisonment: "Being confined or restricted.",
  Inconstancy: "Lack of consistency or reliability.",
  Increase: "Growth in size, number, or influence.",
  Indigence: "Extreme poverty or neediness.",
  Inertia: "Resistance to change or movement.",
  Initiative: "The ability to act first and take charge.",
  Inspiration: "A sudden creative or divine influence.",
  Instability: "Lack of steadiness or reliability.",
  Intoxication: "Loss of control due to external influence.",
  Intuition: "Immediate insight without rational thought.",
  Law: "A system of rules or order.",
  "Lesser Material Happiness":
    "Mild comfort or pleasure in the physical world.",
  Lethargy: "Sluggishness or lack of energy.",
  Light: "Illumination, clarity, or truth.",
  Litigation: "Legal conflict or dispute.",
  "Long Days": "Prolonged efforts or extended time.",
  Loss: "The state of no longer having something.",
  Love: "A deep feeling of affection or connection.",
  Luck: "Unexpected good or bad fortune.",
  Magnanimity: "Generosity and nobility of spirit.",
  Magus: "A master of hidden or arcane knowledge.",
  Management: "Handling or directing with skill.",
  Mania: "Obsessive enthusiasm or mental disturbance.",
  "Marriage Alliance": "A union for social or political gain.",
  "Material Happiness": "Comfort found in wealth or possessions.",
  "Mental Illness": "Disorder affecting thoughts or emotions.",
  "Mercy and Goodness": "Kind acts driven by compassion.",
  "Minor Contentment": "Simple or temporary satisfaction.",
  Misery: "A state of great suffering or distress.",
  Moderation: "Avoidance of extremes; balance.",
  "Moral Ardor": "Passion driven by ethics or virtue.",
  Mortality: "The state of being subject to death.",
  Mystery: "Something hidden or unknown.",
  Negligence: "Failure to give proper care or attention.",
  "Neutral Predestination": "Unbiased fate; events beyond control.",
  Nullity: "State of being null or void.",
  Obstruction: "A blockage or hindrance.",
  Oppression: "Cruel or unjust exercise of power.",
  Outcome: "The final result or consequence.",
  "Over-Kindness": "Generosity that enables harm or weakness.",
  Pain: "Physical or emotional suffering.",
  Passion: "Strong emotion or desire.",
  Permanence: "Lasting stability or durability.",
  Petrifaction: "Becoming frozen by fear or shock.",
  Pettiness: "Small-mindedness or trivial concern.",
  "Physical Ardor": "Strong bodily desire or drive.",
  Physician: "A healer or one who restores.",
  Policy: "A course of action or guiding rule.",
  Power: "Control, influence, or strength.",
  Presumption: "Boldness beyond one's place.",
  Privation: "Lack of basic necessities.",
  Probity: "Strong moral integrity.",
  Prophecy: "A prediction of future events.",
  Protection: "Guarding against harm or threat.",
  Providence: "Divine guidance or foresight.",
  Prudence: "Wise caution or foresight.",
  "Public Rejoice": "A shared celebration or gladness.",
  Pussillanimity: "Timid lack of courage or determination.",
  Quarrel: "An argument or falling-out.",
  Ravage: "Destructive damage or ruin.",
  Reason: "The power of logical thought.",
  Renewal: "A fresh start or revival.",
  Rightness: "Moral or logical correctness.",
  Riot: "Chaotic and violent disruption.",
  Roguery: "Dishonest or mischievous behavior.",
  Route: "A path or course of travel.",
  Ruin: "Complete collapse or decay.",
  Sacrifice: "Giving up something valuable for a cause.",
  Science: "Knowledge gained through study.",
  Secrets: "Hidden truths or concealed knowledge.",
  Selfishness: "Concern only for oneself.",
  Sentence: "Judgment passed on actions.",
  Servitude: "Being under control of another.",
  Sickness: "Physical or mental illness.",
  Silence: "Absence of speech or revelation.",
  Simplicity: "Clarity, ease, or innocence.",
  Skill: "Ability developed through practice.",
  Sleep: "Rest or inaction.",
  Society: "A community of people and structure.",
  "Somewhat Fortunate Marriage": "A marriage with modest benefits.",
  Somnambulism: "Sleepwalking or unconscious behavior.",
  Stability: "Reliability and steadiness.",
  Stagnation: "Lack of movement or growth.",
  Success: "Achievement of goals or desires.",
  Succor: "Help in times of hardship.",
  Superfluity: "Excess beyond what is needed.",
  "Surface Knowledge": "Shallow or incomplete understanding.",
  Tenacity: "Persistence despite difficulty.",
  Terror: "Intense fear or dread.",
  "The Crowd": "Mass opinion or collective influence.",
  Theft: "Taking what is not rightfully yours.",
  "The Man to Whom You Have Recourse": "A person you turn to for support.",
  "The Unknown": "That which cannot be foreseen.",
  "The Unrevealed Future": "Events yet to unfold or be known.",
  Treason: "Betrayal of trust or allegiance.",
  Trials: "Tests or hardships of endurance.",
  "Trials Overcome": "Challenges faced and conquered.",
  Triumph: "Victory after struggle.",
  Trouble: "Difficulties or complications.",
  Truth: "That which is accurate and real.",
  Tyranny: "Cruel and absolute rule.",
  "Unfortunate Combinations": "Mismatched elements leading to difficulty.",
  "Unraveling of Involved Matters": "Clarification of something complex.",
  "Unreasoned Caution": "Fear without basis.",
  Vacillation: "Indecisive wavering between choices.",
  Vanity: "Excessive pride in appearance or self.",
  Vehemence: "Intensity of feeling or expression.",
  Vengeance: "Retaliation for a wrong.",
  Violence: "Force causing harm or damage.",
  Voyage: "A long journey or passage.",
  War: "Armed conflict between powers.",
  Weakness: "Lack of strength or resolve.",
  Wisdom: "Knowledge guided by experience and insight.",
  "You (if female)": "The female seeker or querent.",
  "You (if male)": "The male seeker or querent.",
  "Your Love Interest (if male)": "The man who holds your affection.",
};

export const TarotSuit = Object.freeze({
  CUPS: "CUPS",
  WANDS: "WANDS",
  SWORDS: "SWORDS",
  PENTACLES: "PENTACLES",
  NONE: "NONE", // Reserved for major arcana.
});

export const ArcanaClass = Object.freeze({
  MAJOR: "MAJOR",
  MINOR: "MINOR",
  BOTH: "BOTH",
});

class TarotCard {
  /**
   * Creates an instance of TarotCard.
   *
   * @constructor
   * @param {string} suit - The suit of the card. See the TarotSuit enum.
   * @param {string} value - The value of the card.
   * @param {string} description - The description of the card, from the Rider-Waite guide.
   * @param {string} arcanaClass - Major or Minor. See the ArcanaClass enum.
   * @param {string[]} meanings - The meaning of this card when it's right-side-up.
   * @param {string[]} meaningsInverse - The meaning of this card when it's upside down.
   */
  constructor(
    suit,
    value,
    description,
    arcanaClass,
    meanings,
    meaningsInverse
  ) {
    assert(suit != null && suit != undefined, `suit must be defined: ${suit}`);
    assert(
      value != null && value != undefined,
      `value must be defined: ${value}`
    );
    assert(
      description != null && description != undefined,
      `description must be defined: ${description}`
    );
    assert(
      arcanaClass != null && arcanaClass != undefined,
      `arcanaClass must be defined: ${arcanaClass}`
    );
    assert(
      meanings != null && meanings != undefined,
      `meanings must be defined: ${meanings}`
    );
    assert(
      meaningsInverse != null && meaningsInverse != undefined,
      `meaningsInverse must be defined: ${meaningsInverse}`
    );

    if (TarotSuit[suit] === undefined) {
      throw new Error(
        `Invalid TarotSuit '${suit}' provided alongside value '${value}'.`
      );
    }
    this.suit = suit;
    this.value = value;
    this.description = description;
    if (ArcanaClass[arcanaClass] === undefined) {
      throw new Error(
        `Invalid ArcanaClass '${arcanaClass}' provided alongside suit '${suit}' and value '${value}'.`
      );
    }
    this.arcanaClass = arcanaClass;
    if (!Array.isArray(meanings)) {
      throw new Error(
        `meanings should be an array, but received the following: ${meanings}`
      );
    }
    this.meanings = meanings;
    if (!Array.isArray(meaningsInverse)) {
      throw new Error(
        `meaningsInverse should be an array, but received the following: ${meanings}`
      );
    }
    this.meaningsInverse = meaningsInverse;
  }
}

/**
 * Generate a new TarotCard instance from the input object.
 *
 * @param {object} object
 * @returns {TarotCard}
 */
const tarotCardFromObject = (object) => {
  if (object.suit instanceof string) {
  }
  return new TarotCard(
    object.suit,
    object.value,
    object.description,
    object.arcanaClass,
    object.meanings,
    object.meaningsInverse
  );
};

/**
 * Given an array of objects, attempt to make an array of TarotCard instances from them
 * instead.
 *
 * @param {object[]} array
 * @returns {TarotCard[]}
 */
const tarotCardsFromList = (array) => {
  const cards = new Array();
  array.forEach((object) => {
    cards.push(tarotCardFromObject(object));
  });
  return cards;
};

const CARDS = [
  // Major arcana.
  {
    suit: TarotSuit.NONE,
    value: "The Magician",
    description: "I",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Skill",
      "Diplomacy",
      "Address",
      "Sickness",
      "Pain",
      "Loss",
      "Disaster",
      "You (if male)",
    ],
    meaningsInverse: [
      "Physician",
      "Magus",
      "Mental Illness",
      "Disgrace",
      "Disquiet",
    ],
  },
  {
    suit: TarotSuit.NONE,
    value: "The High Priestess",
    description: "II",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Secrets",
      "Mystery",
      "The Unrevealed Future",
      "Your Love Interest (if male)",
      "You (if female)",
      "Silence",
      "Tenacity",
      "Wisdom",
      "Science",
    ],
    meaningsInverse: [
      "Passion",
      "Moral Ardor",
      "Physical Ardor",
      "Conceit",
      "Surface Knowledge",
    ],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Empress",
    description: "III",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Fruitfulness",
      "Initiative",
      "Action",
      "Long Days",
      "Clandestine",
      "The Unknown",
      "Difficulty",
      "Doubt",
      "Ignorance",
    ],
    meaningsInverse: [
      "Light",
      "Truth",
      "Unraveling of Involved Matters",
      "Public Rejoice",
      "Vacillation",
    ],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Emperor",
    description: "IV",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Stability",
      "Power",
      "Aid",
      "Protection",
      "A Great Person",
      "Conviction",
      "Reason",
    ],
    meaningsInverse: [
      "Benevolence",
      "Compassion",
      "Credit",
      "Confusion to Enemies",
      "Obstruction",
      "Immaturity",
    ],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Hierophant",
    description: "V",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Marriage Alliance",
      "Captivity",
      "Servitude",
      "Mercy and Goodness",
      "Inspiration",
      "The Man to Whom You Have Recourse",
    ],
    meaningsInverse: [
      "Society",
      "Good Understanding",
      "Concord",
      "Over-Kindness",
      "Weakness",
    ],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Lovers",
    description: "VI",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: ["Attraction", "Love", "Beauty", "Trials Overcome"],
    meaningsInverse: ["Failure", "Foolish Designs"],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Chariot",
    description: "VII",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Succor",
      "Providence",
      "War",
      "Triumph",
      "Presumption",
      "Vengeance",
      "Trouble",
    ],
    meaningsInverse: ["Riot", "Quarrel", "Litigation", "Dispute", "Defeat"],
  },
  {
    suit: TarotSuit.NONE,
    value: "Strength",
    description: "VIII",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: ["Power", "Energy", "Action", "Courage", "Magnanimity"],
    meaningsInverse: ["Abuse of Power", "Despotism", "Weakness", "Discord"],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Hermit",
    description: "IX",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: ["Prudence", "Treason", "Dissimulation", "Corruption", "Roguery"],
    meaningsInverse: [
      "Concealment",
      "Disguise",
      "Fear",
      "Policy",
      "Unreasoned Caution",
    ],
  },
  {
    suit: TarotSuit.NONE,
    value: "Wheel of Fortune",
    description: "X",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: ["Destiny", "Fortune", "Luck", "Success", "Felicity"],
    meaningsInverse: ["Increase", "Abundance", "Superfluity"],
  },
  {
    suit: TarotSuit.NONE,
    value: "Justice",
    description: "XI",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: ["Equity", "Rightness", "Probity", "Executive"],
    meaningsInverse: ["Law", "Bigotry", "Bias", "Excessive Severity"],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Hanged Man",
    description: "XII",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Wisdom",
      "Trials",
      "Circumspection",
      "Discernment",
      "Sacrifice",
      "Intuition",
      "Divination",
      "Prophecy",
    ],
    meaningsInverse: ["Selfishness", "The Crowd", "Body Politic"],
  },
  {
    suit: TarotSuit.NONE,
    value: "XIII",
    description: "Death",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: ["End", "Mortality", "Destruction", "Corruption"],
    meaningsInverse: [
      "Inertia",
      "Sleep",
      "Lethargy",
      "Petrifaction",
      "Somnambulism",
    ],
  },
  {
    suit: TarotSuit.NONE,
    value: "XIV",
    description: "Temperance",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Economy",
      "Moderation",
      "Frugality",
      "Management",
      "Accomodation",
    ],
    meaningsInverse: [
      "Churches and the Priesthood",
      "Unfortunate Combinations",
      "Disunion",
      "Competing Interests",
    ],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Devil",
    description: "XV",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Ravage",
      "Violence",
      "Force",
      "Vehemence",
      "Extraordinary Efforts",
      "Fatality",
      "Neutral Predestination",
    ],
    meaningsInverse: ["Evil Fatality", "Weakness", "Pettiness", "Blindness"],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Tower",
    description: "XVI",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Misery",
      "Distress",
      "Ruin",
      "Indigence",
      "Adversity",
      "Calamity",
      "Disgrace",
      "Deception",
    ],
    meaningsInverse: ["Oppression", "Imprisonment", "Tyranny"],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Star",
    description: "XVII",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: ["Loss", "Theft", "Privation", "Abandonment"],
    meaningsInverse: ["Arrogance", "Impotence", "Haughtiness"],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Moon",
    description: "XVIII",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Hidden Enemies",
      "Danger",
      "Calumny",
      "Darkness",
      "Terror",
      "Deception",
      "Error",
    ],
    meaningsInverse: ["Instability", "Inconstancy", "Silence"],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Sun",
    description: "XIX",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: ["Material Happiness", "Fortunate Marriage", "Contentment"],
    meaningsInverse: [
      "Lesser Material Happiness",
      "Somewhat Fortunate Marriage",
      "Minor Contentment",
    ],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Last Judgement",
    description: "XX",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: ["Change of Position", "Renewal", "Outcome"],
    meaningsInverse: [
      "Weakness",
      "Pussillanimity",
      "Simplicity",
      "Deliberation",
      "Decision",
      "Sentence",
    ],
  },
  {
    suit: TarotSuit.NONE,
    value: "XXI",
    description: "The World",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Assured Success",
      "Route",
      "Voyage",
      "Emigration",
      "Flight",
      "Change of Place",
    ],
    meaningsInverse: ["Inertia", "Fixity", "Stagnation", "Permanence"],
  },
  {
    suit: TarotSuit.NONE,
    value: "The Fool",
    description: "0",
    arcanaClass: ArcanaClass.MAJOR,
    meanings: [
      "Folly",
      "Mania",
      "Extravagance",
      "Intoxication",
      "Delirium",
      "Frenzy",
      "Bewrayment",
    ],
    meaningsInverse: [
      "Negligence",
      "Absence",
      "Distribution",
      "Carelessness",
      "Apathy",
      "Nullity",
      "Vanity",
    ],
  },
];

export const ALL_CARDS = tarotCardsFromList(CARDS);

/**
 * Organize the input list of TarotCards by their arcana class in a map.
 * Return the map!
 *
 * @param {TarotCard[]} cards
 * @returns {object}
 */
export const cardsByArcana = (cards) => {
  const byArcana = {};
  cards.forEach((card) => {
    if (byArcana[card.arcanaClass] === undefined) {
      byArcana[card.arcanaClass] = [];
    }
    byArcana[card.arcanaClass].push(card);
  });
  return byArcana;
};

export const CARDS_BY_ARCANA = cardsByArcana(ALL_CARDS);

const main = () => {
  CARDS.forEach((card) => {
    card.meanings.forEach((meaning) => {
      console.log(meaning);
    });
    card.meaningsInverse.forEach((meaning) => {
      console.log(meaning);
    });
  });
};
