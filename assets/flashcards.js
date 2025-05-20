import { dateCookieStringFromDate } from "./cards/dateutils.js";
import { playSound, shouldPlaySound, toggleSound } from "./cards/sound.js";
import {
  UUIDGeneratorBrowser,
  camelize,
  chooseRandomExcept,
  decimalToColor,
  getObjectFromLocalStorage,
  putObjectToLocalStorage,
  randomInt,
  shuffleArray,
} from "./cards/utilities.js";

import {
  FORMAT_FLASHCARDS,
  FORMAT_QUIZ,
  FORMAT_T_OR_F,
  VocabularyObject,
  vocabularySectionFromArray,
} from "./cards/vocabulary.js";
import { practiceMap } from "./flashcarddata.js";

import { isDesktop, isMobile } from "./cards/os.js";

import { Cycle } from "./cards/cycle.js";

const CUSTOM_PRACTICE_STORAGE_KEY = "customPractices";

const LAST_VISIT_KEY = "lastVisit";
const STREAK_COUNT_KEY = "streak";
const STREAK_LAST_CHECK_KEY = "streakLastCheck";

const SCRIPT_BOTH = "scriptboth";
const SCRIPT_LATIN = "scriptlatin";
const SCRIPT_CYRILLIC = "scriptcyrillic";
const SCRIPT_MIX = "scriptmix";

// This might get heavier
const CHOICE_MIXED = "mixed";
const CHOICE_ENG_2_JUG = "eng2jug";
const CHOICE_JUG_2_ENG = "jug2eng";
const LANG_CHOICE_CYCLE = new Cycle([
  {
    imgSrc: "../media/mixengjug.png",
    languageChoice: CHOICE_MIXED,
    choiceTitle: "Mixed English & BCMS",
  },
  {
    imgSrc: "../media/eng2jug.png",
    languageChoice: CHOICE_ENG_2_JUG,
    choiceTitle: "English to BCMS",
  },
  {
    imgSrc: "../media/jug2eng.png",
    languageChoice: CHOICE_JUG_2_ENG,
    choiceTitle: "BCMS to English",
  },
]);

const getLanguageChoice = () => {
  return LANG_CHOICE_CYCLE.peek().languageChoice;
};

// TODO this file could use some OOP.

// Some globally available stuff
export const streakDisplay = document.getElementById("streakdisplay");
export const flashCardStyleSheet = document.getElementById(
  "flashcardstylesheet"
);

// Global for storing practice document state
const practiceState = new Array();

const loadPracticeMapWithCustomEntries = () => {
  const customPracticesMapped = new Object();
  const customPractices = getCustomPracticesFromStorage();
  customPractices.forEach((practice) => {
    customPracticesMapped[practice.unfriendlyName] = practice;
  });
  return {
    ...practiceMap,
    ...customPracticesMapped,
  };
};

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
  // We have a toggle switch that allows us to turn sound
  // on and off. This function sets its message based on
  // the current state.
  const soundToggleSwitchMessage = document.getElementById(
    "soundtogglestatusmessage"
  );
  const shouldPlay = shouldPlaySound();
  soundToggleSwitchMessage.style = shouldPlay ? `color: lime;` : `color: red;`;
  soundToggleSwitchMessage.textContent = shouldPlay ? `ON` : `OFF`;
};

const addSoundToggleClickListener = () => {
  const soundToggleSwitch = document.getElementById("soundtoggle");
  soundToggleSwitch.addEventListener("click", () => {
    toggleSound();
    setSoundToggleSwitchMessage();
  });
};

const handleNewCustomLessonSave = (dialog) => {
  // When we press save, we should get all of the necessary data from
  // the dialog to save a custom practice.
  const customPracticeNameElement = document.getElementById(
    "newcustomexercisename"
  );
  const customPracticeName = customPracticeNameElement.value;
  // If they haven't named it, we should bail
  if (customPracticeName === "") {
    alert("Don't forget to name your practice!");
    return;
  }
  const practiceObjects = new Array();
  const englishInputs = Array.from(
    document.getElementsByClassName("newcustomexerciseinputenglish")
  );
  englishInputs.forEach((input) => {
    const englishInputValue = input.value;
    // If we hit an empty entry, skip it. Otherwise...
    if (englishInputValue !== "") {
      // Grab the UUID for the english bit,
      const englishInputUUID = input.getAttribute("uuid");
      // and try to find a matching latin bit.
      const latinInputForUUID = document.getElementById(
        `newcustomexerciseinputlatin-${englishInputUUID}`
      );
      const latinInputValue = latinInputForUUID.value;
      // If there's a matching latin bit, go ahead and push it to the array
      // we prepared ahead of time. If it's empty, we shouldn't push it, we
      // should skip to the next entry.
      if (latinInputValue !== "") {
        practiceObjects.push(
          new VocabularyObject(englishInputValue, latinInputValue).asObject
        );
      }
    }
  });
  // If we wound up with an empty array, we'll erase. This could be because
  // we didn't complete the English or Latin sides.
  if (practiceObjects.length === 0) {
    alert("You need to add some entries to your custom practice!");
    return;
  }

  const serializedCustomPractice = {
    friendlyName: customPracticeName,
    unfriendlyName: camelize(customPracticeName),
    vocabularyObjects: practiceObjects,
  };

  let practicesToStore;
  const allCustomPractices = getObjectFromLocalStorage(
    CUSTOM_PRACTICE_STORAGE_KEY
  );
  if (!allCustomPractices) {
    practicesToStore = [serializedCustomPractice];
  } else {
    allCustomPractices.push(serializedCustomPractice);
    practicesToStore = allCustomPractices;
  }
  putObjectToLocalStorage(CUSTOM_PRACTICE_STORAGE_KEY, practicesToStore);
  // This lets us read our own writes so we don't have to refresh
  // to see the new section in the drop-down
  clearPracticeOptionsDropwdown();
  loadAllPracticesToDropDown();
  dialog.close();
};

