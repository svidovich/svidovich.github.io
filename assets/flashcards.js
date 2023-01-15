import { UNIT_4_VOCAB, practiceMap } from "./flashcarddata.js";

// Global for storing practice document state
const practiceState = new Array();

// Function for clearing the working stage
const clearStage = () => {
  // Clear the practice state. This dumps everything from the
  // array while returning it as a copy.
  const stateCopy = practiceState.splice(0, practiceState.length);
  // Drop all of the elements from the DOM.
  stateCopy.forEach((element) => {
    element.remove();
  });
};

// Button for clearing the working stage
const clearStageButton = document.getElementById("clearstagebutton");
clearStageButton.addEventListener("click", () => {
  clearStage();
});

let warningCount = 0;
const loadStage = () => {
  // Get the practice options dropdown,
  const practiceOptionsDropDown = document.getElementById("practiceoptionsdropdown");
  const choosePracticeWarning = document.getElementById("choosePracticeWarning");
  const selectedPractice = practiceOptionsDropDown.value;
  if (selectedPractice) {
    choosePracticeWarning.hidden = true;
    // Make sure we have a clean slate to work with.
    clearStage();
    // NOTE: For now, we're only loading flashcards. In the future, there might be
    // other kinds of stuff to load.
    loadShuffledFlashCards(practiceMap[selectedPractice].vocabularyObjects);
  } else {
    choosePracticeWarning.hidden = false;
    let shouldIncreaseSizeOnWarning = true;
    if (warningCount > 0) {
      choosePracticeWarning.style.color = "red";
    }
    if (warningCount > 10 && warningCount < 20) {
      choosePracticeWarning.innerHTML = "<u>BRO.</u>";
    } else if (warningCount >= 20 && warningCount < 30) {
      choosePracticeWarning.innerHTML = "<u><strong>PICK IT</strong></u>";
    } else if (warningCount >= 30 && warningCount < 30) {
      choosePracticeWarning.innerHTML = "<u><strong><em>WHAT ARE YOU DOING</em></strong></u>";
    } else if (warningCount >= 40 && warningCount < 50) {
      choosePracticeWarning.innerHTML = "<u><strong><em>STOP</em></strong></u>";
    } else if (warningCount >= 50 && warningCount < 60) {
      choosePracticeWarning.innerHTML = "Why. This is not a feature.";
    } else if (warningCount >= 60 && warningCount < 70) {
      choosePracticeWarning.innerHTML = "<strong>???????</strong>";
    } else if (warningCount >= 80) {
      choosePracticeWarning.innerHTML = `Fine. FINE. Here's a score. This is a game now. Are you happy?<br/>${warningCount}`;
      choosePracticeWarning.style.fontSize = 16;
      shouldIncreaseSizeOnWarning = false;
    }
    if (shouldIncreaseSizeOnWarning) {
      choosePracticeWarning.style.fontSize = 16 + warningCount;
    }
    warningCount += 1;
  }
};

// Button for filling the working stage
const loadStageButton = document.getElementById("loadstagebutton");
loadStageButton.addEventListener("click", () => {
  loadStage();
});

// NOTE: In the future, this won't just be VocabularySection objects.
// We'll see how this goes.
const fillPracticeOptionsDropdown = (vocabularySections) => {
  const practiceOptionsDropDown = document.getElementById("practiceoptionsdropdown");
  vocabularySections.forEach((vocabularySection) => {
    // Create a new option that we'll shortly add to the dropdown
    const vocabularySectionOption = document.createElement("option");
    // Add a 'value' to the option. NOTE: in the future it might be good to have
    // more attributes that act as categories by which we can divine the capabilities
    // of each of the entries. We'll see.
    vocabularySectionOption.setAttribute("value", vocabularySection.unfriendlyName);
    // Add the text that will show up in the dropdown,
    const descriptionNode = document.createTextNode(vocabularySection.friendlyName);
    // and add it to the option itself.
    vocabularySectionOption.appendChild(descriptionNode);
    // Finally, pin the option to the dropdown.
    practiceOptionsDropDown.appendChild(vocabularySectionOption);
  });
};

// Stolen UUID generator.
const UUIDGeneratorBrowser = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );

// Stolen array shuffler.
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Adds a new flashcard. Front and Back are the words that appear
// on the front and back of the card, respectively.
const addFlashcard = (front, back) => {
  const flashCardContainer = document.getElementById("flashcardcontainer");
  // I don't know _why_ I feel the need to make these unique, but something
  // tells me I will thank myself later.
  const id = UUIDGeneratorBrowser();
  // Create a new scene. This is where the card will live.
  const scene = document.createElement("div");
  // Get some classes onto the scene.
  ["scene", "scene--card"].forEach((cls) => {
    scene.classList.toggle(cls);
  });
  // Create the actual card itself,
  const card = document.createElement("div");
  // and create the front and back of the card.
  card.classList.toggle("card");
  ["front", "back"].forEach((faceType) => {
    // ( this creates each face as a separate div )
    const cardFace = document.createElement("div");
    cardFace.classList.toggle("card__face");
    cardFace.classList.toggle(`card__face--${faceType}`);
    cardFace.setAttribute(`face-${faceType}-id`, id);
    // Dynamically create the text for this face as a DOM node
    const textContent = document.createTextNode(faceType === "front" ? front : back);
    // and add our newly created elements to the card
    cardFace.appendChild(textContent);
    card.appendChild(cardFace);
  });
  // Add the card to our scene,
  scene.appendChild(card);
  scene.setAttribute("scene-id", id);
  // and add our scene to the card box.
  flashCardContainer.appendChild(scene);
  card.setAttribute("card-id", id);

  // Add the scene to our practice state so we can delete it later
  // if we should choose to.
  practiceState.push(scene);
  // Add a listener that lets us flip the card over.
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });
};

// Loads an array of vocabularyObjects as flashcards onto the document
const loadShuffledFlashCards = (vocabularyObjects) => {
  const vocabCopy = [...vocabularyObjects];
  shuffle(vocabCopy);
  vocabCopy.forEach((vocabularyObject) => {
    // Let's flip some coins, shall we?
    let front;
    let rear;
    if (randomInt(0, 100) > 50) {
      // In this case, we've got Yugo on the front.
      // Cyrillic, or latin?
      if (randomInt(0, 100) > 50) {
        front = vocabularyObject.cyrillic;
      } else {
        front = vocabularyObject.latin;
      }
      rear = vocabularyObject.english;
    } else {
      // Now, the front is English.
      front = vocabularyObject.english;
      // In this case, we've got Yugo on the rear.
      // Cyrillic, or latin?
      if (randomInt(0, 100) > 50) {
        rear = vocabularyObject.cyrillic;
      } else {
        rear = vocabularyObject.latin;
      }
    }
    addFlashcard(front, rear);
  });
};

(() => {
  fillPracticeOptionsDropdown(Object.values(practiceMap));
})();
