import { playSound, shouldPlaySound, toggleSound } from "./cards/sound.js";
import {
  UUIDGeneratorBrowser,
  chooseRandomExcept,
  decimalToColor,
  getObjectFromLocalStorage,
  localStorageKeyExists,
  putObjectToLocalStorage,
  putValueToLocalStorage,
  randomInt,
  shuffleArray,
} from "./cards/utilities.js";
import { FORMAT_FLASHCARDS, FORMAT_QUIZ, FORMAT_T_OR_F, practiceMap } from "./flashcarddata.js";

import { dateAsObject, dateCookieStringFromDate, getYesterday } from "./cards/dateutils.js";

import { isDesktop, isMobile } from "./cards/os.js";

const DOWNLOAD_ICON_DEFAULT_FILTER = `grayscale(100%)`;
const LAST_VISIT_KEY = "lastVisit";
const STREAK_COUNT_KEY = "streak";
const STREAK_LAST_CHECK_KEY = "streakLastCheck";

const SCRIPT_BOTH = "scriptboth";
const SCRIPT_LATIN = "scriptlatin";
const SCRIPT_CYRILLIC = "scriptcyrillic";
const SCRIPT_MIX = "scriptmix";

// TODO this file could use some OOP.

// Some globally available stuff
export const streakDisplay = document.getElementById("streakdisplay");
export const flashCardStyleSheet = document.getElementById("flashcardstylesheet");

// Global for storing practice document state
const practiceState = new Array();

// Warning about cookies
const cookieWarningSetup = () => {
  const cookieBanner = document.getElementById("cookie-banner");
  const cookieCloseButton = document.getElementById("close");
  const cookieBailButton = document.getElementById("noway");
  if (localStorage.getItem("cookieSeenFlashCards") === "shown") {
    cookieBanner.style.display = "none";
  }

  cookieCloseButton.onclick = () => {
    cookieBanner.style.display = "none";
    localStorage.setItem("cookieSeenFlashCards", "shown");
  };

  cookieBailButton.onclick = () => {
    // Send 'em home
    location.href = "../index.html";
  };
};

const setSoundToggleSwitchMessage = () => {
  const soundToggleSwitch = document.getElementById("soundtoggle");
  const soundToggleSwitchMessage = document.getElementById("soundtogglestatusmessage");
  const shouldPlay = shouldPlaySound();
  soundToggleSwitchMessage.style = shouldPlay ? `color: green;` : `color: red;`;
  soundToggleSwitchMessage.textContent = shouldPlay ? `ON` : `OFF`;
};

const addSoundToggleClickListener = () => {
  const soundToggleSwitch = document.getElementById("soundtoggle");
  const soundToggleSwitchMessage = document.getElementById("soundtogglestatusmessage");
  soundToggleSwitch.addEventListener("click", () => {
    toggleSound();
    setSoundToggleSwitchMessage();
  });
};

const addClearStageClickListener = () => {
  // Button for clearing the working stage
  const clearStageButton = document.getElementById("clearstagebutton");
  clearStageButton.addEventListener("click", () => {
    clearStage(true);
  });
};

const addLoadStageClickListener = () => {
  // Button for filling the working stage
  const loadStageButton = document.getElementById("loadstagebutton");
  loadStageButton.addEventListener("click", () => {
    loadStage();
  });
};

const addPracticeOptionsDropdownChangeListener = () => {
  const practiceOptionsDropDown = document.getElementById("practiceoptionsdropdown");
  practiceOptionsDropDown.addEventListener("change", () => {
    const sectionObject = displayAvailablePracticeFormats();
    prepareSectionDownloadOptions(sectionObject);
  });
};

const getStreakForDisplay = () => {
  return getObjectFromLocalStorage(STREAK_COUNT_KEY) || 0;
};

const setStreakDisplay = (displayElement) => {
  const today = dateCookieStringFromDate(new Date());
  putObjectToLocalStorage(LAST_VISIT_KEY, today);
  if (streakIsOld()) {
    console.log("Streak is old: Sending user back to 0 streak");
    putObjectToLocalStorage(STREAK_COUNT_KEY, 0);
  }
  while (displayElement.firstChild) {
    displayElement.removeChild(displayElement.lastChild);
  }
  const streakText = document.createTextNode(`Your Streak: ${String(getStreakForDisplay())}`);
  displayElement.appendChild(streakText);
};