const getCustomPracticesFromStorage = () => {
  // Retrieve the practices from local storage, loading them as an array
  // of VocabularySection objects.
  const practicesLoaded = getObjectFromLocalStorage(
    CUSTOM_PRACTICE_STORAGE_KEY
  );
  if (!practicesLoaded) {
    return [];
  }
  const sectionObjects = new Array();
  practicesLoaded.forEach((practiceJSON) => {
    sectionObjects.push(
      vocabularySectionFromArray(
        practiceJSON.friendlyName,
        practiceJSON.unfriendlyName,
        practiceJSON.vocabularyObjects
      )
    );
  });
  return sectionObjects;
};

const clearLanguageEntryFieldsFromDialog = () => {
  const rows = document.getElementsByClassName("newcustomexercisefieldrow");
  Array.from(rows).forEach((row) => {
    row.remove();
  });
};

const addCustomPracticeNameEntryFieldToDialog = () => {
  // This function adds content to the "custom exercise" dialog.
  // Add an "Exercise Name" dialog after the little title text and
  // before the table full of crap
  const customExerciseDialog = document.getElementById(
    "newcustomexercisedialog"
  );
  const customExerciseDialogTable = document.getElementById(
    "newcustomexerciseformtable"
  );
  const customPracticeNameInput = document.createElement("input");
  customPracticeNameInput.setAttribute("selected", "selected");
  customPracticeNameInput.type = "text";
  customPracticeNameInput.className = "newcustomexercisename";
  customPracticeNameInput.id = "newcustomexercisename";
  customPracticeNameInput.name = "exercisename";

  // The UUID of the practice will be different from the UUID of
  // any of the individual terms on the practice
  customPracticeNameInput.setAttribute("uuid", UUIDGeneratorBrowser());

  // Add a lil' label for it too
  const customPracticeNameInputLabel = document.createElement("label");
  customPracticeNameInputLabel.for = "exercisename";
  customPracticeNameInputLabel.textContent = "Exercise Name: ";

  // And finally define the form
  const customPracticeNameInputForm = document.createElement("form");
  customPracticeNameInputForm.appendChild(customPracticeNameInputLabel);
  customPracticeNameInputForm.appendChild(customPracticeNameInput);
  customPracticeNameInputForm.id = "custompracticenameinputform";
  customPracticeNameInputForm.style.display = "block";
  customPracticeNameInputForm.style.textAlign = "center";

  // Now we can insert it above the table.
  customExerciseDialog.insertBefore(
    customPracticeNameInputForm,
    customExerciseDialogTable
  );
};

const clearCustomPracticeNameEntryFieldFromDialog = () => {
  // Dumpsters the trash created by addCustomPracticeNameEntryFieldToDialog
  const nameInputForm = document.getElementById("custompracticenameinputform");
  if (nameInputForm) {
    nameInputForm.remove();
  }
};

const addLanguageEntryFieldToDialog = () => {
  // Adds an input row to the custom exercise dialog
  const formTable = document.getElementById("newcustomexerciseformtable");
  const newFieldRow = document.createElement("tr");
  const entryFieldUUID = UUIDGeneratorBrowser();
  newFieldRow.className = "newcustomexercisefieldrow";
  newFieldRow.id = `newcustomexercisefieldrow-${entryFieldUUID}`;
  newFieldRow.setAttribute("uuid", entryFieldUUID);

  // Add a <td> that contains a little x that, when clicked, clears the
  // values in the current row
  const destroyItTd = document.createElement("td");
  destroyItTd.className = "newcustomexerciseremoverow";
  destroyItTd.id = `newcustomexerciseremoverow-${entryFieldUUID}`;
  destroyItTd.setAttribute("uuid", entryFieldUUID);
  destroyItTd.style.textAlign = "right";

  // We'll contain the X in a div that we can style separately.
  const destroyItDiv = document.createElement("div");
  destroyItDiv.style.fontSize = "small";
  // destroyItDiv.style.cursor = "pointer";
  // make it so user can't accidentally highlight the emoji :)
  destroyItDiv.style.webkitUserSelect = "none";
  destroyItDiv.style.userSelect = "none";
  destroyItDiv.textContent = "❌";
  destroyItDiv.hidden = true;
  // Put the div inside the td
  destroyItTd.appendChild(destroyItDiv);

  const englishTd = document.createElement("td");
  englishTd.className = "newcustomexercisefieldenglish";
  englishTd.id = `newcustomexercisefieldenglish-${entryFieldUUID}`;
  englishTd.setAttribute("uuid", entryFieldUUID);
  englishTd.width = "47%";

  const englishInput = document.createElement("input");
  englishInput.type = "text";
  englishInput.className = "newcustomexerciseinputenglish";
  englishInput.id = `newcustomexerciseinputenglish-${entryFieldUUID}`;
  englishInput.style.display = "block";
  englishInput.style.margin = "0 auto";
  englishInput.name = "english";
  englishInput.setAttribute("uuid", entryFieldUUID);
  englishTd.appendChild(englishInput);

  const latinTd = document.createElement("td");
  latinTd.className = "newcustomexercisefieldlatin";
  latinTd.id = `newcustomexercisefieldlatin-${entryFieldUUID}`;
  latinTd.setAttribute("uuid", entryFieldUUID);
  latinTd.width = "47%";

  const latinInput = document.createElement("input");
  latinInput.type = "text";
  latinInput.className = "newcustomexerciseinputlatin";
  latinInput.id = `newcustomexerciseinputlatin-${entryFieldUUID}`;
  latinInput.style.display = "block";
  latinInput.style.margin = "0 auto";
  latinInput.setAttribute("uuid", entryFieldUUID);
  latinInput.name = "latin";
  latinTd.appendChild(latinInput);

  // Now that we have our inputs defined, add a listener for our little
  // div that will empty them!
  destroyItDiv.addEventListener("click", () => {
    latinInput.value = "";
    englishInput.value = "";
    destroyItDiv.hidden = true;
    destroyItDiv.style.cursor = "auto";
  });

  // But it shouldn't always be visible, or click-able.
  // When our inputs change and become un-empty, it should appear.
  [englishInput, latinInput].forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      // Case it out...
      // First, if we see a change and both are empty, disappear the X.
      if (englishInput.value === "" && latinInput.value === "") {
        destroyItDiv.style.cursor = "auto";
        destroyItDiv.hidden = true;
        // Otherwise, if either one of them is non-empty, make it appear!
      } else if (englishInput.value !== "" || latinInput !== "") {
        destroyItDiv.style.cursor = "pointer";
        destroyItDiv.hidden = false;
      }
    });
  });

  newFieldRow.appendChild(destroyItTd);
  newFieldRow.appendChild(englishTd);
  newFieldRow.appendChild(latinTd);
  formTable.appendChild(newFieldRow);
};

