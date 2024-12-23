import { SAMPLES, pronounceSound } from "./pronounce/pronounceData.js";

const headerDiv = document.getElementById("header");
const stageDiv = document.getElementById("stage");
const footerDiv = document.getElementById("footer");

const sampleCount = SAMPLES.length;

const firstHalf = SAMPLES.slice(0, Math.floor(sampleCount / 2));
const secondHalf = SAMPLES.slice(
  Math.floor(sampleCount / 2 + 1),
  sampleCount - 1
);

const clearStage = () => {
  while (stageDiv.firstChild) {
    stageDiv.removeChild(stageDiv.lastChild);
  }
};

const addPlaySound = (element, soundKey) => {
  element.addEventListener("click", (event_) => {
    pronounceSound(soundKey);
  });
};

// Add some data to the center of the stage.
const stageLetterDatum = (letterDatum) => {
  // Dump what's there
  clearStage();
  // Add a new div to contain anything,
  const datumDivContainer = document.createElement("div");
  datumDivContainer.style.textAlign = "center";

  // Create the header, which is just the two letters, latin and cyrillic,
  // on the same line.
  const datumHeader = document.createElement("h2");
  datumHeader.textContent = `${letterDatum.latin} / ${letterDatum.cyrillic}`;
  datumDivContainer.appendChild(datumHeader);

  // Get the text for the first example in both languages. Add that as a div.
  const datumSampleTextBCMS = letterDatum.examples[0].bcms;
  const soundKey = datumSampleTextBCMS.toLowerCase();
  const datumSampleTextEnglish = letterDatum.examples[0].english;
  const datumCurrentBodyText = `${datumSampleTextBCMS} (${datumSampleTextEnglish})`;
  const datumBody = document.createElement("div");

  const speakerImgBody = document.createElement("img");
  speakerImgBody.src = "../media/speaker.png";
  speakerImgBody.style.cursor = "click";
  addPlaySound(speakerImgBody, soundKey);

  const nl = document.createElement("br");

  datumBody.textContent = datumCurrentBodyText;
  datumBody.appendChild(nl);
  datumBody.appendChild(speakerImgBody);

  datumDivContainer.appendChild(datumBody);

  stageDiv.appendChild(datumDivContainer);
};

// Add a box for containing a letter that we can click on.
const mkLetterBox = (letterDatum) => {
  // Making them spans makes them inline by default, which we would like
  const letterBox = document.createElement("span");
  letterBox.textContent = letterDatum.latin;
  letterBox.className = "letterbox";
  letterBox.addEventListener("click", (event_) => {
    stageLetterDatum(letterDatum);
  });
  return letterBox;
};

// Put the first half of the letters in the header,
firstHalf.forEach((letterDatum) => {
  const letterBox = mkLetterBox(letterDatum);
  headerDiv.appendChild(letterBox);
});

// Put the second half of the letters in the footer.
secondHalf.forEach((letterDatum) => {
  const letterBox = mkLetterBox(letterDatum);
  footerDiv.appendChild(letterBox);
});

stageLetterDatum(SAMPLES[0]);