const streakIsOld = () => {
  const streakLastCheck = getObjectFromLocalStorage(STREAK_LAST_CHECK_KEY) || null;
  if (!streakLastCheck) {
    return false;
  }
  const dateToday = new Date();
  const [year, month, day] = streakLastCheck.split(".");

  const lastCheckAsDate = new Date(year, month - 1, day);
  const hoursSinceLastCheck = Math.abs((lastCheckAsDate - dateToday) / (1000 * 60 * 60));

  if (hoursSinceLastCheck > 48) {
    return true;
  }
  return false;
};

const handleStreak = () => {
  const dateToday = new Date();
  const today = dateCookieStringFromDate(dateToday);
  const streakCount = getObjectFromLocalStorage(STREAK_COUNT_KEY);
  let newStreak;
  // If they have no streak count, they've never been here --
  // set their streak count to 1 and set their last visit to today.
  if (streakCount === null) {
    newStreak = 1;
    putObjectToLocalStorage(STREAK_COUNT_KEY, newStreak);
    putObjectToLocalStorage(STREAK_LAST_CHECK_KEY, today);
    putObjectToLocalStorage(LAST_VISIT_KEY, today);
    return;
  }
  const lastVisit = getObjectFromLocalStorage(LAST_VISIT_KEY);
  const lastCheck = getObjectFromLocalStorage(STREAK_LAST_CHECK_KEY);
  const yesterdayDate = getYesterday(dateToday);
  const yesterday = dateCookieStringFromDate(getYesterday(dateToday));
  // If they last visited today, we don't need to update their streak.
  if (lastCheck === today) {
    console.log("Welcome back!<3");
    return;
  }
  console.log("Congrats, you showed up again!");
  putObjectToLocalStorage(STREAK_COUNT_KEY, streakCount + 1);
  putObjectToLocalStorage(STREAK_LAST_CHECK_KEY, today);
  putObjectToLocalStorage(LAST_VISIT_KEY, today);
};

// Function for clearing the working stage
const clearStage = (callerPlaySound) => {
  // Clear the practice state. This dumps everything from the
  // array while returning it as a copy.
  if (shouldPlaySound() && callerPlaySound) {
    playSound("whoosh", 0.3);
  }
  const stateCopy = practiceState.splice(0, practiceState.length);
  // Drop all of the elements from the DOM.
  stateCopy.forEach((element) => {
    element.remove();
  });
  const scoreBar = document.getElementById("scorebar");
  hideScoreBar(scoreBar);
};

const insertPracticeFormatForm = () => {};

let warningCount = 0;
const loadStage = () => {
  // Get the practice options dropdown,
  const practiceOptionsDropDown = document.getElementById("practiceoptionsdropdown");
  const choosePracticeWarning = document.getElementById("choosePracticeWarning");
  const selectedPractice = practiceOptionsDropDown.value;
  if (selectedPractice) {
    playSound("maraca", 0.3);

    choosePracticeWarning.hidden = true;
    // Make sure we have a clean slate to work with.
    clearStage(false);
    // NOTE: For now, we're only loading flashcards. In the future, there might be
    // other kinds of stuff to load.
    const practiceFormatOption = document.querySelector('input[name="practiceformatoptions"]:checked').value;

    if (practiceFormatOption === FORMAT_FLASHCARDS) {
      loadShuffledFlashCards(practiceMap[selectedPractice].vocabularyObjects);
    } else if (practiceFormatOption === FORMAT_QUIZ) {
      loadQuiz(practiceMap[selectedPractice].vocabularyObjects);
    } else if (practiceFormatOption === FORMAT_T_OR_F) {
      loadTrueOrFalse(practiceMap[selectedPractice].vocabularyObjects);
    }
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
    if (warningCount >= 100) {
      // I tried to have a volume > 1 but...
      playSound("fart", 1);
    }
  }
};

