import {
  aspectPairData,
  pairsByCategory,
  InfinitiveCategories,
  getCategoryDisplayNameById,
  getAspectPairsForCategory,
} from "./aspectpairsdata.js";

const stageTop = document.getElementById("stagetop");
const stageBottom = document.getElementById("stagebottom");

const clearAllFromElement = (element) => {
  while (element.lastChild) {
    element.removeChild(element.firstChild);
  }
};

let currentWords = [];
const resetCurrentWords = () => {
  // A quick, cute wrapper for dropping words
  currentWords = [];
};

const primeWordsFromCategory = (categoryId) => {
  // Clear the state of the current set of words.
  resetCurrentWords();
  const aspectPairs = getAspectPairsForCategory(categoryId);
  if (aspectPairs) {
    currentWords = aspectPairs;
  }
};

const renderAllWords = () => {
  clearAllFromElement(stageBottom);
  const wordTable = document.createElement("table");
  wordTable.style.textAlign = "center";
  const headerRow = document.createElement("tr");
  [
    "No.",
    "English",
    "Imperfect",
    "Imperfect Conjugation",
    "Perfect",
    "Perfect Conjugation",
  ].forEach((columnName) => {
    const headerCell = document.createElement("th");
    const headerText = document.createTextNode(columnName);
    headerCell.appendChild(headerText);
    headerRow.appendChild(headerCell);
  });
  wordTable.appendChild(headerRow);
  let idx = 1;
  currentWords.forEach((wordEntry) => {
    const wordRow = document.createElement("tr");
    // Create a cell for the row number
    const numberCell = document.createElement("td");
    numberCell.appendChild(document.createTextNode(`${idx}`));
    wordRow.appendChild(numberCell);
    // Create a cell for each of these attributes!
    [
      "english_infinitive_pf",
      "imperfect",
      "impf_conjugation_hint",
      "perfect",
      "pf_conjugation_hint",
    ].forEach((attributeName) => {
      const attrCell = document.createElement("td");
      const attrText = document.createTextNode(wordEntry[attributeName]);
      attrCell.appendChild(attrText);
      wordRow.appendChild(attrCell);
    });
    wordTable.appendChild(wordRow);
    idx += 1;
  });
  stageBottom.appendChild(wordTable);
};

const buildCategoryDropDown = () => {
  // Build a dropdown to contain our category selector
  const dropDownDiv = document.createElement("div");
  dropDownDiv.id = "categorySelectionContainer";
  const dropDownElement = document.createElement("select");
  dropDownElement.name = "categorySelection";
  dropDownElement.id = dropDownElement.name;
  // And a cute label for when nothing's selected
  const dropDownLabel = document.createElement("label");
  dropDownLabel.for = dropDownElement.id;
  const dropDownLabelText = document.createTextNode("Select a Verb Category! ");
  // Note: labels are _adjacent_ to selects.
  dropDownLabel.appendChild(dropDownLabelText);
  dropDownDiv.appendChild(dropDownLabel);

  // Now we can get about adding the actual options! Iterate through pairsByCategory so we
  // only get categories for which there are words.
  Object.keys(pairsByCategory).forEach((categoryId) => {
    // Get a pretty name for the dropdown option.
    const prettyCategoryName = getCategoryDisplayNameById(categoryId);
    const optionText = document.createTextNode(prettyCategoryName);
    const optionForCategory = document.createElement("option");
    optionForCategory.value = categoryId;
    optionForCategory.appendChild(optionText);
    dropDownElement.appendChild(optionForCategory);
  });

  const goButton = document.createElement("button");
  goButton.id = "button-go";
  const goButtonText = document.createTextNode("Go!");
  goButton.appendChild(goButtonText);
  // When clicking go, we should grab the current dropdown value and get the words
  // for it, as it'll be a category id.
  goButton.addEventListener("click", () => {
    const dropDownValue = dropDownElement.value;
    primeWordsFromCategory(dropDownValue);
    renderAllWords();
  });

  const clearButton = document.createElement("button");
  clearButton.id = "button-clear";
  const clearButtonText = document.createTextNode("Clear");
  clearButton.appendChild(clearButtonText);
  clearButton.addEventListener("click", () => {
    resetCurrentWords();
    clearAllFromElement(stageBottom);
  });

  // Now that we've got all of the categories and our buttons, we'll put the dropdown itself into the div.
  dropDownDiv.appendChild(dropDownElement);
  dropDownDiv.appendChild(goButton);
  dropDownDiv.appendChild(clearButton);
  return dropDownDiv;
};

const main = () => {
  stageTop.appendChild(buildCategoryDropDown());
};

main();
