import { isMobile } from "./cards/os.js";
const headerDiv = document.getElementById("header");
const stageDiv = document.getElementById("stage");
const footerDiv = document.getElementById("footer");

const frequencies = [
  { name: "C", frequency: 523.25 },
  { name: "B", frequency: 493.88 },
  { name: "A♯/B♭", frequency: 466.16 },
  { name: "A", frequency: 440.0 },
  { name: "G♯/A♭", frequency: 415.3 },
  { name: "G", frequency: 392.0 },
  { name: "F♯/G♭", frequency: 369.99 },
  { name: "F", frequency: 349.23 },
  { name: "E", frequency: 329.63 },
  { name: "D♯/E♭", frequency: 311.13 },
  { name: "D", frequency: 293.66 },
  { name: "C♯/D♭", frequency: 277.18 },
  { name: "C", frequency: 261.63 },
];

const sampleCount = frequencies.length;
const firstHalf = frequencies.slice(0, Math.floor(sampleCount / 2) + 1);
const secondHalf = frequencies.slice(
  Math.floor(sampleCount / 2) + 1,
  sampleCount
);

let globalOscillator;
const playFreq = (freq, playlen) => {
  if (globalOscillator) {
    globalOscillator.stop();
  }
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  globalOscillator = oscillator;
  oscillator.type = "sine";
  oscillator.frequency.value = freq;
  oscillator.connect(context.destination);
  oscillator.start();
  setTimeout(() => {
    oscillator.stop();
  }, playlen);
  return oscillator;
};

const startFreq = (freq) => {
  if (globalOscillator) {
    globalOscillator.stop();
  }
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  globalOscillator = oscillator;
  oscillator.type = "sine";
  oscillator.frequency.value = freq;
  oscillator.connect(context.destination);
  oscillator.start();
  return oscillator;
};

const setPlatformDependentPlayListener = (element, frequency) => {
  // Different client behaviour if we're on mobile: we want to play
  // the note until we let go.
  if (isMobile()) {
    let oscillator;
    element.addEventListener("pointerdown", (event_) => {
      oscillator = startFreq(frequency);
    });
    element.addEventListener("pointerup", (event_) => {
      oscillator.stop();
    });
    // element.addEventListener("ontouchstart", (event_) => {
    //   oscillator = startFreq(frequency);
    // });
    // element.addEventListener("ontouchend", (event_) => {
    //   oscillator.stop();
    // });
  } else {
    const duration = 1500;
    element.addEventListener("click", (event_) => {
      playFreq(frequency, duration);
    });
  }
};

const clearStage = () => {
  // Destroy everything on the stage.
  while (stageDiv.firstChild) {
    stageDiv.removeChild(stageDiv.lastChild);
  }
};

const stageLetterDatum = (noteWithFreq) => {
  // Add some data to the center of the stage.
  // Dump what's there
  clearStage();
  // Add a new div to contain anything,
  const datumDivContainer = document.createElement("div");
  datumDivContainer.style.textAlign = "center";

  // Create the entry for the note
  const datumHeader = document.createElement("h2");
  datumHeader.textContent = noteWithFreq.name;
  datumDivContainer.appendChild(datumHeader);

  datumDivContainer.className = "notenamecontainer";
  datumDivContainer.style.touchAction = "none";
  datumDivContainer.style.userSelect = "none";

  // Add an arrow to control playback
  const rightArrow = document.createElement("span");
  const playButtonChar = "▶";

  rightArrow.textContent = playButtonChar;
  rightArrow.className = "naviarrow";

  rightArrow.style.color = "green";
  rightArrow.style.cursor = "pointer";
  rightArrow.style.fontSize = "1.33em";
  rightArrow.style.border = "2px dotted green";
  rightArrow.style.borderRadius = "5px";
  rightArrow.style.touchAction = "none";
  rightArrow.style.userSelect = "none";
  rightArrow.title = "Click for another example.";
  rightArrow.id = "clickablesamplenavigator";

  setPlatformDependentPlayListener(rightArrow, noteWithFreq.frequency);

  // Add a body div to contain all of our actual content
  const datumBody = document.createElement("div");
  // And then dump the body onto the div,
  datumDivContainer.appendChild(datumBody);

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
  letterBox.textContent = letterDatum.name;
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
  if (currentIndex === frequencies.length - 1) {
    currentSelection = 0;
  } else {
    currentSelection = currentIndex + 1;
  }
  stageLetterDatum(frequencies[currentSelection]);
};

const prevLetter = (currentIndex) => {
  // Stage the previous letter, based on global state.
  if (currentIndex === 0) {
    currentSelection = frequencies.length - 1;
  } else {
    currentSelection = currentIndex - 1;
  }
  stageLetterDatum(frequencies[currentSelection]);
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
  } else if (event_.key == "Enter" || event_.code == "Space") {
    // Press enter to cycle samples for the current letter.
    document.getElementById("clickablesamplenavigator").click();
  }
});

// Set the first letter to be the default selection,
stageLetterDatum(frequencies[currentSelection]);
// And make sure its letterbox is focused!
letterBoxRegistry[currentSelection].focus();