const downloadIconsInactive = () => {
  const csvDownloadIconImage = document.getElementById("csvdownloadicon");
  const jsonDownloadIconImage = document.getElementById("jsondownloadicon");
  // Checks whether the download icons are in an active state
  // or not by eyeballing their style. They come in pairs like
  // salt and pepper. We don't change one without the other.
  return [csvDownloadIconImage, jsonDownloadIconImage].every((icon) => {
    return icon.style.filter === DOWNLOAD_ICON_DEFAULT_FILTER;
  });
};

const toggleDownloadIconStyles = () => {
  const iconReadyCursor = `pointer`;
  const csvDownloadIconImage = document.getElementById("csvdownloadicon");
  const jsonDownloadIconImage = document.getElementById("jsondownloadicon");
  // Download icons active? Make them grayscale and unpointy.
  // Inactive? Make them colorful and pointy.
  [csvDownloadIconImage, jsonDownloadIconImage].forEach((icon) => {
    if (icon.style.filter === DOWNLOAD_ICON_DEFAULT_FILTER) {
      icon.style.filter = null;
      icon.style.cursor = iconReadyCursor;
    } else {
      icon.style.filter = DOWNLOAD_ICON_DEFAULT_FILTER;
      icon.style.cursor = null;
    }
  });
};

const prepareSectionDownloadOptions = (sectionObject) => {
  const downloadImagesDiv = document.getElementById("downloads");
  const csvDownloadIconImage = document.getElementById("csvdownloadicon");
  const jsonDownloadIconImage = document.getElementById("jsondownloadicon");
  // Remove the grayscale from the download icon images.
  // Prepare links for the images that are clickable that allow
  // the user to download the lesson in CSV and JSON formats.
  if (downloadIconsInactive()) {
    toggleDownloadIconStyles();
  }

  const csvLinkId = "csvdownloadlink";
  const jsonLinkId = "jsondownloadlink";

  // This is state handling. If we're clicking between lessons,
  // the download links will already exist. We need to find them
  // and clear them, then ready up the new links. Otherwise, we
  // just make fresh links.
  const latentCsvLink = document.getElementById(csvLinkId);
  if (latentCsvLink !== null) {
    // Do some DOM manip
    // <div><a><img/></a><div> -> <div><img/><a></a></div> -> <div><img/></div>
    downloadImagesDiv.appendChild(csvDownloadIconImage);
    downloadImagesDiv.removeChild(latentCsvLink);
  }
  const latentJSONLink = document.getElementById(jsonLinkId);
  if (latentJSONLink !== null) {
    downloadImagesDiv.appendChild(jsonDownloadIconImage);
    downloadImagesDiv.removeChild(latentJSONLink);
  }

  const csvLink = window.document.createElement("a");
  const jsonLink = window.document.createElement("a");

  csvLink.id = csvLinkId;
  jsonLink.id = jsonLinkId;
  // For a brief moment our image leaves the div.
  csvLink.appendChild(csvDownloadIconImage);
  jsonLink.appendChild(jsonDownloadIconImage);

  // We put our image back into the div as a child of the link here.
  downloadImagesDiv.appendChild(csvLink);
  downloadImagesDiv.appendChild(jsonLink);

  // Add the content as CSV to the href in a blobby link.
  csvLink.href = window.URL.createObjectURL(new Blob([sectionObject.asCSV], { type: "text/csv" }));
  // This lets us name the file.
  csvLink.download = `${sectionObject.unfriendlyName}.csv`;
  // Here we use application/octet-stream instead of application/json so that we force a download dialog
  jsonLink.href = window.URL.createObjectURL(new Blob([sectionObject.asJSON], { type: "application/octet-stream" }));
  jsonLink.download = `${sectionObject.unfriendlyName}.json`;
};

