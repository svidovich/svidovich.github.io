import { FORMAT_FLASHCARDS, FORMAT_QUIZ } from "./flashcarddata.js";
import { practiceMap } from "./flashcarddata.js";

const PLATFORMS = Object.freeze({
  MACOS: "macos",
  IOS: "ios",
  WINDOWS: "windows",
  ANDROID: "android",
  LINUX: "linux",
  UNKNOWN: "unknown",
});
// Stolen OS Detector. See:
// https://stackoverflow.com/questions/38241480/detect-macos-ios-windows-android-and-linux-os-with-js
const getOS = () => {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
  const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
  const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
  const iosPlatforms = ["iPhone", "iPad", "iPod"];

  if (macosPlatforms.indexOf(platform) !== -1) {
    return PLATFORMS.MACOS;
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    return PLATFORMS.IOS;
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    return PLATFORMS.WINDOWS;
  } else if (/Android/.test(userAgent)) {
    return PLATFORMS.ANDROID;
  } else if (/Linux/.test(platform)) {
    return PLATFORMS.LINUX;
  }
  return PLATFORMS.UNKNOWN;
};

// Global for storing practice document state
const practiceState = new Array();

// Some globally available stuff
const streakDisplay = document.getElementById("streakdisplay");

// Warning about cookies
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

const getObjectFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const putObjectToLocalStorage = (key, object) => {
  localStorage.setItem(key, JSON.stringify(object));
};

const STREAK_COUNT_KEY = "streak";
const STREAK_LAST_CHECK_KEY = "streakLastCheck";
const LAST_VISIT_KEY = "lastVisit";

// For a number on [0, 1], return a score-y color.
const decimalToColor = (number) => {
  if (number <= 0.25) {
    return "red";
  } else if (number > 0.25 && number <= 0.5) {
    return "yellow";
  } else if (number > 0.5 && number <= 0.75) {
    return "green";
  } else if (number > 0.75 && number <= 1.0) {
    return "blue";
  } else {
    return "white";
  }
};

const getYesterday = (date) => {
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - 1);
  return previous;
};

const dateAsObject = (date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

const getStreakForDisplay = () => {
  return getObjectFromLocalStorage(STREAK_COUNT_KEY) || 0;
};

const setStreakDisplay = (displayElement) => {
  while (displayElement.firstChild) {
    displayElement.removeChild(displayElement.lastChild);
  }
  const streakText = document.createTextNode(`Your Streak: ${String(getStreakForDisplay())}`);
  displayElement.appendChild(streakText);
};

const handleStreak = () => {
  const dateToday = new Date();
  const { year, month, day } = dateAsObject(dateToday);
  const today = `${year}.${month}.${day}`;
  const streakCount = getObjectFromLocalStorage(STREAK_COUNT_KEY);
  let newStreak;
  // If they have no streak count, they've never been here --
  // set their streak count to 0 and set their last visit to today.
  if (streakCount === null) {
    newStreak = 0;
    putObjectToLocalStorage(STREAK_COUNT_KEY, newStreak);
    putObjectToLocalStorage(STREAK_LAST_CHECK_KEY, today);
    putObjectToLocalStorage(LAST_VISIT_KEY, today);
    return;
  }

  const lastVisit = getObjectFromLocalStorage(LAST_VISIT_KEY);
  const lastCheck = getObjectFromLocalStorage(STREAK_LAST_CHECK_KEY);
  const yesterdayDate = getYesterday(dateToday);

  const { year: yesterdayYear, month: yesterdayMonth, day: yesterdayDay } = dateAsObject(yesterdayDate);
  const yesterday = `${yesterdayYear}.${yesterdayMonth}.${yesterdayDay}`;
  // If they last visited today, we don't need to update their streak.

  if (lastVisit === today || lastCheck === today) {
    console.log("Welcome back!<3");
    return;
  } else if (lastVisit === yesterday && lastCheck === yesterday) {
    // If they last visited yesterday, good job! Let's update them.
    console.log("Congrats, you showed up again!");
    putObjectToLocalStorage(STREAK_COUNT_KEY, streakCount + 1);
    putObjectToLocalStorage(STREAK_LAST_CHECK_KEY, today);
    putObjectToLocalStorage(LAST_VISIT_KEY, today);
  } else {
    // Oops! You suck! Back to zero, zero!
    console.log("Sending user back to 0 streak");
    putObjectToLocalStorage(STREAK_COUNT_KEY, 0);
    putObjectToLocalStorage(STREAK_LAST_CHECK_KEY, today);
    putObjectToLocalStorage(LAST_VISIT_KEY, today);
  }
};

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

const insertPracticeFormatForm = () => {};

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
    const practiceFormatOption = document.querySelector('input[name="practiceformatoptions"]:checked').value;

    if (practiceFormatOption === FORMAT_FLASHCARDS) {
      loadShuffledFlashCards(practiceMap[selectedPractice].vocabularyObjects);
    } else if (practiceFormatOption === FORMAT_QUIZ) {
      loadQuiz(practiceMap[selectedPractice].vocabularyObjects);
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
  }
};

