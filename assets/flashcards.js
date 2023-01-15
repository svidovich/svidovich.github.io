import { UNIT_4_VOCAB } from "./flashcarddata.js";

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

const addCard = (front, back) => {
  const flashCardContainer = document.getElementById("flashcardcontainer");
  const id = UUIDGeneratorBrowser();
  const scene = document.createElement("div");
  ["scene", "scene--card"].forEach((cls) => {
    scene.classList.toggle(cls);
  });
  const card = document.createElement("div");
  card.classList.toggle("card");
  ["front", "back"].forEach((faceType) => {
    const cardFace = document.createElement("div");
    cardFace.classList.toggle("card__face");
    cardFace.classList.toggle(`card__face--${faceType}`);
    cardFace.setAttribute(`face-${faceType}-id`, id);
    const textContent = document.createTextNode(faceType === "front" ? front : back);
    cardFace.appendChild(textContent);
    card.appendChild(cardFace);
  });
  scene.appendChild(card);
  flashCardContainer.appendChild(scene);
  scene.setAttribute("scene-id", id);
  card.setAttribute("card-id", id);

  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });
};

(() => {
  let vocabCopy = [...UNIT_4_VOCAB];
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
    addCard(front, rear);
  });
})();
