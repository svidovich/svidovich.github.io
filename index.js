const headerCanvas = document.getElementById("headerCanvas");
const headerCanvasHeight = headerCanvas.height;
const headerCanvasWidth = headerCanvas.width;
const headerCanvasContext = headerCanvas.getContext("2d");

const ANAGLYPH_NAME_CHANCE_TIME_INTERVAL_MS = 3000;
const ANAGLYPH_FLOP_CHANCE = 50; // 50% chance to turn it on
const ANAGLYPH_SHAPES = false;
const BUBBLE_FREQUENCY_MS = 1000;
const BUBBLE_MAX_AGE = 6000;
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
  let oldStyle = headerCanvasContext.strokeStyle;
  let oldWidth = headerCanvasContext.lineWidth;
  headerCanvasContext.lineWidth = 3;
  headerCanvasContext.strokeStyle = "#43b3ae";
  headerCanvasContext.beginPath();
  headerCanvasContext.moveTo(0, 0);
  headerCanvasContext.lineTo(0, headerCanvasHeight);
  headerCanvasContext.moveTo(0, 0);
  headerCanvasContext.lineTo(10, 0);
  headerCanvasContext.stroke();

  headerCanvasContext.beginPath();
  headerCanvasContext.moveTo(headerCanvasWidth, 0);
  headerCanvasContext.lineTo(headerCanvasWidth, headerCanvasHeight);
  headerCanvasContext.moveTo(headerCanvasWidth - 10, headerCanvasHeight);
  headerCanvasContext.lineTo(headerCanvasWidth, headerCanvasHeight);
  headerCanvasContext.stroke();

  headerCanvasContext.strokeStyle = oldStyle;
  headerCanvasContext.lineWidth = oldWidth;
};

const drawName = () => {
  let oldFont = headerCanvasContext.font;
  let oldFillStyle = headerCanvasContext.fillStyle;
  headerCanvasContext.font = "25px Courier";
  headerCanvasContext.fillStyle = `rgb(${nameFontState.r}, ${nameFontState.g}, ${nameFontState.b})`;
  headerCanvasContext.fillText("Samuel Vidovich", headerCanvasWidth / 3, headerCanvasHeight / 2);
  if (anaglyphNameActive) {
    let xOffset = generateRandomNumber(2, 4);
    let yOffset = generateRandomNumber(2, 4);
    headerCanvasContext.fillStyle = `rgb(255, 0, 0)`;
    headerCanvasContext.fillText("Samuel Vidovich", headerCanvasWidth / 3 - xOffset, headerCanvasHeight / 2 - yOffset);
    headerCanvasContext.fillStyle = `rgb(0, 255, 255)`;
    headerCanvasContext.fillText("Samuel Vidovich", headerCanvasWidth / 3 + xOffset, headerCanvasHeight / 2 + yOffset);
  }
  headerCanvasContext.font = oldFont;
  headerCanvasContext.fillStyle = oldFillStyle;
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
    generateRandomNumber(0, headerCanvasHeight),
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
    if (bubble.x - bubble.r - 1 > headerCanvasWidth) {
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
  let oldWidth = headerCanvasContext.lineWidth;
  let oldStrokeStyle = canvas.strokeStyle;
  headerCanvasContext.lineWidth = 2;
  headerCanvasContext.strokeStyle = bubble.color;
  headerCanvasContext.beginPath();
  if (!bubble.isActuallyRectangle) {
    headerCanvasContext.arc(bubble.x, bubble.y, bubble.r, 0, 2 * Math.PI);
    headerCanvasContext.stroke();
    if (ANAGLYPH_SHAPES && anaglyphNameActive) {
      let xOffset = generateRandomNumber(2, 4);
      let yOffset = generateRandomNumber(2, 4);
      headerCanvasContext.beginPath();
      headerCanvasContext.strokeStyle = `rgb(255, 0, 0)`;
      headerCanvasContext.arc(bubble.x - xOffset, bubble.y - yOffset, bubble.r, 0, 2 * Math.PI);
      headerCanvasContext.stroke();
      headerCanvasContext.beginPath();
      headerCanvasContext.strokeStyle = `rgb(0, 255, 255)`;
      headerCanvasContext.arc(bubble.x + xOffset, bubble.y + yOffset, bubble.r, 0, 2 * Math.PI);
      headerCanvasContext.stroke();
    }
  } else {
    headerCanvasContext.strokeRect(bubble.x, bubble.y, bubble.r, bubble.r);
    if (ANAGLYPH_SHAPES && anaglyphNameActive) {
      let xOffset = generateRandomNumber(2, 4);
      let yOffset = generateRandomNumber(how many characters in a uuid many characters in a uuid, 4);
      headerCanvasContext.strokeStyle = `rgb(255, 0, 0)`;
      headerCanvasContext.strokeRect(bubble.x - xOffset, bubble.y + yOffset, bubble.r, bubble.r);
      headerCanvasContext.strokeStyle = `rgb(0, 255, 255)`;
      headerCanvasContext.strokeRect(bubble.x + xOffset, bubble.y + yOffset, bubble.r, bubble.r);
    }
  }
  headerCanvasContext.lineWidth = oldWidth;
  headerCanvasContext.strokeStyle = oldStrokeStyle;
};

const drawBubbles = () => {
  bubblesArray.forEach((bubble) => {
    drawBubble(bubble);
  });
};

const update = () => {
  // Clear the canvas so old drawings do not stay.
  headerCanvasContext.clearRect(0, 0, headerCanvasWidth, headerCanvasHeight);
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