const practiceOptionsDropDown = document.getElementById("practiceoptionsdropdown");
practiceOptionsDropDown.addEventListener("change", () => {
  displayAvailablePracticeFormats();
});

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
    formatRadioInputLabel.for = format;
    // Adding text to the label requires us to create a text node
    const formatRadioInputLabelText = document.createTextNode(format);
    formatRadioInputLabel.appendChild(formatRadioInputLabelText);
    // The incoming formats are ugly: use CSS to make them beautiful
    formatRadioInputLabel.style.textTransform = "capitalize";
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
        cardFace.style.textSize = "10px";
        cardFace.style.lineHeight = "75px";
        cardFace.appendChild(textContent);
        cardFace.appendChild(lineBreak);
      });
    } else {
      textContentArray.forEach((textContentItem) => {
        const textContent = document.createTextNode(textContentItem);
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
  flashCardContainer.style.gridTemplateColumns = "repeat(4, 200px)";

  const scriptOption = document.querySelector('input[name="scriptoptions"]:checked').value;

  shuffle(vocabCopy);
  vocabCopy.forEach((vocabularyObject) => {
    // Let's flip some coins, shall we?
    let front;
    let rear;
    if (scriptOption === "scriptmix") {
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
    } else if (scriptOption === "scriptboth") {
      if (randomInt(0, 100) > 50) {
        front = vocabularyObject.english;
        rear = `${vocabularyObject.latin}\n${vocabularyObject.cyrillic}`;
      } else {
        front = `${vocabularyObject.latin}\n${vocabularyObject.cyrillic}`;
        rear = vocabularyObject.english;
      }
    } else if (scriptOption === "scriptlatin") {
      if (randomInt(0, 100) > 50) {
        front = vocabularyObject.latin;
        rear = vocabularyObject.english;
      } else {
        rear = vocabularyObject.latin;
        front = vocabularyObject.english;
      }
    } else if (scriptOption === "scriptcyrillic") {
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

// Given an array and an object known to be in it,
// choose a random item from the iterable that isn't
// the object we chose.
const chooseRandomExcept = (arr, exceptions) => {
  const exceptionIndices = new Array();
  exceptions.map((exception) => {
    exceptionIndices.push(arr.indexOf(exception));
  });
  while (true) {
    const randomIndex = randomInt(0, arr.length - 1);
    if (!exceptionIndices.includes(randomIndex)) {
      return arr[randomIndex];
    }
  }
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
      }
    } else {
      quizOption.style.backgroundColor = "red";
      if (!hasBeenAnswered) {
        quizOption.parentNode.setAttribute("answeredcorrectly", false);
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

  shuffle(vocabCopy);
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
      if (scriptOption === "scriptboth") {
        headerScript = `"${vocabularyObject.latin}" and "${vocabularyObject.cyrillic}" mean...`;
      } else if (scriptOption === "scriptlatin") {
        headerScript = `"${vocabularyObject.latin}" means...`;
      } else if (scriptOption === "scriptcyrillic") {
        headerScript = `"${vocabularyObject.cyrillic}" means...`;
      } else if (scriptOption === "scriptmix") {
        // Roll a coin to see if we'll have latin or cyrillic
        if (randomInt(0, 100) > 50) {
          headerScript = `"${vocabularyObject.cyrillic}" means...`;
        } else {
          headerScript = `"${vocabularyObject.latin}" means...`;
        }
      }
    }
    const quizQuestionHeader = document.createElement("h3");
    quizQuestionHeader.style.placeSelf = "center";
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
    const quizOptions = shuffle([vocabularyObject, optionTwo, optionThree, optionFour]);

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
        if (scriptOption === "scriptboth") {
          optionText = `"${quizOption.latin}", or "${quizOption.cyrillic}"`;
        } else if (scriptOption === "scriptlatin") {
          optionText = quizOption.latin;
        } else if (scriptOption === "scriptcyrillic") {
          optionText = quizOption.cyrillic;
        } else if (scriptOption === "scriptmix") {
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
  const topLink = document.createElement("a");
  const topLinkText = document.createTextNode("Back to Top");
  topLink.href = "#";
  topLink.style.placeSelf = "center";
  topLink.appendChild(topLinkText);
  quizBox.appendChild(topLink);
  practiceState.push(topLink);
  quizBox.addEventListener("click", (event) => checkQuizComplete(event));
};

const main = () => {
  fillPracticeOptionsDropdown(Object.values(practiceMap));
  setStreakDisplay(streakDisplay);
};

(() => {
  main();
  const debugMessage = document.getElementById("debugmessage");
  const debugText = document.createTextNode(`os: ${getOS()} raw platform: ${navigator.platform}`);
  debugMessage.appendChild(debugText);

  debugMessage.hidden = false;
})();