const displayAvailablePracticeFormats = () => {
  const practiceOptionsDropDown = document.getElementById("practiceoptionsdropdown");
  const practiceFormatsContainer = document.getElementById("practiceformatscontainer");
  // First, make sure we have a clean state by deleting any extant form
  while (practiceFormatsContainer.firstChild) {
    practiceFormatsContainer.removeChild(practiceFormatsContainer.lastChild);
  }
  // Load the available practice formats for our selected practice
  const selectedPractice = practiceOptionsDropDown.value;
  const sectionObject = practiceMap[selectedPractice];
  // Create a new form in which we'll contain these formats.
  const practiceFormatsRadioForm = document.createElement("form");
  practiceFormatsRadioForm.className = "practiceformatsradioform";
  // For each of our available formats...
  sectionObject.formats.forEach((format) => {
    // Create a new input.
    const formatRadioInput = document.createElement("input");
    formatRadioInput.className = "practiceformatoptions";
    formatRadioInput.name = "practiceformatoptions";
    // It needs to be a radio button whose value is the
    // format we're looking at right now.
    formatRadioInput.type = "radio";
    formatRadioInput.value = format;
    formatRadioInput.id = format;
    // By default, check the first radio button.
    if (sectionObject.formats.indexOf(format) === 0) {
      formatRadioInput.checked = true;
    }
    // To give a radio button text, we need to give it a label
    const formatRadioInputLabel = document.createElement("label");
    formatRadioInputLabel.className = "practiceformatoptionslabel";
    formatRadioInputLabel.for = format;
    // Adding text to the label requires us to create a text node
    const formatRadioInputLabelText = document.createTextNode(format);
    formatRadioInputLabel.appendChild(formatRadioInputLabelText);
    // Finally, add the radio button to the form,
    practiceFormatsRadioForm.appendChild(formatRadioInput);
    // add the label text to the label itself,
    formatRadioInput.appendChild(formatRadioInputLabel);
    // and add the label to the form.
    practiceFormatsRadioForm.appendChild(formatRadioInputLabel);
  });
  // Put the completed form into its container,
  practiceFormatsContainer.appendChild(practiceFormatsRadioForm);
  // and make the container visible.
  practiceFormatsContainer.hidden = false;
  return sectionObject;
};

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

    // NOTE: This is all gnarly inefficient, but I'm wasted. So.
    const textContentArray = new Array();
    const textBlock = faceType === "front" ? front : back;
    if (textBlock.match("\n")) {
      textBlock.split("\n").forEach((line) => {
        textContentArray.push(line);
      });
    } else {
      textContentArray.push(textBlock);
    }
    if (textBlock.match("\n")) {
      textContentArray.forEach((textContentItem) => {
        const textContent = document.createTextNode(textContentItem);
        const lineBreak = document.createElement("br");
        // and add our newly created elements to the card
        const mobile = isMobile();
        // NOTE: What's the better pattern for this...?
        cardFace.style.lineHeight = mobile ? "5em" : "75px";
        cardFace.appendChild(textContent);
        cardFace.appendChild(lineBreak);
      });
    } else {
      textContentArray.forEach((textContentItem) => {
        const textContent = document.createTextNode(textContentItem);
        // If the text is long, shrink it
        // TODO: We're hardcoding styles here. I don't know what best
        // practices are, or what to do about it, and I'm not happy
        // about it. I think I could make this dynamic somehow, but I
        // am not sure how to read styles. Let's look into this later.
        if (textContentItem.length >= 12) {
          const cardFaceMaxFontSize = isMobile() ? 40 : 20;
          cardFace.style.fontSize = `${cardFaceMaxFontSize - (textContentItem.length - 12)}px`;
        }
        cardFace.appendChild(textContent);
      });
    }
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
    if (shouldPlaySound()) {
      playSound("tap", 0.25);
    }
  });
};

