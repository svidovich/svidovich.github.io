import {
  VERBS_1_JSON,
  VERBS_2_JSON,
  VERBS_3_JSON,
  VERBS_4_JSON,
  VERBS_5_JSON,
  VERBS_6_JSON,
} from "./cards/verbs.js";

import { playSound } from "./cards/sound.js";

import {
  chooseRandomExcept,
  randomInt,
  shuffleArray,
} from "./cards/utilities.js";

const CARD_COLUMN_MAX = 4;

const LessonState = Object.freeze({
  NOT_STARTED: "notstarted",
  TRANSLATION: "translation",
  CONJUGATION: "conjugation",
  WORD_COMPLETE: "wordcomplete",
  LESSON_COMPLETE: "lessoncomplete",
});

const TensesUgly = Object.freeze({
  FPS: "FPS",
  TPP: "TPP",
});

const TensesPretty = Object.freeze({
  FPS: "First-Person Singular",
  TPP: "Third-Person Plural",
});

class Verb {
  constructor(verbJSON) {
    this.english = verbJSON.english;
    this.latin = verbJSON.latin;
    this.conjugations = verbJSON.conjugations;
    this.irregularities = verbJSON.irregularities || null;
  }
}

class VerbLesson {
  constructor(title, id, verbJSONArray) {
    this.title = title;
    this.id = id;
    this.verbs = [];
    verbJSONArray.forEach((entry) => {
      this.verbs.push(new Verb(entry));
    });
    this.cardCount = this.verbs.length;
    this.currentIndex = 0;
    this.maxIndex = this.cardCount - 1;
    this._state = LessonState.NOT_STARTED;
  }
  set state(s) {
    if (!Object.values(LessonState).includes(s)) {
      throw new Error(`${s} is not a valid LessonState`);
    } else {
      this._state = s;
    }
  }
  get state() {
    return this._state;
  }
  resetIndex() {
    this.currentIndex = 0;
  }
  resetState() {
    this.state = LessonState.NOT_STARTED;
  }
  reset() {
    this.resetIndex();
    this.resetState();
  }
  shuffleVerbs() {
    this.verbs = shuffleArray(this.verbs);
  }
}

const endings = {
  FPS: ["ajem", "am", "ejem", "em", "ijam", "ijem", "im", "ujem", "ujim", "um"],
  TPP: ["aju", "eju", "e", "uju", "iju", "oju"],
};

const chopEngInfinitive = (text) => {
  return text.replaceAll("To ", "");
};

const createIncorrectVerbEndings = (verb, tense) => {
  let stemNoPriorLetter;

  const infinitive = verb.latin;
  // TODO I don't think we need to give a shit
  // about irregular verbs rn. We can add more
  // functionality here as a feature later.
  // if (infinitive.endsWith("ti")) {
  //   // Get everything but the last three characters
  // }
  stemNoPriorLetter = infinitive.slice(0, -3);
  const fakes = [];
  for (const ending of shuffleArray(endings[tense])) {
    const fakeCandidate = `${stemNoPriorLetter}${ending}`;
    if (fakeCandidate !== verb.conjugations[tense]) {
      fakes.push(fakeCandidate);
    }
    if (fakes.length === 3) {
      break;
    }
  }
  return fakes;
};

const LESSONS = [
  new VerbLesson("Verbs I", "verbs1", shuffleArray(VERBS_1_JSON)),
  new VerbLesson("Verbs II", "verbs2", shuffleArray(VERBS_2_JSON)),
  new VerbLesson("Verbs III", "verbs3", shuffleArray(VERBS_3_JSON)),
  new VerbLesson("Verbs IV", "verbs4", shuffleArray(VERBS_4_JSON)),
  new VerbLesson("Verbs V", "verbs5", shuffleArray(VERBS_5_JSON)),
  new VerbLesson("Verbs VI", "verbs6", shuffleArray(VERBS_6_JSON)),
];

const LESSONS_MAP = {};
LESSONS.forEach((lesson) => {
  LESSONS_MAP[lesson.id] = lesson;
});

const prepDropdown = () => {
  const selectorDropDown = document.getElementById("lessondropdown");
  LESSONS.forEach((lesson) => {
    const dropDownEntry = document.createElement("option");
    const dropDownEntryText = document.createTextNode(lesson.title);
    dropDownEntry.appendChild(dropDownEntryText);
    dropDownEntry.value = lesson.id;
    dropDownEntry.id = `${lesson.id}-option`;

    selectorDropDown.appendChild(dropDownEntry);
  });
};

let currentLesson;

const getCurrentLessonDropDownValue = () => {
  const selectorDropDown = document.getElementById("lessondropdown");
  return selectorDropDown.value;
};
const setCurrentLessonFromDropDown = () => {
  currentLesson = LESSONS_MAP[getCurrentLessonDropDownValue()];
};