const customLessonEntriesFromFileText = (fileText) => {
  // Given text from a file, return an array of entries
  // that are compatible with our custom exercise dialog.
  const splitFile = fileText.split("\n");
  const head = splitFile[0];
  // NOTE / HACK
  // Goofy way to detect CSVs. We'll see how this goes.
  // The logic -- it has to have both english an latin...
  // ... but only one of them can be first. Right!?
  if (head.includes(",latin") || head.includes(",english")) {
    // We're most likely looking at a CSV
    const csvHeaderArray = head.split(",");
    const indexEnglish = csvHeaderArray.indexOf("english");
    const indexLatin = csvHeaderArray.indexOf("latin");
    // Get everything besides the header
    const restOfTheCSV = splitFile.slice(1);
    const entryArray = new Array();
    restOfTheCSV.forEach((csvLine) => {
      const csvLineSplit = csvLine.split(",");
      const lineEnglish = csvLineSplit[indexEnglish];
      const lineLatin = csvLineSplit[indexLatin];
      // Skip new / empty lines.
      if (!lineEnglish || !lineLatin) {
        return;
      }
      entryArray.push({
        english: lineEnglish,
        latin: lineLatin,
      });
    });
    return entryArray;
  } else {
    // If it's not a CSV, it should only be JSON
    // Caller needs to catch, not me.
    const fileDataFromJSON = JSON.parse(fileText);
    if (!Array.isArray(fileDataFromJSON)) {
      throw new Error("Invalid file format");
    }
    // We iterate twice. If we don't have the right keys,
    // we should throw.
    fileDataFromJSON.forEach((entry) => {
      if (!(entry.hasOwnProperty("english") && entry.hasOwnProperty("latin"))) {
        throw new Error(
          "Invalid file format: All objects need 'english' and 'latin' keys"
        );
      }
    });
    const entryArray = new Array();
    fileDataFromJSON.forEach((entry) => {
      entryArray.push({
        english: entry.english,
        latin: entry.latin,
      });
    });
    return entryArray;
  }
};

const getLastCustomExerciseDialogRow = () => {
  // Returns a <tr> element or nothin'
  const formTable = document.getElementById("newcustomexerciseformtable");
  return formTable.lastChild;
};

const addEntriesToCustomExerciseDialog = (entries) => {
  // entries is an array of objects [... {english: ..., latin:...}, ...]
  // Nothing to do.
  if (!entries) {
    return;
  }
  // Get the current last row
  const lastRow = getLastCustomExerciseDialogRow();
  const englishInput = lastRow.querySelector('input[name="english"]');
  const latinInput = lastRow.querySelector('input[name="latin"]');
  // If english and latin input are both empty, it means this row is usable,
  // and we can start here
  let theRestOfTheEntries;
  if (englishInput.value === "" && latinInput.value === "") {
    const { english: firstEntryEnglish, latin: firstEntryLatin } = entries[0];
    englishInput.value = firstEntryEnglish;
    englishInput.dispatchEvent(new Event("input"));
    latinInput.value = firstEntryLatin;
    latinInput.dispatchEvent(new Event("input"));
    // Continuing, we don't need the first entry.
    theRestOfTheEntries = entries.splice(1);
  } else {
    theRestOfTheEntries = entries;
  }
  theRestOfTheEntries.forEach((entry) => {
    // For every entry, add a new row,
    addLanguageEntryFieldToDialog();
    // Grab that row and slurp the right input fields,
    const row = getLastCustomExerciseDialogRow();
    const rowEnglishInput = row.querySelector('input[name="english"]');
    const rowLatinInput = row.querySelector('input[name="latin"]');

    // And set the right values.
    rowEnglishInput.value = entry.english;
    // Our rows have listeners looking for input... but when we change
    // the value of the input element programatically, by default, it does
    // not fire the 'input' event. Let's force-fire it.
    rowEnglishInput.dispatchEvent(new Event("input"));
    rowLatinInput.value = entry.latin;
    rowLatinInput.dispatchEvent(new Event("input"));
  });
};

