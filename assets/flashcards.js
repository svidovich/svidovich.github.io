import { latinToJugoslavCyrillic } from "./flashcarddata.js";

const UUIDGeneratorBrowser = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );

const addcard = () => {
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
    const textContent = document.createTextNode("Argh me bones");
    cardFace.appendChild(textContent);
    card.appendChild(cardFace);
  });
  scene.appendChild(card);
  flashCardContainer.appendChild(scene);
  scene.setAttribute("scene-id", id);
  card.setAttribute("card-id", id);

  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
    console.log(`${id}, ${card.classList}`);
  });
  console.log(`Card with id ${id} added.`);
};

let counter = 0;
(() => {
  addcard();
  addcard();
})();