const clearStage = () => {
  const stage = document.getElementById("gamecontainer");
  while (stage.firstChild) {
    stage.removeChild(stage.lastChild);
  }
};

const translationQuizButtonFromText = (text, correct = false) => {
  // NOTE: MODIFIES STATE
  const button = document.createElement("button");
  const buttonText = document.createTextNode(text);
  button.appendChild(buttonText);
  button.classList.add("lessoncardbutton");
  button.setAttribute("correct", correct);
  if (correct === false) {
    button.addEventListener("click", () => {
      button.style.backgroundColor = "red";
      playSound("fart");
    });
  } else {
    button.addEventListener("click", () => {
      button.style.backgroundColor = "green";
      currentLesson.state = LessonState.CONJUGATION;
      playSound("block", 0.1);
      addCurrentLessonConjugation();
    });
  }
  return button;
};

const conjugationQuizOptionsFromVerb = (verb, tense) => {
  return [verb.conjugations[tense], ...createIncorrectVerbEndings(verb, tense)];
};

const conjugationQuizButtonFromText = (text, correct = false) => {
  // NOTE will need more work when we get more tenses.
  const button = document.createElement("button");
  const buttonText = document.createTextNode(text);
  button.appendChild(buttonText);
  button.classList.add("lessoncardbutton");
  button.setAttribute("correct", correct);
  if (correct === false) {
    button.addEventListener("click", () => {
      button.style.backgroundColor = "red";
      playSound("fart");
    });
  } else {
    button.addEventListener("click", () => {
      button.style.backgroundColor = "green";
      currentLesson.state = LessonState.WORD_COMPLETE;
      playSound("block", 0.1);
      addNextWordButton();
    });
  }
  return button;
};

const addNextWordButton = () => {
  // TODO detect when I'm at the last index and say
  // lesson complete instead of next word
  const lessonTable = document.getElementById("lessoncardtable");
  const titleRow = document.createElement("tr");
  const titleCell = document.createElement("td");
  titleCell.colSpan = CARD_COLUMN_MAX;

  const nextButton = document.createElement("button");
  nextButton.classList.add("lessoncardbutton");
  if (currentLesson.currentIndex !== currentLesson.maxIndex) {
    nextButton.addEventListener("click", () => {
      currentLesson.currentIndex += 1;
      currentLesson.state = LessonState.NOT_STARTED;
      clearStage();
      renderCurrentLessonCard();
    });
    const buttonContent = document.createTextNode("Next Word!");
    nextButton.appendChild(buttonContent);
    titleCell.appendChild(nextButton);
  } else {
    const congratsRow = document.createElement("tr");
    const congratsCell = document.createElement("td");
    congratsCell.colSpan = CARD_COLUMN_MAX;
    const congrats = document.createTextNode("Yay, lesson complete!");
    congratsCell.appendChild(congrats);
    congratsRow.appendChild(congratsCell);
    lessonTable.appendChild(congratsRow);
    nextButton.addEventListener("click", () => {
      clearStage();
    });
    const buttonContent = document.createTextNode("Clear Stage!");
    nextButton.appendChild(buttonContent);
    titleCell.appendChild(nextButton);
    playSound("soda", 0.5);
  }
  titleRow.appendChild(titleCell);
  lessonTable.appendChild(titleRow);
};

const getVerbForm = (verb, tense) => {
  if (tense === TensesUgly.TPP) {
    if (verb.irregularities && verb.irregularities.plural) {
      return verb.irregularities.plural;
    } else {
      return verb.english;
    }
  } else {
    if (verb.irregularities && verb.irregularities.singular) {
      return verb.irregularities.singular;
    } else {
      return verb.english;
    }
  }
};

