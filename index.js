// TODO: This is thus only evaluated once, which is
// problematic if we resize. Let's fix that later
const resolutionHeight = window.screen.availHeight;
const resolutionWidth = window.screen.availWidth;

const headerCanvas = document.getElementById("headerCanvas");
const headerCanvasHeight = headerCanvas.height;
const headerCanvasWidth = headerCanvas.width;
const headerCanvasContext = headerCanvas.getContext("2d");

const backingCanvas = document.getElementById("backingCanvas");
backingCanvas.height = resolutionHeight;
backingCanvas.width = resolutionWidth;

const backingCanvasHeight = backingCanvas.height;
const backingCanvasWidth = backingCanvas.width;
const backingCanvasContext = backingCanvas.getContext("2d");

const ANAGLYPH_NAME_CHANCE_TIME_INTERVAL_MS = 3000;
const ANAGLYPH_FLOP_CHANCE = 50; // 50% chance to turn it on
const ANAGLYPH_SHAPES = false;
const BUBBLE_FREQUENCY_MS = 1000;
const ENTITY_DEFAULT_MAX_AGE_MS = 6000;
const DEBUG_ENTITY_POSITIONS = false;
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

// From here down we're doing cool canvas stuff
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
};

const randomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const coinFlipSign = () => {
  // Flip a coin. If it's heads, return +1. If it's tails, return -1.
  if (generateRandomNumber(1, 100) > 50) {
    return 1;
  }
  return -1;
};

const loadImage = (imagePath) => {
  const loadedImage = new Image();
  loadedImage.src = imagePath;
  return loadedImage;
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

class Entity {
  constructor(x, y, speed, sizeX, sizeY, image, direction) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    this.image = image;
    this.createdAt = Date.now();
    this.direction = direction || "E";
  }
  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}

class SpriteSequence {
  constructor(name, sheetFile, sequence, scale = 1) {
    this.name = name;
    // sample sequence
    // [
    //   {
    //     corner: {
    //       x: 100, // Where in the sprite sheet we should look for
    //       y: 150, // this particular state of the sprite
    //     },
    //     size: {
    //       x: 25, // How big this particular state of the sprite is
    //       y: 25,
    //     },
    //   },
    // ];
    this.sequence = sequence;
    this.spriteSheet = loadImage(sheetFile);
    // Size should be an array [x, y] representing the width
    // and height of the sprite in the given sprite sheet file
    this.scale = scale;
  }
}

class Sprite {
  constructor(x, y) {
    this.currentState = null;
    this.sequences = new Object();
    this.spriteIndex = 0;
    // TODO: Make me moveable!
    this.x = x;
    this.y = y;
  }

  getCurrentState() {
    return this.currentState;
  }

  setCurrentState(sequence) {
    this.currentState = sequence;
  }

  getSpriteSequence(spriteSequenceName) {
    if (!this.sequences.hasOwnProperty(spriteSequenceName)) return null;
    return this.sequences[spriteSequenceName];
  }

  addSpriteSequence(spriteSequence) {
    this.sequences[spriteSequence.name] = spriteSequence;
  }

  drawSpriteSequence(canvasContext, spriteSequence, x, y) {
    // Here, x and y arguments define where the sprite will appear ( by its
    // top left corner ) on the canvas.
    const { corner, size } = spriteSequence.sequence[this.spriteIndex];

    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    canvasContext.drawImage(
      spriteSequence.spriteSheet,
      corner.x,
      corner.y,
      size.x,
      size.y,
      x,
      y,
      size.x * spriteSequence.scale,
      size.y * spriteSequence.scale
    );
    // Make sure that the next time we draw this sprite,
    // we're drawing from the correct index in the sequence
    if (this.spriteIndex === spriteSequence.sequence.length - 1) {
      this.spriteIndex = 0;
    } else {
      this.spriteIndex += 1;
    }
  }

