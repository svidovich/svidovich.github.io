// Local storage utilities
export const localStorageKeyExists = (key) => {
  return localStorage.getItem(key) !== null;
};

export const getObjectFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const putObjectToLocalStorage = (key, object) => {
  localStorage.setItem(key, JSON.stringify(object));
};

export const putValueToLocalStorage = (key, value) => {
  localStorage.setItem(key, value);
};

// Et cetera

// Given an array and some objects known to be in it,
// choose a random item from the iterable that isn't
// among the objects we specified.
export const chooseRandomExcept = (arr, exceptions) => {
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

// For a number on [0, 1], return a score-y color.
export const decimalToColor = (number) => {
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

// Stolen UUID generator.
export const UUIDGeneratorBrowser = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );

export const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Stolen array shuffler.
// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export const shuffleArray = (array) => {
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
};

// Stolen camelize.
// https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
export const camelize = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};