// Loads an array of vocabularyObjects as flashcards onto the document
const loadShuffledFlashCards = (vocabularyObjects) => {
  const scoreBar = document.getElementById("scorebar");
  if (scoreBarHidden(scoreBar) === false) {
    toggleScoreBar(scoreBar);
  }
  const vocabCopy = [...vocabularyObjects];
  const flashCardContainer = document.getElementById("flashcardcontainer");
  const cardCountPerRow = isMobile() ? 2 : 4;
  const rowHeight = isMobile() ? "40vw" : "200px";
  flashCardContainer.style.gridTemplateColumns = `repeat(${cardCountPerRow}, ${rowHeight})`;

  const scriptOption = document.querySelector('input[name="scriptoptions"]:checked').value;

  shuffleArray(vocabCopy);
  vocabCopy.forEach((vocabularyObject) => {
    // Let's flip some coins, shall we?
    let front;
    let rear;
    if (scriptOption === SCRIPT_MIX) {
      // TODO: Constants
      // We want a mix of cyrillic and latin
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
    } else if (scriptOption === SCRIPT_BOTH) {
      if (randomInt(0, 100) > 50) {
        front = vocabularyObject.english;
        rear = `${vocabularyObject.latin}\n${vocabularyObject.cyrillic}`;
      } else {
        front = `${vocabularyObject.latin}\n${vocabularyObject.cyrillic}`;
        rear = vocabularyObject.english;
      }
    } else if (scriptOption === SCRIPT_LATIN) {
      if (randomInt(0, 100) > 50) {
        front = vocabularyObject.latin;
        rear = vocabularyObject.english;
      } else {
        rear = vocabularyObject.latin;
        front = vocabularyObject.english;
      }
    } else if (scriptOption === SCRIPT_CYRILLIC) {
      if (randomInt(0, 100) > 50) {
        front = vocabularyObject.cyrillic;
        rear = vocabularyObject.english;
      } else {
        rear = vocabularyObject.cyrillic;
        front = vocabularyObject.english;
      }
    }

    addFlashcard(front, rear);
  });
  const endnl = document.createElement("br");
  const topLink = document.createElement("a");
  const topLinkText = document.createTextNode("Back to Top");
  topLink.href = "#";
  topLink.appendChild(topLinkText);
  const topLinkContainer = document.createElement("div");
  topLinkContainer.style.textAlign = "center";
  topLinkContainer.appendChild(topLink);
  flashCardContainer.parentNode.insertBefore(endnl, flashCardContainer.nextElementSibling);
  flashCardContainer.parentNode.insertBefore(topLinkContainer, flashCardContainer.nextElementSibling);

  practiceState.push(endnl);
  practiceState.push(topLinkContainer);
};

const handleScoringInteraction = (quizOption, scoreBar) => {
  // Only colorize list items.
  if (quizOption.tagName.toLowerCase() === "li") {
    // For whatever reason, chrome isn't very happy about using
    // contains on classList, nor includes. Spread it to find out.

    const hasBeenAnswered = Object.values(quizOption.parentNode.attributes).some(
      (attr) => attr.name === "answeredcorrectly"
    );

    if ([...quizOption.classList].includes("correctanswer")) {
      quizOption.style.backgroundColor = "green";
      if (!hasBeenAnswered) {
        quizOption.parentNode.setAttribute("answeredcorrectly", true);
        incrementScoreBarScore(scoreBar, 1);
        if (shouldPlaySound()) {
          playSound("pageFlip");
        }
      }
    } else {
      quizOption.style.backgroundColor = "red";
      if (!hasBeenAnswered) {
        quizOption.parentNode.setAttribute("answeredcorrectly", false);
        if (shouldPlaySound()) {
          playSound("fart");
        }
      }
    }
  }
};

const scoreBarHidden = (scoreBar) => {
  return scoreBar.hidden === true;
};

const hideScoreBar = (scoreBar) => {
  scoreBar.hidden = true;
};

const toggleScoreBar = (scoreBar) => {
  if (scoreBar.hidden) {
    scoreBar.hidden = false;
  } else {
    scoreBar.hidden = true;
  }
};

const setScoreBarScore = (scoreBar, score, maxScore) => {
  if (scoreBar.firstChild) {
    scoreBar.removeChild(scoreBar.firstChild);
  }
  let barText = document.createTextNode(`${score} / ${maxScore}`);
  scoreBar.appendChild(barText);
  scoreBar.style.color = decimalToColor(score / maxScore);
  scoreBar.setAttribute("score", String(score));
  scoreBar.setAttribute("maxscore", String(maxScore));
};

const getScoreBarScore = (scoreBar) => {
  return Number(scoreBar.getAttribute("score"));
};