const fillCustomLessonEntryFormFromDrop = (event) => {
  // When a file gets dropped over the custom lesson dialog,
  // we need to read it and fill in the inputs if it's properly
  // formed. If it's malformed, we should let the user know.
  // We're not hiding anything... we'll log the error to the
  // console as well.
  const eventDataTransfer = event.dataTransfer;
  const files = eventDataTransfer.files;
  if (!files) {
    alert("Hey, I didn't find any files. You can't drop blobs, sorry.");
    return;
  }
  Array.from(files).forEach((file) => {
    file.text().then((fileText) => {
      try {
        const customEntries = customLessonEntriesFromFileText(fileText);
        addEntriesToCustomExerciseDialog(customEntries);
      } catch (err) {
        console.log(
          `Hey programmer! Here's the file read error: ${err} -- shoot me an email if you need help.`
        );
        alert(
          `Failed to read uploaded file ${file.name}. CSVs need a header of "latin,english"; JSON needs to be an array of objects with 'english' and 'latin' keys.`
        );
      }
    });
  });
};

const addNewCustomLessonSampleDataNoticeHideListener = () => {
  // This lets users hide the "advanced user" notice in the custom lesson dialog
  // Because sometimes I just want a website to get the fuck out of my face
  const noticeHide = document.getElementById("advancedusernoticehide");
  noticeHide.addEventListener("click", () => {
    const noticeSpan = document.getElementById("advancedusernotice");
    noticeSpan.hidden = true;
  });
};

