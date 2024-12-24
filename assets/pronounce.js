import { SAMPLES, pronounceSound } from "./pronounce/pronounceData.js";

const headerDiv = document.getElementById("header");
const stageDiv = document.getElementById("stage");
const footerDiv = document.getElementById("footer");

const sampleCount = SAMPLES.length;

const firstHalf = SAMPLES.slice(0, Math.floor(sampleCount / 2) + 1);
const secondHalf = SAMPLES.slice(Math.floor(sampleCount / 2) + 1, sampleCount);

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

const getNextIndex = (examples, currentIndex) => {
  return currentIndex + 1 >= examples.length ? 0 : currentIndex + 1;
};

const stageLetterDatum = (letterDatum, index) => {
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

  // If we supplied an index, use it. If not, oh well! Use 0.
  const usableIndex = index ? index : 0;

  // Get the text for the first example in both languages. Add that as a div.
  const datumSampleTextBCMS = letterDatum.examples[usableIndex].bcms;
  // Get the key we need to play the sound for this sample
  const soundKey = datumSampleTextBCMS.toLowerCase();
  // Get the first example. Later we'll need to be able to handle multiple samples.
  const datumSampleTextEnglish = letterDatum.examples[usableIndex].english;
  const datumCurrentBodyText = `${datumSampleTextBCMS} (${datumSampleTextEnglish})`;

  // Add a cute little click-able speaker
  const speakerImgBody = document.createElement("img");
  speakerImgBody.src = "../media/speaker.png";
  speakerImgBody.style.cursor = "pointer";
  speakerImgBody.id = "playsoundbutton";
  addPlaySound(speakerImgBody, soundKey);

  // These are for sample navigation...
  const rightArrow = document.createElement("span");
  rightArrow.textContent = "⋙";
  rightArrow.className = "naviarrow";

  if (letterDatum.examples.length <= 1) {
    // If we don't have more than one sample, grey out my cute little
    // navigation button, and make it yell at them.
    rightArrow.style.color = "grey";
    rightArrow.style.cursor = "not-allowed";
    rightArrow.title = "No other examples available!";
  } else {
    // Otherwise, make it green and a pointy, and then add a listener to
    // cycle to the next sample.
    rightArrow.style.color = "green";
    rightArrow.style.cursor = "pointer";
    rightArrow.style.fontSize = "1.33em";
    rightArrow.style.border = "2px dotted green";
    rightArrow.style.borderRadius = "5px";
    rightArrow.title = "Click for another example.";
    rightArrow.id = "clickablesamplenavigator";
    rightArrow.addEventListener("click", (event_) => {
      stageLetterDatum(
        letterDatum,
        getNextIndex(letterDatum.examples, usableIndex)
      );
    });
  }

  // Add a body div to contain all of our actual content
  const datumBody = document.createElement("div");
  // Add the body text,
  datumBody.textContent = datumCurrentBodyText;
  // A newline,
  datumBody.appendChild(document.createElement("br"));
  // And the cute speaker button,
  datumBody.appendChild(speakerImgBody);
  // And then dump the body onto the div,
  datumDivContainer.appendChild(datumBody);
  // Add a newline so the play button isn't crowded,
  datumDivContainer.appendChild(document.createElement("br"));
  // datumDivContainer.appendChild(document.createElement("br"));
  // And dump the navigation arrow,
  datumDivContainer.appendChild(rightArrow);
  // And then dump the div onto the stage.
  stageDiv.appendChild(datumDivContainer);
};

// Add a box for containing a letter that we can click on.
const mkLetterBox = (letterDatum, index) => {
  // Making them spans makes them inline by default, which we would like
  const letterBox = document.createElement("span");
  letterBox.tabIndex = index;
  // Add the latin version to the box. Maybe later we can support the cyrillic.
  letterBox.textContent = letterDatum.latin;
  letterBox.className = "letterbox";
  letterBox.addEventListener("click", (event_) => {
    stageLetterDatum(letterDatum);
  });
  return letterBox;
};

// Dump all of the tab indexes from all page elements.
// Sorry everybody else! This hopefully makes tab navigation
// somewhat less of a pain.
document.querySelectorAll("[tabindex]").forEach((element) => {
  element.removeAttribute("tabindex");
});

// A box where we can dump our created letterboxes.
// We'll use this for tab controlling.
const letterBoxRegistry = new Object();

let lastIndex = 0;
// Put the first half of the letters in the header,
for (const [index, letterDatum] of firstHalf.entries()) {
  const letterBox = mkLetterBox(letterDatum, index);
  letterBoxRegistry[index] = letterBox;
  headerDiv.appendChild(letterBox);
  lastIndex = index;
}

let maxIndex = 0;
// Put the second half of the letters in the footer.
for (const [index, letterDatum] of secondHalf.entries()) {
  // For the index, start where we left off. Careful on that off-by-one.
  const thisIndex = index + lastIndex + 1;
  const letterBox = mkLetterBox(letterDatum, thisIndex);
  letterBoxRegistry[thisIndex] = letterBox;
  footerDiv.appendChild(letterBox);
  maxIndex = thisIndex;
}

// State of which index is selected.
let currentSelection = 0;

const nextLetter = (currentIndex) => {
  // Stage the next letter, based on global state.
  if (currentIndex === SAMPLES.length - 1) {
    currentSelection = 0;
  } else {
    currentSelection = currentIndex + 1;
  }
  stageLetterDatum(SAMPLES[currentSelection]);
};

const prevLetter = (currentIndex) => {
  // Stage the previous letter, based on global state.
  if (currentIndex === 0) {
    currentSelection = SAMPLES.length - 1;
  } else {
    currentSelection = currentIndex - 1;
  }
  stageLetterDatum(SAMPLES[currentSelection]);
};

// A block of keyboard controls!
document.addEventListener("keydown", (event_) => {
  if (event_.key == "Tab") {
    // Make sure that the browser doesn't act a fool, here. We
    // don't want it to do typical tab navigation.
    event_.preventDefault();
    if (event_.shiftKey === true) {
      // Press shift + tab to go to the previous letter.
      prevLetter(currentSelection);
    } else {
      // Press tab to go to the next letter.
      nextLetter(currentSelection);
    }
    // Focus the letterbox so usr knows what they're looking at.
    letterBoxRegistry[currentSelection].focus();
  } else if (event_.code == "Space") {
    // Press space to play sounds.
    document.getElementById("playsoundbutton").click();
  } else if (event_.key == "Enter") {
    // Press enter to cycle samples for the current letter.
    document.getElementById("clickablesamplenavigator").click();
  }
});

// Set the first letter to be the default selection,
stageLetterDatum(SAMPLES[currentSelection]);
// And make sure its letterbox is focused!
letterBoxRegistry[currentSelection].focus();
