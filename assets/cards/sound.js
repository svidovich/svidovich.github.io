import {
  sleep,
  localStorageKeyExists,
  putValueToLocalStorage,
} from "./utilities.js";

const SOUND_EFFECT_KEY = "soundOn";

export const SOUNDS = {
  block: "../../media/block.mp3",
  pageFlip: "../../media/page_turn.mp3",
  fart: "../../media/fart_1.mp3",
  maraca: "../../media/maraca.mp3",
  whoosh: "../../media/whoosh.mp3",
  whoosh2: "../../media/whoosh2.mp3",
  soda: "../../media/soda.mp3",
  tap: "../../media/tap.mp3",
  uncork: "../../media/uncork.mp3",
};

const loadAudio = (path) => {
  const audio = new Audio(path);
  return audio;
};

// NOTE: By default, we play sound.
if (!localStorageKeyExists(SOUND_EFFECT_KEY)) {
  putValueToLocalStorage(SOUND_EFFECT_KEY, "true");
}

export const shouldPlaySound = () => {
  return localStorage.getItem(SOUND_EFFECT_KEY) === "true";
};

export const toggleSound = () => {
  if (shouldPlaySound()) {
    putValueToLocalStorage(SOUND_EFFECT_KEY, "false");
  } else {
    putValueToLocalStorage(SOUND_EFFECT_KEY, "true");
  }
};

export const playSound = (soundName, volume, delay) => {
  // We lazily load sounds by only fetching them when
  // they're needed instead of loading all of our sound
  // effects with the page. We mutate the SOUNDS object
  // to contain audio tracks as we load them.
  if (shouldPlaySound()) {
    try {
      const soundEntry = SOUNDS[soundName];
      if (delay !== undefined) {
        sleep(delay);
      }
      if (typeof soundEntry === "string") {
        const sound = loadAudio(soundEntry);
        SOUNDS[soundName] = sound;
        sound.volume = volume || 1;
        sound.play();
      } else {
        soundEntry.volume = volume || 1;
        soundEntry.play();
      }
    } catch (error) {
      console.log(`Failed to play ${soundName}: ${error}`);
    }
  }
};
