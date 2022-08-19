const canvas = document.getElementById("headerCanvas");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
const canvasContext = canvas.getContext("2d");

const ANAGLYPH_NAME_CHANCE_TIME_INTERVAL_MS = 3000;
const ANAGLYPH_FLOP_CHANCE = 50; // 50% chance to turn it on
const ANAGLYPH_SHAPES = false;
const BUBBLE_FREQUENCY_MS = 1000;
const BUBBLE_MAX_AGE = 4000;
const NAME_COLOR_CHANGE_SPEED_MS = 100;
const NAME_COLOR_CHANGE_QUANTITY = 5;

// This first segment is stuff to keep my little 'work experience' doodad working
localStorage.setItem("workExperienceDescriptionState", "empty");
localStorage.setItem("programmingExperienceDescriptionState", "empty");

let workExperienceDescriptionDiv = document.getElementById("work-experience-description");

const SetDescription = (descriptionElement, stateString, Description) => {
  if (localStorage.getItem(stateString) === "empty" || localStorage.getItem(stateString) !== Description.id) {
    localStorage.setItem(stateString, Description.id);
    descriptionElement.innerHTML = Description.data;
  } else {
    localStorage.setItem(stateString, "empty");
    descriptionElement.innerHTML = "";
  }
};

const GetHTMLFromURI = async (uri) => {
  return new Promise((resolve, reject) => {
    fetch(uri).then((response) => {
      return resolve(response.text());
    });
  });
};

let fsDescription = new Object();
fsDescription.id = "finite-state-description";
GetHTMLFromURI("./assets/elements/finite_state_description.html").then((data) => {
  fsDescription.data = data;
});

let finiteStateHoverable = document.getElementById("fs-hoverable");

finiteStateHoverable.addEventListener(
  "click",
  SetDescription.bind(this, workExperienceDescriptionDiv, "workExperienceDescriptionState", fsDescription)
);

// From here down we're doing a cute header with canvas
const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
};

const coinFlipSign = () => {
  // Flip a coin. If it's heads, return +1. If it's tails, return -1.
  if (generateRandomNumber(1, 100) > 50) {
    return 1;
  }
  return -1;
};

let nameFontState = {
  r: 0,
  g: 0,
  b: 0,
};

let anaglyphNameActive = false;
const maybeFlipAnaglyph = () => {
  if (generateRandomNumber(1, 100) < ANAGLYPH_FLOP_CHANCE) {
    anaglyphNameActive = !anaglyphNameActive;
  }
};

const advanceNameFontState = () => {
  nameFontState.r = (nameFontState.r + NAME_COLOR_CHANGE_QUANTITY * coinFlipSign() * generateRandomNumber(1, 4)) % 255;
  nameFontState.g = (nameFontState.g + NAME_COLOR_CHANGE_QUANTITY * coinFlipSign() * generateRandomNumber(1, 4)) % 255;
  nameFontState.b = (nameFontState.b + NAME_COLOR_CHANGE_QUANTITY * coinFlipSign() * generateRandomNumber(1, 4)) % 255;
};

const randomizeNameFontState = () => {
  nameFontState.r = generateRandomNumber(1, 255);
  nameFontState.g = generateRandomNumber(1, 255);
  nameFontState.b = generateRandomNumber(1, 255);
};

const drawFrame = () => {
  // This function will draw a nice verdigris, vertical line
  // on either side of our canvas.
  let oldStyle = canvasContext.strokeStyle;
  let oldWidth = canvasContext.lineWidth;
  canvasContext.lineWidth = 3;
  canvasContext.strokeStyle = "#43b3ae";
  canvasContext.beginPath();
  canvasContext.moveTo(0, 0);
  canvasContext.lineTo(0, canvasHeight);
  canvasContext.moveTo(0, 0);
  canvasContext.lineTo(10, 0);
  canvasContext.stroke();

  canvasContext.beginPath();
  canvasContext.moveTo(canvasWidth, 0);
  canvasContext.lineTo(canvasWidth, canvasHeight);
  canvasContext.moveTo(canvasWidth - 10, canvasHeight);
  canvasContext.lineTo(canvasWidth, canvasHeight);
  canvasContext.stroke();

  canvasContext.strokeStyle = oldStyle;
  canvasContext.lineWidth = oldWidth;
};

const drawName = () => {
  let oldFont = canvasContext.font;
  let oldFillStyle = canvasContext.fillStyle;
  canvasContext.font = "25px Courier";
  canvasContext.fillStyle = `rgb(${nameFontState.r}, ${nameFontState.g}, ${nameFontState.b})`;
  canvasContext.fillText("Samuel Vidovich", canvasWidth / 3, canvasHeight / 2);
  if (anaglyphNameActive) {
    let xOffset = generateRandomNumber(2, 4);
    let yOffset = generateRandomNumber(2, 4);
    canvasContext.fillStyle = `rgb(255, 0, 0)`;
    canvasContext.fillText("Samuel Vidovich", canvasWidth / 3 - xOffset, canvasHeight / 2 - yOffset);
    canvasContext.fillStyle = `rgb(0, 255, 255)`;
    canvasContext.fillText("Samuel Vidovich", canvasWidth / 3 + xOffset, canvasHeight / 2 + yOffset);
  }
  canvasContext.font = oldFont;
  canvasContext.fillStyle = oldFillStyle;
};