  drawCurrentState(canvasContext) {
    this.drawSpriteSequence(canvasContext, this.currentState, this.x, this.y);
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
    } else if (Date.now() - bubble.createdAt > ENTITY_DEFAULT_MAX_AGE_MS) {
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
  let oldStrokeStyle = headerCanvasContext.strokeStyle;
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
      let yOffset = generateRandomNumber(2, 4);
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

const garbageCollectEntityArray = (entityArray, canvasBoundaries, maxEntityAge) => {
  // I guess we're assuming that all entities are moving left-to-right.
  const toBeDestroyed = new Array();
  const { canvasHeight, canvasWidth } = canvasBoundaries;
  entityArray.forEach((entity) => {
    if (entity.x - entity.sizeX - 1 > canvasWidth) {
      toBeDestroyed.push(entity);
    } else if (Date.now() - entity.createdAt > (maxEntityAge || ENTITY_DEFAULT_MAX_AGE_MS)) {
      toBeDestroyed.push(entity);
    }
  });
  toBeDestroyed.forEach((entity) => {
    const entityIndex = entityArray.indexOf(entity);
    entityArray.splice(entityIndex, 1);
  });
};

const interestingEntities = Object.freeze({
  shootingStars: {
    text: "Shooting Stars",
    image: loadImage("media/cute-star.png"),
    sizeX: 30,
    sizeY: 30,
    renderingCallable: () => {},
  },
  fishes: {
    text: "Fishes",
    image: loadImage("media/trout.png"),
    sizeX: 102,
    sizeY: 41,
    renderingCallable: () => {},
  },
  magic: {
    text: "Mysticism",
    image: loadImage("media/heptagram.png"),
    renderingCallable: () => {},
  },
});

const moveEntities = (entityArray, direction) => {
  entityArray.forEach((entity) => {
    if (entity.direction === "E") {
      entity.moveBy(entity.speed, 0);
    } else if (entity.direction === "SE") {
      // Y component should be positive to go down the page
      entity.moveBy(entity.speed, entity.speed);
    }
  });
};

const drawEntityImage = (canvasContext, entity, imageSizeX, imageSizeY) => {
  // The entity's image MUST be loaded before calling this function
  canvasContext.drawImage(entity.image, entity.x, entity.y, imageSizeX, imageSizeY);
  if (DEBUG_ENTITY_POSITIONS) {
    const oldFont = canvasContext.font;
    canvasContext.font = "18px Courier";
    canvasContext.fillText(`(${entity.x}, ${entity.y})`, entity.x - 10, entity.y - 10);
    canvasContext.font = oldFont;
  }
};

const drawEntities = (canvasContext, entityArray) => {
  entityArray.forEach((entity) => {
    drawEntityImage(canvasContext, entity, entity.sizeX, entity.sizeY);
  });
};

const updateEntitiesFromArray = (canvasContext, entityArray) => {
  moveEntities(entityArray);
  drawEntities(canvasContext, entityArray);
  const boundaryData = {
    canvasHeight: canvasContext.canvas.height,
    canvasWidth: canvasContext.canvas.width,
  };
  garbageCollectEntityArray(entityArray, boundaryData, 20000);
};

const fishArray = new Array();
const starsArray = new Array();
const fishFactory = () => {
  const { fishes } = interestingEntities;
  const fishStartingY = generateRandomNumber(fishes.sizeY, backingCanvasHeight - fishes.sizeY);
  const fishSpeed = generateRandomNumber(3, 8);
  return new Entity(-fishes.sizeX, fishStartingY, fishSpeed, fishes.sizeX, fishes.sizeY, fishes.image);
};

const starFactory = () => {
  const { shootingStars } = interestingEntities;
  const starStartingX = generateRandomNumber(0, backingCanvasWidth / 2);
  const starStartingY = -shootingStars.sizeY;
  const starFallSpeed = generateRandomNumber(5, 12);
  return new Entity(
    starStartingX,
    starStartingY,
    starFallSpeed,
    shootingStars.sizeX,
    shootingStars.sizeY,
    shootingStars.image,
    "SE"
  );
};

const addRandomEntity = (entityArray, entityFactory) => {
  entityArray.push(entityFactory());
};

const addSchoolOfFish = () => {
  let i = 0;
  while (i < 7) {
    addRandomEntity(fishArray, fishFactory);
    i += 1;
  }
};

const addConstellationOfStars = () => {
  let i = 0;
  while (i < 7) {
    addRandomEntity(starsArray, starFactory);
    i += 1;
  }
};

const somethingInterestingHappens = () => {
  if (generateRandomNumber(1, 100) < 20) {
    addSchoolOfFish();
  } else if (generateRandomNumber(1, 100) > 80) {
    addConstellationOfStars();
  }
};

const corruptions = new Array();
const corruptLocation = (x, y) => {
  const corruptCharacters = ["░", "▒", "▓", "█", "└", "┬", "┼", "°", "ƒ"];

  corruptions.push({
    x: x,
    y: y,
    character: randomElement(corruptCharacters),
  });
};

const corruptRandomLocation = (canvasContext) => {
  const randomX = generateRandomNumber(1, canvasContext.canvas.width);
  const randomY = generateRandomNumber(1, canvasContext.canvas.height);
  corruptLocation(randomX, randomY);
};

const drawCorruptions = (canvasContext) => {
  corruptions.forEach((corruption) => {
    canvasContext.fillText(corruption.character, corruption.x, corruption.y);
  });
};

const linkRunningLeftSequence = new SpriteSequence(
  "linkRunningLeft",
  "media/link-sprites.png",
  [
    {
      corner: {
        x: 241,
        y: 30,
      },
      size: {
        x: 19,
        y: 24,
      },
    },
    {
      corner: {
        x: 272,
        y: 30,
      },
      size: {
        x: 18,
        y: 24,
      },
    },
    {
      corner: {
        x: 301,
        y: 30,
      },
      size: {
        x: 19,
        y: 23,
      },
    },
    {
      corner: {
        x: 331,
        y: 30,
      },
      size: {
        x: 19,
        y: 23,
      },
    },
    {
      corner: {
        x: 361,
        y: 30,
      },
      size: {
        x: 19,
        y: 24,
      },
    },
    {
      corner: {
        x: 392,
        y: 30,
      },
      size: {
        x: 18,
        y: 24,
      },
    },
  ],
  4
);

const linkRunningRightSequence = new SpriteSequence(
  "linkRunningRight",
  "media/link-sprites.png",
  [
    {
      corner: {
        x: 240,
        y: 120,
      },
      size: {
        x: 20,
        y: 24,
      },
    },
    {
      corner: {
        x: 271,
        y: 120,
      },
      size: {
        x: 20,
        y: 24,
      },
    },
    {
      corner: {
        x: 300,
        y: 120,
      },
      size: {
        x: 20,
        y: 24,
      },
    },
    {
      corner: {
        x: 330,
        y: 120,
      },
      size: {
        x: 20,
        y: 24,
      },
    },
    {
      corner: {
        x: 360,
        y: 120,
      },
      size: {
        x: 20,
        y: 24,
      },
    },
    {
      corner: {
        x: 391,
        y: 120,
      },
      size: {
        x: 20,
        y: 24,
      },
    },
  ],
  8
);

const allSprites = new Array();

const update = () => {
  // Clear the canvas so old drawings do not stay.
  headerCanvasContext.clearRect(0, 0, headerCanvasWidth, headerCanvasHeight);
  backingCanvasContext.clearRect(0, 0, backingCanvasWidth, backingCanvasHeight);
  drawFrame();
  moveBubbles();
  drawBubbles();
  garbageCollectBubbles();
  drawName();
  [fishArray, starsArray].forEach((entityArray) => {
    updateEntitiesFromArray(backingCanvasContext, entityArray);
  });
  drawCorruptions(backingCanvasContext);
  allSprites.forEach((sprite) => {
    sprite.drawCurrentState(backingCanvasContext);
  });
};

const jumbleCursor = () => {
  const cursorStyles = ["crosshair", "auto"];
  const randomCursorStyle = randomElement(cursorStyles);
  document.body.style.cursor = randomCursorStyle;
};

const resetCursor = () => {
  document.body.style.cursor = "auto";
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

  // I wonder what will happen?
  window.setInterval(somethingInterestingHappens, 60000);

  window.setInterval(jumbleCursor, 120000);

  window.setInterval(() => {
    corruptRandomLocation(backingCanvasContext);
  }, 10000);

  const linkSprite = new Sprite(10, 10);
  // linkSprite.addSpriteSequence(linkRunningLeftSequence);
  linkSprite.addSpriteSequence(linkRunningRightSequence);
  linkSprite.setCurrentState(linkRunningRightSequence);
  allSprites.push(linkSprite);

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