const getScoreBarMax = (scoreBar) => {
  return Number(scoreBar.getAttribute("maxscore"));
};

const incrementScoreBarScore = (scoreBar, amount) => {
  const currentScore = getScoreBarScore(scoreBar);
  const scoreMax = getScoreBarMax(scoreBar);
  setScoreBarScore(scoreBar, currentScore + amount, scoreMax);
};

const checkQuizComplete = (event) => {
  let complete = true;
  [...document.getElementsByClassName("quizcontainer")].forEach((q) => {
    if (!q.hasAttribute("answeredcorrectly")) {
      complete = false;
    }
  });
  if (complete) {
    handleStreak();
    setStreakDisplay(streakDisplay);
  } else {
    return;
  }
};

const loadTrueOrFalse = (vocabularyObjects) => {
  const scoreBar = document.getElementById("scorebar");
  if (scoreBarHidden(scoreBar) === true) {
    toggleScoreBar(scoreBar);
  }
  const scoreMax = vocabularyObjects.length;
  const trueOrFalseHeader = "True or False:";
  setScoreBarScore(scoreBar, 0, scoreMax);
  const scriptOption = document.querySelector('input[name="scriptoptions"]:checked').value;
  const quizBox = document.getElementById("flashcardcontainer");
  const vocabCopy = [...vocabularyObjects];
  shuffleArray(vocabCopy);

  // add a newline before we begin.
  const startnl = document.createElement("br");
  quizBox.appendChild(startnl);
  practiceState.push(startnl);

  // Generate pairs of vocabulary objects. "Source" is the object we're comparing to,
  // "Destination" is the object we're comparing against.
  // T/F: Makaze means Scissors ?
  //      ^ Source     ^ Destination
  // Each object should be represented.
  let sourceEnglish;
  vocabCopy.forEach((vocabularyObject) => {
    // Decide if it should be true or false. Do a coin flip.
    let pair;
    if (randomInt(0, 100) > 50) {
      // When it's true, source and dest are same, and set value true
      pair = {
        sourceObject: vocabularyObject,
        destinationObject: vocabularyObject,
        value: true,
      };
    } else {
      const falseObject = chooseRandomExcept(vocabularyObjects, [vocabularyObject]);
      pair = {
        sourceObject: vocabularyObject,
        destinationObject: falseObject,
        value: false,
      };
    }
    // Flip a coin to see if the left side is english or not.
    sourceEnglish = randomInt(0, 100) > 50 ? true : false;
    const jugoObject = sourceEnglish ? pair.destinationObject : pair.sourceObject;
    const englishSide = sourceEnglish ? pair.sourceObject.english : pair.destinationObject.english;
    let jugoSide;
    if (scriptOption === SCRIPT_BOTH) {
      const conjunction = sourceEnglish ? "or" : "and";
      jugoSide = `${jugoObject.cyrillic} ${conjunction} ${jugoObject.latin}`;
    } else if (scriptOption === SCRIPT_LATIN) {
      jugoSide = jugoObject.latin;
    } else if (scriptOption === SCRIPT_CYRILLIC) {
      jugoSide = jugoObject.cyrillic;
    } else if (scriptOption === SCRIPT_MIX) {
      jugoSide = randomInt(0, 100) > 50 ? jugoObject.cyrillic : jugoObject.latin;
    }
    const questionTable = document.createElement("table");
    questionTable.className = "truthtable";

    const questionTableHeaderRow = document.createElement("tr");

    // Add a header for our question table
    const questionTableHeader = document.createElement("th");
    questionTableHeader.className = "truthtable-question-header";
    questionTableHeader.colSpan = "3";
    questionTableHeader.textContent = trueOrFalseHeader;
    // Add the header itself to the header row,
    questionTableHeaderRow.appendChild(questionTableHeader);
    // then add the header row to the table
    questionTable.appendChild(questionTableHeaderRow);

    // Add a row to contain our question
    const questionTableQuestionRow = document.createElement("tr");
    const questionTableQuestionLeft = document.createElement("td");
    questionTableQuestionLeft.className = "truthtable-question-left";
    // If our source is english, then the left hand side should be in english.
    questionTableQuestionLeft.textContent = sourceEnglish ? englishSide : jugoSide;

    // The center cell should contain some conjunction or whatever that helps
    // create a sentence out of the "true or false" statement.
    // If the left is english, we should say "translates to"; if the right is english,
    // we should use "mean" or "means"
    const questionTableQuestionCenter = document.createElement("td");
    questionTableQuestionCenter.className = "truthtable-question-center";
    questionTableQuestionCenter.textContent = sourceEnglish
      ? "... translates to ..."
      : // Careful logic -- only use singular "mean" if the left-hand side is both
      // the cyrillic and latin versions of a jugo word together
      scriptOption === SCRIPT_BOTH && !sourceEnglish
      ? "... mean ..."
      : "... means ...";

    // Finally, the rightmost cell in this row should contain the opposite language
    // of the leftmost cell.
    const questionTableQuestionRight = document.createElement("td");
    questionTableQuestionRight.className = "truthtable-question-right";
    questionTableQuestionRight.textContent = sourceEnglish ? jugoSide : englishSide;

    // Add all three of our cells to the question row,
    questionTableQuestionRow.appendChild(questionTableQuestionLeft);
    questionTableQuestionRow.appendChild(questionTableQuestionCenter);
    questionTableQuestionRow.appendChild(questionTableQuestionRight);
    // and add the question row to the table
    questionTable.appendChild(questionTableQuestionRow);

    const lineBreak = document.createElement("br");
    // Add the question table to the box and add a line break.
    quizBox.appendChild(questionTable);
    practiceState.push(questionTable);
    quizBox.appendChild(lineBreak);
    practiceState.push(lineBreak);
  });
};