const bubblesArray = new Array();

class Bubble {
  constructor(x, y, r, speed, color) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = speed;
    this.color = color; // rgb(r, g, b) string
    this.createdAt = Date.now();
    this.isActuallyRectangle = false;
  }
  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }
  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}

const randomBubbleFactory = () => {
  const randomBubbleRadius = generateRandomNumber(6, 14);
  const randomBubbleSpeed = generateRandomNumber(3, 6);
  const randomBubbleColor = `rgb(${generateRandomNumber(1, 255)}, ${generateRandomNumber(
    1,
    255
  )}, ${generateRandomNumber(1, 255)})`;
  let assembledBubble = new Bubble(
    -randomBubbleRadius / 2, // Start me off screen!
    generateRandomNumber(0, canvasHeight),
    randomBubbleRadius,
    randomBubbleSpeed,
    randomBubbleColor
  );
  if (generateRandomNumber(1, 100) > 93) {
    assembledBubble.isActuallyRectangle = true;
  }
  return assembledBubble;
};

const addNewBubble = () => {
  bubblesArray.push(randomBubbleFactory());
};

const garbageCollectBubbles = () => {
  // This method will search the bubblesArray for bubbles that
  // are outside of the canvas, and delete them
  const toBeDestroyed = new Array();
  bubblesArray.forEach((bubble) => {
    if (bubble.x - bubble.r - 1 > canvasWidth) {
      toBeDestroyed.push(bubble);
    } else if (Date.now() - bubble.createdAt > BUBBLE_MAX_AGE) {
      toBeDestroyed.push(bubble);
    }
  });
  toBeDestroyed.forEach((bubble) => {
    const escapedBubbleIndex = bubblesArray.indexOf(bubble);
    bubblesArray.splice(escapedBubbleIndex, 1);
  });
};

const moveBubbles = () => {
  // Updates each global bubble's state
  bubblesArray.forEach((bubble) => {
    bubble.moveBy(bubble.speed, 0);
  });
};

const drawBubble = (bubble) => {
  // Draws a single bubble.
  let oldWidth = canvasContext.lineWidth;
  let oldStrokeStyle = canvas.strokeStyle;
  canvasContext.lineWidth = 2;
  canvasContext.strokeStyle = bubble.color;
  canvasContext.beginPath();
  if (!bubble.isActuallyRectangle) {
    canvasContext.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI);
    canvasContext.stroke();
    if (ANAGLYPH_SHAPES && anaglyphNameActive) {
      let xOffset = generateRandomNumber(2, 4);
      let yOffset = generateRandomNumber(2, 4);
      canvasContext.beginPath();
      canvasContext.strokeStyle = `rgb(255, 0, 0)`;
      canvasContext.arc(bubble.x - xOffset, bubble.y - yOffset, bubble.r, 0, 2 * Math.PI);
      canvasContext.stroke();
      canvasContext.beginPath();
      canvasContext.strokeStyle = `rgb(0, 255, 255)`;
      canvasContext.arc(bubble.x + xOffset, bubble.y + yOffset, bubble.r, 0, 2 * Math.PI);
      canvasContext.stroke();
    }
  } else {
    canvasContext.strokeRect(bubble.x, bubble.y, bubble.r, bubble.r);
    if (ANAGLYPH_SHAPES && anaglyphNameActive) {
      let xOffset = generateRandomNumber(2, 4);
      let yOffset = generateRandomNumber(2, 4);
      canvasContext.strokeStyle = `rgb(255, 0, 0)`;
      canvasContext.strokeRect(bubble.x - xOffset, bubble.y + yOffset, bubble.r, bubble.r);
      canvasContext.strokeStyle = `rgb(0, 255, 255)`;
      canvasContext.strokeRect(bubble.x + xOffset, bubble.y + yOffset, bubble.r, bubble.r);
    }
  }
  canvasContext.lineWidth = oldWidth;
  canvasContext.strokeStyle = oldStrokeStyle;
};

const drawBubbles = () => {
  bubblesArray.forEach((bubble) => {
    drawBubble(bubble);
  });
};

const update = () => {
  // Clear the canvas so old drawings do not stay.
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  drawFrame();
  moveBubbles();
  drawBubbles();
  garbageCollectBubbles();
  drawName();
};

(() => {
  let animationFrameRequestToken;

  // Set state of name colours here to guarantee no race
  // condition
  randomizeNameFontState();
  // Change the colour of the name rather quickly,
  window.setInterval(advanceNameFontState, NAME_COLOR_CHANGE_SPEED_MS);
  // And reset it to something random rather less quickly.
  window.setInterval(randomizeNameFontState, NAME_COLOR_CHANGE_SPEED_MS * 100);
  // Add some bubbles now and again
  window.setInterval(addNewBubble, BUBBLE_FREQUENCY_MS);
  // Maybe turn on / off cool 3D anaglyph text
  window.setInterval(maybeFlipAnaglyph, ANAGLYPH_NAME_CHANCE_TIME_INTERVAL_MS);

  main = (hiResTimeStamp) => {
    try {
      animationFrameRequestToken = window.requestAnimationFrame(main);

      update();
    } catch (error) {
      console.error(error);
    }
  };
  main();
})();