const addCurrentLessonConjugation = () => {
  // This will need refactored with more tense support
  const lessonTable = document.getElementById("lessoncardtable");
  const currentVerb = currentLesson.verbs[currentLesson.currentIndex];
  const tense = randomInt(0, 100) > 50 ? TensesUgly.FPS : TensesUgly.TPP;
  const pronoun = tense === TensesUgly.FPS ? "I" : "They";
  let verbForm = getVerbForm(currentVerb, tense);
  verbForm = chopEngInfinitive(verbForm);

  const quizOptions = conjugationQuizOptionsFromVerb(currentVerb, tense);
  const lessonTitleRow = document.createElement("tr");
  const lessonTitleCell = document.createElement("td");
  lessonTitleCell.colSpan = CARD_COLUMN_MAX;
  const titleContent = document.createTextNode(
    `Conjugate ${currentVerb.latin} so that it translates to "${pronoun} ${verbForm}."`
  );
  lessonTitleCell.appendChild(titleContent);
  lessonTitleRow.appendChild(lessonTitleCell);
  lessonTable.appendChild(lessonTitleRow);
  const correctOption = quizOptions[0];
  const correctButton = conjugationQuizButtonFromText(correctOption, true);
  const incorrectOptions = quizOptions.slice(1);
  const incorrectButtons = [];
  for (const opt of incorrectOptions) {
    incorrectButtons.push(conjugationQuizButtonFromText(opt, false));
  }
  const allOptions = [correctButton, ...incorrectButtons];
  shuffleArray(allOptions);

  const lessonConjugationRow = document.createElement("tr");

  for (let i = 0; i < 4; i++) {
    const lessonConjugationCell = document.createElement("td");
    lessonConjugationCell.appendChild(allOptions[i]);
    lessonConjugationRow.appendChild(lessonConjugationCell);
  }
  lessonTable.appendChild(lessonConjugationRow);
};

const addCurrentLessonTranslation = () => {
  const lessonTable = document.getElementById("lessoncardtable");
  // Grab the current verb,
  const currentVerb = currentLesson.verbs[currentLesson.currentIndex];
  // And dump it into the top of the table
  const lessonTitleRow = document.createElement("tr");
  // This td will contain our top-level question.
  // First we're going to ask what the verb means.
  const lessonTitleCell = document.createElement("td");
  // I think we're gonna max out at 4 cols. That's fine.
  lessonTitleCell.colSpan = CARD_COLUMN_MAX;
  const titleContent = document.createTextNode(
    `"${currentVerb.latin}" means...`
  );
  lessonTitleCell.appendChild(titleContent);
  lessonTitleRow.appendChild(lessonTitleCell);
  lessonTable.appendChild(lessonTitleRow);

  // The next row contains some buttons that are
  // potential answers to the question in the
  // title cell.
  const lessonTranslationRow = document.createElement("tr");

  // Now we're going to get some options to make
  // a little baby quiz.
  // The correct answer
  const correctAnswer = currentVerb;

  // Make an array to host incorrect answers
  const incorrectAnswers = [];
  const quizButtonsTranslation = [
    translationQuizButtonFromText(correctAnswer.english, true),
  ];

  for (let i = 0; i < 3; i++) {
    // Choose a verb from the lesson that isn't our correct answer,
    // nor any of the incorrect answers we've already tracked.
    const incorrectVerb = chooseRandomExcept(currentLesson.verbs, [
      correctAnswer,
      ...incorrectAnswers,
    ]);
    // Add our incorrect verb to our list of incorrect answers.
    incorrectAnswers.push(incorrectVerb);
    const incorrectButton = translationQuizButtonFromText(
      incorrectVerb.english
    );

    quizButtonsTranslation.push(incorrectButton);
  }
  // For every quiz button,
  shuffleArray(quizButtonsTranslation).forEach((quizButton) => {
    // let's add a new td to contain it.
    const buttonCell = document.createElement("td");
    // let's add the button to the td.
    buttonCell.appendChild(quizButton);
    // let's add the TD to this row.
    lessonTranslationRow.appendChild(buttonCell);
  });
  lessonTable.appendChild(lessonTranslationRow);
};

const renderCurrentLessonCard = () => {
  // Grab the stage,
  const stage = document.getElementById("gamecontainer");
  // Create a div for our lesson to live in.
  const lessonDiv = document.createElement("div");
  lessonDiv.classList.add("lessoncarddiv");
  // lessonDiv.style.border = "1px solid black";
  // Create a table to contain the lesson.
  const lessonTable = document.createElement("table");
  lessonTable.id = "lessoncardtable";
  lessonTable.classList.add("lessoncardtable");
  lessonDiv.appendChild(lessonTable);
  stage.appendChild(lessonDiv);

  currentLesson.state = LessonState.TRANSLATION;
  addCurrentLessonTranslation();
};

const resetStage = (resetLesson = false) => {
  // Dump all of the elements from the stage
  clearStage();
  // If we have a lesson, reset its index in
  // case usr wants to use it later if usr
  // instructs us to
  if (currentLesson !== undefined && resetLesson === true) {
    currentLesson.reset();
  }
  // Grab the value from the dropdown
  // and set the current lesson
  setCurrentLessonFromDropDown();
};

const prepActivateButton = () => {
  const activateButton = document.getElementById("lessonactivate");
  activateButton.addEventListener("click", () => {
    resetStage(true);
    renderCurrentLessonCard();
    playSound("maraca", 0.3);
  });
};

const main = () => {};

(() => {
  prepDropdown();
  prepActivateButton();
})();