const addNewCustomLessonClickListeners = () => {
  // Adds the click listeners necessary to actually power
  // our custom exercise feature.
  const customExerciseDialog = document.getElementById(
    "newcustomexercisedialog"
  );
  const newCustomLessonIcon = document.getElementById("add-exercise");
  newCustomLessonIcon.addEventListener("click", () => {
    clearCustomPracticeNameEntryFieldFromDialog();
    addCustomPracticeNameEntryFieldToDialog();

    clearLanguageEntryFieldsFromDialog();
    addLanguageEntryFieldToDialog();
    customExerciseDialog.showModal();
  });
  // What happens when we press "Save"?
  const newCustomLessonSaveButton = document.getElementById(
    "newcustomexercisedialogbuttonsave"
  );
  newCustomLessonSaveButton.addEventListener("click", () => {
    handleNewCustomLessonSave(customExerciseDialog);
  });
  // What happens when we press "Cancel"?
  const newCustomLessonCancelButton = document.getElementById(
    "newcustomexercisedialogbuttoncancel"
  );
  newCustomLessonCancelButton.addEventListener("click", () => {
    customExerciseDialog.close();
  });
  // This button helps us add more entries to our practice
  const newCustomLessonAddEntryButton = document.getElementById(
    "newcustomexerciseaddbutton"
  );
  newCustomLessonAddEntryButton.addEventListener("click", () => {
    addLanguageEntryFieldToDialog();
  });

  // We need to prevent the browser from doing default trash when we drag
  // stuff over the window.
  ["dragenter", "dragleave", "dragover", "drop"].forEach((eventType) => {
    window.addEventListener(eventType, (event) => {
      event.stopPropagation();
      event.preventDefault();
    });
  });
  // Things that happen when we drag something over the dialog
  customExerciseDialog.addEventListener("dragenter", () => {
    const body = document.getElementsByTagName("body")[0];
    body.style.cursor = "copy";
  });
  // This makes the cursor... I dunno. It's acting dumb
  ["dragleave", "dragend"].forEach((eventType) =>
    customExerciseDialog.addEventListener(eventType, () => {
      const body = document.getElementsByTagName("body")[0];
      body.style.cursor = "auto";
    })
  );
  // When we drop, let's send the file over.
  customExerciseDialog.addEventListener("drop", (event) => {
    fillCustomLessonEntryFormFromDrop(event);
    const body = document.getElementsByTagName("body")[0];
    body.style.cursor = "auto";
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
  // Listeners for what happens when we click the 'practice options'
  // dropdown and change it to a desired option, e.g. 'Clothes'
  const practiceOptionsDropDown = document.getElementById(
    "practiceoptionsdropdown"
  );
  practiceOptionsDropDown.addEventListener("change", () => {
    // We should display the practice formats that are available for
    // the given selection, e.g. Flashcards, Quiz...
    const sectionObject = displayAvailablePracticeFormats();
    // We should also change the download options so that if a user
    // tries to download this section, they wind up with the correct
    // data for the section.
    prepareSectionDownloadOptions(sectionObject);
  });
};

const addLangChoiceClickListener = () => {
  // We have a 'language choice' button which determines whether we
  // are going from english to jugoslavian, jugoslavian to english,
  // or a mix of both in our exercise. This listener cycles the options.
  const langChoiceButtoooooon = document.getElementById(
    "translation-direction"
  );
  const langChoiceSpan = document.getElementById("langdirchoicespan");
  langChoiceButtoooooon.addEventListener("click", () => {
    LANG_CHOICE_CYCLE.next();
    langChoiceSpan.textContent = LANG_CHOICE_CYCLE.peek().choiceTitle;
  });
};

const getStreakForDisplay = () => {
  return getObjectFromLocalStorage(STREAK_COUNT_KEY) || 0;
};

const setStreakDisplay = (displayElement) => {
  // Given the streak element, we should set it
  // based on the current streak value from local
  // storage. If the streak is more than a day old,
  // we should reset the user's streak to 0, because
  // they are not a user, they are a luser.
  const today = dateCookieStringFromDate(new Date());
  putObjectToLocalStorage(LAST_VISIT_KEY, today);
  if (streakIsOld()) {
    putObjectToLocalStorage(STREAK_COUNT_KEY, 0);
  }
  while (displayElement.firstChild) {
    displayElement.removeChild(displayElement.lastChild);
  }
  const streakText = document.createTextNode(
    `Your Streak: ${String(getStreakForDisplay())}`
  );
  displayElement.appendChild(streakText);
};

const streakIsOld = () => {
  // Determine whether the user's streak is more than a day old.
  const streakLastCheck =
    getObjectFromLocalStorage(STREAK_LAST_CHECK_KEY) || null;
  if (!streakLastCheck) {
    return false;
  }
  const dateToday = new Date();
  const [year, month, day] = streakLastCheck.split(".");

  const lastCheckAsDate = new Date(year, month - 1, day);
  const hoursSinceLastCheck = Math.abs(
    (lastCheckAsDate - dateToday) / (1000 * 60 * 60)
  );

  if (hoursSinceLastCheck > 48) {
    return true;
  }
  return false;
};

const handleStreak = () => {
  // Save the user's streak to local storage.
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
  const lastCheck = getObjectFromLocalStorage(STREAK_LAST_CHECK_KEY);

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
  const flashCardContainer = document.getElementById("flashcardcontainer");
  flashCardContainer.removeAttribute("style");
};

let warningCount = 0;
const loadStage = () => {
  // Load the working stage with flashcards, a quiz, etc. based on
  // the user's current selections. If they don't select anything,
  // yell at them.
  // Get the practice options dropdown,
  const practiceOptionsDropDown = document.getElementById(
    "practiceoptionsdropdown"
  );
  const choosePracticeWarning = document.getElementById(
    "choosePracticeWarning"
  );
  const selectedPractice = practiceOptionsDropDown.value;
  if (selectedPractice) {
    playSound("maraca", 0.3);

    choosePracticeWarning.hidden = true;
    // Make sure we have a clean slate to work with.
    clearStage(false);
    const practiceFormatOption = document.querySelector(
      'input[name="practiceformatoptions"]:checked'
    ).value;
    const fullPracticeMap = loadPracticeMapWithCustomEntries();
    if (practiceFormatOption === FORMAT_FLASHCARDS) {
      loadShuffledFlashCards(
        fullPracticeMap[selectedPractice].vocabularyObjects
      );
    } else if (practiceFormatOption === FORMAT_QUIZ) {
      loadQuiz(fullPracticeMap[selectedPractice].vocabularyObjects);
    } else if (practiceFormatOption === FORMAT_T_OR_F) {
      loadTrueOrFalse(fullPracticeMap[selectedPractice].vocabularyObjects);
    }
  } else {
    // Fun section. If they keep clicking even without a selection,
    // we want to yell at them, and eventually give up :)
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
      choosePracticeWarning.innerHTML =
        "<u><strong><em>WHAT ARE YOU DOING</em></strong></u>";
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
    // If they go over 100, commence farting.
    if (warningCount >= 100) {
      // I tried to have a volume > 1 but...
      playSound("fart", 1);
    }
  }
};

const downloadIconsInactive = () => {
  // Checks whether the download icons are in an active state
  // or not by eyeballing their style. They come in pairs like
  // salt and pepper. We don't change one without the other.
  const csvDownloadButton = document.getElementById("download-csv");
  const jsonDownloadButton = document.getElementById("download-json");
  return [csvDownloadButton, jsonDownloadButton].every((button) => {
    return button.style.color === "grey";
  });
};

const toggleDownloadIconStyles = () => {
  // Style the download icons to the opposite of whatever they are right now.
  const iconReadyCursor = `pointer`;
  const csvDownloadButton = document.getElementById("download-csv");
  const jsonDownloadButton = document.getElementById("download-json");
  // Download buttons active? Make them grayscale and unpointy.
  // Inactive? Make them colorful and pointy.
  [csvDownloadButton, jsonDownloadButton].forEach((button) => {
    if (button.style.color === "grey") {
      button.style.color = "white";
      button.style.cursor = iconReadyCursor;
    } else {
      button.style.color = "grey";
      button.style.cursor = null;
    }
  });
};

const objectUrlState = [];

const prepareSectionDownloadOptions = (sectionObject) => {
  // Based on the current selection, we should prep the download options.
  // The download links themselves are special blob links. That doesn't
  // scale, but this is a flashcard app. If it gets too big I'm fucking up.
  // Replace the buttons entirely to dump any old event listeners.
  let csvDownloadButton = document.getElementById("download-csv");
  const newCSVButton = csvDownloadButton.cloneNode(true);
  csvDownloadButton.replaceWith(newCSVButton);
  csvDownloadButton = newCSVButton;

  let jsonDownloadButton = document.getElementById("download-json");
  const newJSONButton = jsonDownloadButton.cloneNode(true);
  jsonDownloadButton.replaceWith(newJSONButton);
  jsonDownloadButton = newJSONButton;

  // Invalidate any existing Object URLS.
  objectUrlState.forEach((objectUrl) => {
    window.URL.revokeObjectURL(objectUrl);
  });

  // Remove the grayscale from the download buttons.
  // Prepare links for the buttons that are clickable, and allow
  // the user to download the lesson in CSV and JSON formats.
  if (downloadIconsInactive()) {
    toggleDownloadIconStyles();
  }

  // Add the content as CSV to the href in a blobby link.
  let csvLink = document.createElement("a");
  const csvBlobUrl = window.URL.createObjectURL(
    new Blob([sectionObject.asCSV], { type: "text/csv" })
  );
  objectUrlState.push(csvBlobUrl);
  csvLink.href = csvBlobUrl;
  // This lets us name the file.
  csvLink.download = `${sectionObject.unfriendlyName}.csv`;
  csvDownloadButton.addEventListener("click", () => {
    csvLink.click();
  });
  csvDownloadButton.removeAttribute("disabled");
  // Here we use application/octet-stream instead of application/json so that we
  // force a download dialog
  let jsonLink = document.createElement("a");
  const jsonBlobUrl = window.URL.createObjectURL(
    new Blob([sectionObject.asJSON], { type: "application/octet-stream" })
  );
  objectUrlState.push(jsonBlobUrl);
  jsonLink.href = jsonBlobUrl;
  jsonLink.download = `${sectionObject.unfriendlyName}.json`;
  jsonDownloadButton.addEventListener("click", () => {
    jsonLink.click();
  });
  jsonDownloadButton.removeAttribute("disabled");
};

const displayAvailablePracticeFormats = () => {
  // Given the currently selected section, display the practice
  // formats that are available for it.
  const practiceOptionsDropDown = document.getElementById(
    "practiceoptionsdropdown"
  );
  const practiceFormatsContainer = document.getElementById(
    "practiceformatscontainer"
  );
  // First, make sure we have a clean state by deleting any extant form
  while (practiceFormatsContainer.firstChild) {
    practiceFormatsContainer.removeChild(practiceFormatsContainer.lastChild);
  }
  // Load the available practice formats for our selected practice
  const selectedPractice = practiceOptionsDropDown.value;

  const sectionObject = loadPracticeMapWithCustomEntries()[selectedPractice];
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

const clearPracticeOptionsDropwdown = () => {
  // Drops all of the options from the practice options dropdown.
  Array.from(
    document.getElementsByClassName("vocabularysectionoption")
  ).forEach((option) => {
    option.remove();
  });
};

// NOTE: In the future, this won't just be VocabularySection objects.
// We'll see how this goes.
const fillPracticeOptionsDropdown = (vocabularySections) => {
  // Given all of our vocabularySections, fill the practice options
  // dropdown where user selects what they'd like to study.
  const practiceOptionsDropDown = document.getElementById(
    "practiceoptionsdropdown"
  );
  vocabularySections.forEach((vocabularySection) => {
    // Create a new option that we'll shortly add to the dropdown
    const vocabularySectionOption = document.createElement("option");
    vocabularySectionOption.className = "vocabularysectionoption";
    // Add a 'value' to the option. NOTE: in the future it might be good to have
    // more attributes that act as categories by which we can divine the capabilities
    // of each of the entries. We'll see.
    vocabularySectionOption.setAttribute(
      "value",
      vocabularySection.unfriendlyName
    );
    // Add the text that will show up in the dropdown,
    const descriptionNode = document.createTextNode(
      vocabularySection.friendlyName
    );
    // and add it to the option itself.
    vocabularySectionOption.appendChild(descriptionNode);
    // Finally, pin the option to the dropdown.
    practiceOptionsDropDown.appendChild(vocabularySectionOption);
  });
};

const addFlashcard = (front, back) => {
  // Adds a new flashcard. Front and Back are the words that appear
  // on the front and back of the card, respectively.
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
          cardFace.style.fontSize = `${
            cardFaceMaxFontSize - (textContentItem.length - 12)
          }px`;
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

const getJugoScriptForObject = (scriptOption, vocabularyObject) => {
  // Given a vocabulary object, return the jugoslavian variant for it.
  // This exists because we have two alphabets to deal with. If they
  // ask for a mix of cyrillic and latin, we should flip a coin to
  // decide which we'll return. Otherwise, just give them what they
  // asked for.
  let script;
  switch (scriptOption) {
    case SCRIPT_MIX:
      script =
        randomInt(0, 100) > 50
          ? vocabularyObject.cyrillic
          : vocabularyObject.latin;
      break;
    case SCRIPT_CYRILLIC:
      script = vocabularyObject.cyrillic;
      break;
    case SCRIPT_LATIN:
      script = vocabularyObject.latin;
      break;
    case SCRIPT_BOTH:
      script = `${vocabularyObject.latin}\n${vocabularyObject.cyrillic}`;
      break;
    default:
      throw new Error(
        `Invalid script choice: ${scriptOption}. How did you do this?`
      );
  }
  return script;
};

const loadShuffledFlashCards = (vocabularyObjects) => {
  // Loads an array of vocabularyObjects as flashcards onto the document
  const scoreBar = document.getElementById("scorebar");
  if (scoreBarHidden(scoreBar) === false) {
    toggleScoreBar(scoreBar);
  }
  const vocabCopy = [...vocabularyObjects];
  const flashCardContainer = document.getElementById("flashcardcontainer");
  const gridTemplateColumns = isMobile() ? "80vw" : "repeat(4, 200px)";
  flashCardContainer.style.gridTemplateColumns = gridTemplateColumns;

  const scriptOption = document.querySelector(
    'input[name="scriptoptions"]:checked'
  ).value;

  shuffleArray(vocabCopy);
  const languageChoice = getLanguageChoice();
  // TODO Where should this live?

  vocabCopy.forEach((vocabularyObject) => {
    // Let's flip some coins, shall we?
    let front;
    let rear;
    const jugoScriptForCard = getJugoScriptForObject(
      scriptOption,
      vocabularyObject
    );

    if (languageChoice === CHOICE_ENG_2_JUG) {
      // English is on the front for sure.
      front = vocabularyObject.english;
      rear = jugoScriptForCard;
    } else if (languageChoice === CHOICE_JUG_2_ENG) {
      // Jugo is on the front for sure.
      front = jugoScriptForCard;
      rear = vocabularyObject.english;
    } else if (languageChoice === CHOICE_MIXED) {
      const pair =
        randomInt(0, 100) > 50
          ? { front: vocabularyObject.english, rear: jugoScriptForCard }
          : {
              front: jugoScriptForCard,
              rear: vocabularyObject.english,
            };
      // Why can't I destructure here?
      front = pair.front;
      rear = pair.rear;
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
  flashCardContainer.parentNode.insertBefore(
    endnl,
    flashCardContainer.nextElementSibling
  );
  flashCardContainer.parentNode.insertBefore(
    topLinkContainer,
    flashCardContainer.nextElementSibling
  );

  practiceState.push(endnl);
  practiceState.push(topLinkContainer);
};

const handleScoringInteraction = (quizOption, scoreBar) => {
  // When a user interacts with a scoreable exercise ( e.g. a quiz
  // multiple choice option is clicked ) we should determine whether
  // they answered correctly, and then score them. We should also make
  // it so that, supposing they answered incorrectly, they can't get
  // the points back. Sorry chumpus.
  // Only colorize list items.
  if (quizOption.tagName.toLowerCase() === "li") {
    // For whatever reason, chrome isn't very happy about using
    // contains on classList, nor includes. Spread it to find out.

    const hasBeenAnswered = Object.values(
      quizOption.parentNode.attributes
    ).some((attr) => attr.name === "answeredcorrectly");

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
  // Determine whether the score bar is hidden or not.
  if (isMobile()) {
    return scoreBar.style.visibility !== "visible";
  } else {
    return scoreBar.hidden === true;
  }
};

const hideScoreBar = (scoreBar) => {
  // Hide the score bar.
  scoreBar.hidden = true;
};

const toggleScoreBar = (scoreBar) => {
  // Set the score bar's visibility to whatever it isn't.
  if (isMobile()) {
    scoreBar.hidden = false;
    if (scoreBar.style.visibility !== "visible") {
      scoreBar.style.visibility = "visible";
    } else {
      scoreBar.style.visibility = "collapse";
    }
  } else {
    if (scoreBar.hidden) {
      scoreBar.hidden = false;
    } else {
      scoreBar.hidden = true;
    }
  }
};

const setScoreBarScore = (scoreBar, score, maxScore) => {
  // Set the appearance of the scorebar. It looks like this:
  // score / maxScore
  // That is, the score argument will set how many questions
  // user has correctly answered, and maxScore will set how many
  // points are possible in the given exercise.
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
  // Get the score from the score bar. See setScoreBarScore.
  return Number(scoreBar.getAttribute("score"));
};

const getScoreBarMax = (scoreBar) => {
  // Get the maximum score from the scorebar. See setScoreBarScore.
  return Number(scoreBar.getAttribute("maxscore"));
};

const incrementScoreBarScore = (scoreBar, amount) => {
  // Add amount to the scorebar's score. See setScoreBarScore.
  const currentScore = getScoreBarScore(scoreBar);
  const scoreMax = getScoreBarMax(scoreBar);
  setScoreBarScore(scoreBar, currentScore + amount, scoreMax);
};

const checkQuizComplete = (event, className) => {
  let complete = true;
  [...document.getElementsByClassName(className)].forEach((q) => {
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
  // Given the current selection, load a scored "True or False" exercise.
  const scoreBar = document.getElementById("scorebar");
  if (scoreBarHidden(scoreBar) === true) {
    toggleScoreBar(scoreBar);
  }
  const scoreMax = vocabularyObjects.length;
  const trueOrFalseHeader = "True or False:";
  setScoreBarScore(scoreBar, 0, scoreMax);
  const scriptOption = document.querySelector(
    'input[name="scriptoptions"]:checked'
  ).value;
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
    const jugoScript = getJugoScriptForObject(scriptOption, vocabularyObject);
    // Get an ID for the question.
    const questionUUID = UUIDGeneratorBrowser();
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
      const falseObject = chooseRandomExcept(vocabularyObjects, [
        vocabularyObject,
      ]);
      pair = {
        sourceObject: vocabularyObject,
        destinationObject: falseObject,
        value: false,
      };
    }
    // Flip a coin to see if the left side is english or not.
    const languageChoice = getLanguageChoice();
    if (languageChoice === CHOICE_ENG_2_JUG) {
      sourceEnglish = true;
    } else if (languageChoice === CHOICE_JUG_2_ENG) {
      sourceEnglish = false;
    } else if (languageChoice === CHOICE_MIXED) {
      sourceEnglish = randomInt(0, 100) > 50;
    }

    const jugoObject = sourceEnglish
      ? pair.destinationObject
      : pair.sourceObject;
    const englishSide = sourceEnglish
      ? pair.sourceObject.english
      : pair.destinationObject.english;

    let jugoSide;
    if (scriptOption === SCRIPT_BOTH) {
      const conjunction = sourceEnglish ? "or" : "and";
      jugoSide = `${jugoObject.cyrillic} ${conjunction} ${jugoObject.latin}`;
    } else if (scriptOption === SCRIPT_LATIN) {
      jugoSide = jugoObject.latin;
    } else if (scriptOption === SCRIPT_CYRILLIC) {
      jugoSide = jugoObject.cyrillic;
    } else if (scriptOption === SCRIPT_MIX) {
      jugoSide =
        randomInt(0, 100) > 50 ? jugoObject.cyrillic : jugoObject.latin;
    }
    const questionTable = document.createElement("table");
    questionTable.className = "truthtable";
    questionTable.id = questionUUID;
    questionTable.setAttribute("value", pair.value);

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
    questionTableQuestionLeft.textContent = sourceEnglish
      ? englishSide
      : jugoSide;

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
    questionTableQuestionRight.textContent = sourceEnglish
      ? jugoSide
      : englishSide;

    // Add all three of our cells to the question row,
    questionTableQuestionRow.appendChild(questionTableQuestionLeft);
    questionTableQuestionRow.appendChild(questionTableQuestionCenter);
    questionTableQuestionRow.appendChild(questionTableQuestionRight);
    // and add the question row to the table
    questionTable.appendChild(questionTableQuestionRow);

    // Now: We want some buttons to help the user decide whether the statement
    // in our table is "true" or "false".
    const questionTableButtonRow = document.createElement("tr");
    const questionTableButtonCell = document.createElement("td");
    questionTableButtonCell.className = "truthtable-button-cell";
    questionTableButtonCell.colSpan = "3";

    const trueButton = document.createElement("button");
    trueButton.value = "true";
    trueButton.textContent = "True";
    trueButton.className = "truthtable-button-true";
    questionTableButtonCell.appendChild(trueButton);

    const falseButton = document.createElement("button");
    falseButton.value = "false";
    falseButton.textContent = "False";
    falseButton.className = "truthtable-button-false";
    questionTableButtonCell.appendChild(falseButton);

    [trueButton, falseButton].forEach((button) => {
      button.addEventListener("click", () => {
        const relevantTable = document.getElementById(questionUUID);
        const wasAnswered = relevantTable.getAttribute("answered");
        if (wasAnswered !== "true") {
          const questionValue = relevantTable.getAttribute("value");
          if (questionValue === button.value) {
            relevantTable.style.border = "2px solid green";
            playSound("pageFlip");
            relevantTable.setAttribute("answeredcorrectly", "true");
            const scoreBar = document.getElementById("scorebar");
            incrementScoreBarScore(scoreBar, 1);
          } else {
            relevantTable.style.border = "2px solid red";
            playSound("fart");
            relevantTable.setAttribute("answeredcorrectly", "false");
          }
          relevantTable.setAttribute("answered", "true");
        }
      });
    });

    questionTableButtonRow.appendChild(questionTableButtonCell);
    questionTable.appendChild(questionTableButtonRow);

    const lineBreak = document.createElement("br");
    // Add the question table to the box and add a line break.
    quizBox.appendChild(questionTable);
    practiceState.push(questionTable);
    quizBox.appendChild(lineBreak);
    practiceState.push(lineBreak);
  });
  const topLink = document.createElement("a");
  const topLinkText = document.createTextNode("Back to Top");
  topLink.href = "#";
  topLink.style.placeSelf = "center";
  topLink.appendChild(topLinkText);
  quizBox.appendChild(topLink);
  practiceState.push(topLink);

  quizBox.addEventListener("click", (event) =>
    checkQuizComplete(event, "truthtable")
  );
};

const loadQuiz = (vocabularyObjects) => {
  // Loads a gang of vocabulary objects as a scored quiz.
  const scoreBar = document.getElementById("scorebar");
  if (scoreBarHidden(scoreBar) === true) {
    toggleScoreBar(scoreBar);
  }
  const scoreMax = vocabularyObjects.length;
  setScoreBarScore(scoreBar, 0, scoreMax);
  const vocabCopy = [...vocabularyObjects];

  const scriptOption = document.querySelector(
    'input[name="scriptoptions"]:checked'
  ).value;

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
    const languageChoice = getLanguageChoice();
    if (languageChoice === CHOICE_ENG_2_JUG) {
      isEnglish = true;
    } else if (languageChoice === CHOICE_JUG_2_ENG) {
      isEnglish = false;
    } else if (languageChoice === CHOICE_MIXED) {
      isEnglish = randomInt(0, 100) > 50;
    }
    if (isEnglish) {
      headerScript = `"${vocabularyObject.english}" translates to...`;
    } else {
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
    const quizQuestionText = document.createTextNode(
      `${questionNumber}. ${headerScript}`
    );
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
    const optionThree = chooseRandomExcept(vocabCopy, [
      vocabularyObject,
      optionTwo,
    ]);
    const optionFour = chooseRandomExcept(vocabCopy, [
      vocabularyObject,
      optionTwo,
      optionThree,
    ]);
    const quizOptions = shuffleArray([
      vocabularyObject,
      optionTwo,
      optionThree,
      optionFour,
    ]);

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
  quizBox.addEventListener("click", (event) =>
    checkQuizComplete(event, "quizcontainer")
  );
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

const loadAllPracticesToDropDown = () => {
  const customPractices = getCustomPracticesFromStorage();
  const toLoad = [...Object.values(practiceMap), ...customPractices];
  fillPracticeOptionsDropdown(toLoad);
};

const main = () => {
  setPlatformStyle();
  loadAllPracticesToDropDown();
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
  addLangChoiceClickListener();
  addNewCustomLessonClickListeners();
  // addNewCustomLessonSampleDataNoticeHideListener();
};

(() => {
  main();
})();
