import { ArcanaClass, TarotSuit, CARDS_BY_ARCANA } from "./riderwaitedata.js";

const Switch = Object.freeze({
  ON: "ON",
  OFF: "OFF",
});

/**
 * Yank the selected arcana class from the webpage and return it.
 * @returns {string} - the current arcana class selected by the user. See ArcanaClass.
 */
const getArcanaClassSelection = () => {
  const classSelectionElement = document.querySelector(
    'input[name="arcana-class-selection"]:checked'
  );
  const classSelection = classSelectionElement.value;
  if (ArcanaClass[classSelection] === undefined) {
    throw new Error(
      `Invalid arcana type: '${classSelection}'. How... did you do this?`
    );
  }
  return ArcanaClass[classSelection];
};

/**
 * Turn the tarot suit display on or off based on the input.
 *
 * @param {Switch} to - Shall we turn the display on or off?
 */
const switchTarotSuitDisplay = (to) => {
  const tarotSuitDisplay = document.getElementById("suit-selection-container");
  if (to === Switch.OFF) {
    tarotSuitDisplay.style.display = "none";
  } else {
    tarotSuitDisplay.style.display = "flex";
    tarotSuitDisplay.style.margin = "0 auto";
    tarotSuitDisplay.style.width = "90%";
    tarotSuitDisplay.style.justifyContent = "center";
  }
};

/** We have some paperwork to do when people click the
 *  radio buttons on the form.
 */
const addArcanaClassListener = () => {
  const form = document.getElementById("arcana-class-selection-form");
  form.addEventListener("click", (event) => {
    const classSelection = getArcanaClassSelection();
    // If they picked minor arcana, let's let them pick a suit
    // by exposing the relevant form.
    if (classSelection == ArcanaClass.MINOR) {
      switchTarotSuitDisplay(Switch.ON);
    } else {
      switchTarotSuitDisplay(Switch.OFF);
    }
    console.log(classSelection);
  });
};

/**
 * Given an element, kill all of its children.
 *
 * @param {Element} element
 */
const clearAllFromElement = (element) => {
  while (element.lastChild) {
    element.removeChild(element.firstChild);
  }
};

const resetExerciseContainer = () => {
  const exerciseContainer = document.getElementById("exercise-container");
  clearAllFromElement(exerciseContainer);
};

/**
 * Get a random element from the input array.
 *
 * @param {Array} array
 * @returns {any}
 */
const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const chooseCardDetailsFromArcana = (arcana) => {
  const cardList = CARDS_BY_ARCANA[arcana];
  if (cardList === "undefined") {
    throw new Error(
      `Can't get a list of cards for the unsupported arcana class '${arcana}'.`
    );
  }
  return randomElement(cardList);
};

/**
 * Given a TarotCard, build a cute element to put in the container.
 *
 * @param {TarotCard} card - The input card.
 * @returns {Element} - A pretty display element for that card.
 */
const buildCardElement = (card) => {
  const container = document.createElement("div");
  const title = document.createElement("h3");

  container.appendChild(title);
  if (card.arcanaClass == ArcanaClass.MAJOR) {
    const titleText = document.createTextNode(card.value);
    title.appendChild(titleText);
  } else {
    throw new Error("No support for non-major classes rn.");
  }
  const meaningsParagraph = document.createElement("p");
  // TODO: Join the meanings with a comma and add them to the paragraph.
  return container;
};

const main = () => {
  addArcanaClassListener();
};

main();
