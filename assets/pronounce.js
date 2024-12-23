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
  // Destroy everything on the stage.
  while (stageDiv.firstChild) {
    stageDiv.removeChild(stageDiv.lastChild);
  }
};

const addPlaySound = (element, soundKey) => {
  // Add a "pronounceSound" onclick to some element
  // based on the key that was passed
  element.addEventListener("click", (event_) => {
    pronounceSound(soundKey);
  });
};

const stageLetterDatum = (letterDatum) => {
  // Add some data to the center of the stage.
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
  // Get the key we need to play the sound for this sample
  const soundKey = datumSampleTextBCMS.toLowerCase();
  // Get the first example. Later we'll need to be able to handle multiple samples.
  const datumSampleTextEnglish = letterDatum.examples[0].english;
  const datumCurrentBodyText = `${datumSampleTextBCMS} (${datumSampleTextEnglish})`;

  // Add a cute little click-able speaker
  const speakerImgBody = document.createElement("img");
  speakerImgBody.src = "../media/speaker.png";
  speakerImgBody.style.cursor = "pointer";
  addPlaySound(speakerImgBody, soundKey);

  const nl = document.createElement("br");

  // Add a body div to contain all of our actual content
  const datumBody = document.createElement("div");
  // Add the body text,
  datumBody.textContent = datumCurrentBodyText;
  // A newline,
  datumBody.appendChild(nl);
  // And the cute speaker button,
  datumBody.appendChild(speakerImgBody);
  // And then dump the body onto the div,
  datumDivContainer.appendChild(datumBody);
  // And then dump the div onto the stage.
  stageDiv.appendChild(datumDivContainer);
};

// Add a box for containing a letter that we can click on.
const mkLetterBox = (letterDatum) => {
  // Making them spans makes them inline by default, which we would like
  const letterBox = document.createElement("span");
  // Add the latin version to the box. Maybe later we can support the cyrillic.
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
