import {
  VERBS_1_JSON,
  VERBS_2_JSON,
  VERBS_3_JSON,
  VERBS_4_JSON,
  VERBS_5_JSON,
  VERBS_6_JSON,
} from "./cards/verbs.js";

import { playSound } from "./cards/sound.js";

import { chooseRandomExcept, shuffleArray } from "./cards/utilities.js";

const CARD_COLUMN_MAX = 4;

const LessonState = Object.freeze({
  NOT_STARTED: "notstarted",
  TRANSLATION: "translation",
  CONJUGATION: "conjugation",
  WORD_COMPLETE: "wordcomplete",
  LESSON_COMPLETE: "lessoncomplete",
});

const Tenses = Object.freeze({
  FPS: "First-Person Singular",
  TPP: "Third-Person Plural",
});

class Verb {
  constructor(verbJSON) {
    this.english = verbJSON.english;
    this.latin = verbJSON.latin;
    this.conjugations = verbJSON.conjugations;
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

const LESSONS = [
  new VerbLesson("Verbs I", "verbs1", VERBS_1_JSON),
  new VerbLesson("Verbs II", "verbs2", VERBS_2_JSON),
  new VerbLesson("Verbs III", "verbs3", VERBS_3_JSON),
  new VerbLesson("Verbs IV", "verbs4", VERBS_4_JSON),
  new VerbLesson("Verbs V", "verbs5", VERBS_5_JSON),
  new VerbLesson("Verbs VI", "verbs6", VERBS_6_JSON),
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

const quizButtonFromText = (text, correct = false) => {
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
      playSound("block");
      addCurrentLessonConjugation();
    });
  }
  return button;
};

const addCurrentLessonConjugation = () => {
  console.log("HELLO. WORLD.");
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
    quizButtonFromText(correctAnswer.english, true),
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
    const incorrectButton = quizButtonFromText(incorrectVerb.english);

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
  lessonDiv.style.border = "1px solid black";
  // Create a table to contain the lesson.
  const lessonTable = document.createElement("table");
  lessonTable.id = "lessoncardtable";
  lessonTable.classList.add("lessoncardtable");
  lessonDiv.appendChild(lessonTable);
  stage.appendChild(lessonDiv);

  currentLesson.state = LessonState.TRANSLATION;
  addCurrentLessonTranslation();
};

const resetStage = () => {
  // Dump all of the elements from the stage
  clearStage();
  // If we have a lesson, reset its index in
  // case usr wants to use it later
  if (currentLesson != undefined) {
    currentLesson.reset();
  }
  // Grab the value from the dropdown
  // and set the current lesson
  setCurrentLessonFromDropDown();
};

const prepActivateButton = () => {
  const activateButton = document.getElementById("lessonactivate");
  activateButton.addEventListener("click", () => {
    resetStage();
    renderCurrentLessonCard();
  });
};

const main = () => {};

(() => {
  prepDropdown();
  prepActivateButton();
})();