// Loads a gang of vocabulary objects as a quiz.
const loadQuiz = (vocabularyObjects) => {
  const scoreBar = document.getElementById("scorebar");
  if (scoreBarHidden(scoreBar) === true) {
    toggleScoreBar(scoreBar);
  }
  const scoreMax = vocabularyObjects.length;
  setScoreBarScore(scoreBar, 0, scoreMax);
  const vocabCopy = [...vocabularyObjects];

  const scriptOption = document.querySelector('input[name="scriptoptions"]:checked').value;

  shuffleArray(vocabCopy);
  const quizBox = document.getElementById("flashcardcontainer");
  const startnl = document.createElement("br");
  quizBox.appendChild(startnl);
  practiceState.push(startnl);
  let isEnglish;
  quizBox.style.gridTemplateColumns = "1fr";
  let questionNumber = 0;
  vocabCopy.forEach((vocabularyObject) => {
    questionNumber += 1;
    // Add a header for each of the quiz questions
    let headerScript;
    // Flip a coin to decide whether our header is english or Jugoslav
    if (randomInt(0, 100) > 50) {
      isEnglish = true;
      headerScript = `"${vocabularyObject.english}" translates to...`;
    } else {
      isEnglish = false;
      if (scriptOption === SCRIPT_BOTH) {
        headerScript = `"${vocabularyObject.latin}" and "${vocabularyObject.cyrillic}" mean...`;
      } else if (scriptOption === SCRIPT_LATIN) {
        headerScript = `"${vocabularyObject.latin}" means...`;
      } else if (scriptOption === SCRIPT_CYRILLIC) {
        headerScript = `"${vocabularyObject.cyrillic}" means...`;
      } else if (scriptOption === SCRIPT_MIX) {
        // Roll a coin to see if we'll have latin or cyrillic
        if (randomInt(0, 100) > 50) {
          headerScript = `"${vocabularyObject.cyrillic}" means...`;
        } else {
          headerScript = `"${vocabularyObject.latin}" means...`;
        }
      }
    }
    const quizQuestionHeader = document.createElement("div");
    quizQuestionHeader.className = "quizquestionheader";
    const quizQuestionText = document.createTextNode(`${questionNumber}. ${headerScript}`);
    quizQuestionHeader.appendChild(quizQuestionText);
    quizBox.appendChild(quizQuestionHeader);
    practiceState.push(quizQuestionHeader);
    // Create the unordered list that will represent the options for this quiz question
    const quizOptionsContainer = document.createElement("ul");
    quizOptionsContainer.style.placeSelf = "center";
    // Add a listener for this quiz question to colorize its babies on click!
    quizOptionsContainer.addEventListener("click", (event) => {
      handleScoringInteraction(event.target, scoreBar);
    });
    // Name it correctly so that it picks up our style.
    quizOptionsContainer.className = "quizcontainer";
    // We're dong multiple choice. We need to choose random other options
    // from the incoming list of vocabulary options, without ever choosing
    // the word we're currently looking at, or choosing the same thing twice.
    const optionTwo = chooseRandomExcept(vocabCopy, [vocabularyObject]);
    const optionThree = chooseRandomExcept(vocabCopy, [vocabularyObject, optionTwo]);
    const optionFour = chooseRandomExcept(vocabCopy, [vocabularyObject, optionTwo, optionThree]);
    const quizOptions = shuffleArray([vocabularyObject, optionTwo, optionThree, optionFour]);

    quizOptions.forEach((quizOption) => {
      const optionElement = document.createElement("li");
      optionElement.className = "quizoption";
      // Yes, you can inspect element to cheat. But who would do that?
      // Go on the internet, and tell lies?
      if (quizOption === vocabularyObject) {
        optionElement.classList.toggle("correctanswer");
      }
      let optionText;
      if (isEnglish) {
        if (scriptOption === SCRIPT_BOTH) {
          optionText = `"${quizOption.latin}", or "${quizOption.cyrillic}"`;
        } else if (scriptOption === SCRIPT_LATIN) {
          optionText = quizOption.latin;
        } else if (scriptOption === SCRIPT_CYRILLIC) {
          optionText = quizOption.cyrillic;
        } else if (scriptOption === SCRIPT_MIX) {
          // Roll a coin to see if we'll have latin or cyrillic
          if (randomInt(0, 100) > 50) {
            optionText = quizOption.cyrillic;
          } else {
            optionText = quizOption.latin;
          }
        }
      } else {
        optionText = quizOption.english;
      }
      const optionTextNode = document.createTextNode(optionText);
      optionElement.appendChild(optionTextNode);
      quizOptionsContainer.appendChild(optionElement);
    });
    quizBox.appendChild(quizOptionsContainer);
    const endnl = document.createElement("br");
    quizBox.appendChild(endnl);
    practiceState.push(quizOptionsContainer);
    practiceState.push(endnl);
  });
  // NOTE: Since you wrote this while you were drunk, you induced bad state,
  // because the link is in the quiz box. Luckily it'll never actually cause
  // a quiz completion, but it's still shitty code.
  const topLink = document.createElement("a");
  const topLinkText = document.createTextNode("Back to Top");
  topLink.href = "#";
  topLink.style.placeSelf = "center";
  topLink.appendChild(topLinkText);
  quizBox.appendChild(topLink);
  practiceState.push(topLink);
  quizBox.addEventListener("click", (event) => checkQuizComplete(event));
};

const showDebugMessage = (message) => {
  const debugMessage = document.getElementById("debugmessage");
  const debugText = document.createTextNode(message);
  debugMessage.appendChild(debugText);
  debugMessage.hidden = false;
};

// TODO something about constants?
const setPlatformStyle = () => {
  if (isMobile()) {
    flashCardStyleSheet.href = "flashcardsmobile.css";
  } else if (isDesktop()) {
    flashCardStyleSheet.href = "flashcards.css";
  }
};

const main = () => {
  setPlatformStyle();
  fillPracticeOptionsDropdown(Object.values(practiceMap));
  setStreakDisplay(streakDisplay);
  // Check cookies for whether or not we've...
  // warned about cookies lol. Display banner if not.
  cookieWarningSetup();
  // Add event listener to the sound toggle button
  // and then make sure that it reflects our cookie
  // for sound use accurately
  addSoundToggleClickListener();
  setSoundToggleSwitchMessage();

  addClearStageClickListener();
  addLoadStageClickListener();

  addPracticeOptionsDropdownChangeListener();
};

(() => {
  main();
})();
