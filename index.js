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

let workExperienceDescriptionDiv = document.getElementById(
  "work-experience-description"
);

const finiteStateHoverable = document.getElementById("fs-hoverable");
const finiteStateDescription = document.getElementById(
  "fs-work-experience-description"
);
const reachHoverable = document.getElementById("reach-hoverable");
const reachDescription = document.getElementById(
  "reach-work-experience-description"
);

const toggleElementVisibility = (element) => {
  if (element.style.display !== "none") {
    element.style.display = "none";
  } else {
    element.style.display = "block";
  }
};

finiteStateHoverable.addEventListener("click", (event) => {
  if (reachDescription.style.display !== "none") {
    reachDescription.style.display = "none";
  }
  toggleElementVisibility(finiteStateDescription);
});

reachHoverable.addEventListener("click", (event) => {
  if (finiteStateDescription.style.display !== "none") {
    finiteStateDescription.style.display = "none";
  }
  toggleElementVisibility(reachDescription);
});

// From here down we're doing cool canvas stuff
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const generateRandomNumber = (min, max) => {
  return Math.floor(
    Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min)
  );
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
  nameFontState.r =
    (nameFontState.r +
      NAME_COLOR_CHANGE_QUANTITY *
        coinFlipSign() *
        generateRandomNumber(1, 4)) %
    255;
  nameFontState.g =
    (nameFontState.g +
      NAME_COLOR_CHANGE_QUANTITY *
        coinFlipSign() *
        generateRandomNumber(1, 4)) %
    255;
  nameFontState.b =
    (nameFontState.b +
      NAME_COLOR_CHANGE_QUANTITY *
        coinFlipSign() *
        generateRandomNumber(1, 4)) %
    255;
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
  headerCanvasContext.fillText(
    "Samuel Vidovich",
    headerCanvasWidth / 3,
    headerCanvasHeight / 2
  );
  if (anaglyphNameActive) {
    let xOffset = generateRandomNumber(2, 4);
    let yOffset = generateRandomNumber(2, 4);
    headerCanvasContext.fillStyle = `rgb(255, 0, 0)`;
    headerCanvasContext.fillText(
      "Samuel Vidovich",
      headerCanvasWidth / 3 - xOffset,
      headerCanvasHeight / 2 - yOffset
    );
    headerCanvasContext.fillStyle = `rgb(0, 255, 255)`;
    headerCanvasContext.fillText(
      "Samuel Vidovich",
      headerCanvasWidth / 3 + xOffset,
      headerCanvasHeight / 2 + yOffset
    );
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
    this.x = x;
    this.y = y;
    this.speed = [0, 0];
  }

  moveBy(vector2d) {
    const [dx, dy] = vector2d;
    this.x += dx;
    this.y += dy;
  }

  getCurrentState() {
    return this.currentState;
  }

  setCurrentState(sequence) {
    this.currentState = sequence;
  }

  setSpeed(vector2d) {
    this.speed = vector2d;
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
  const randomBubbleColor = `rgb(${generateRandomNumber(
    1,
    255
  )}, ${generateRandomNumber(1, 255)}, ${generateRandomNumber(1, 255)})`;
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
  if (!document.hidden) {
    bubblesArray.push(randomBubbleFactory());
  }
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
      headerCanvasContext.arc(
        bubble.x - xOffset,
        bubble.y - yOffset,
        bubble.r,
        0,
        2 * Math.PI
      );
      headerCanvasContext.stroke();
      headerCanvasContext.beginPath();
      headerCanvasContext.strokeStyle = `rgb(0, 255, 255)`;
      headerCanvasContext.arc(
        bubble.x + xOffset,
        bubble.y + yOffset,
        bubble.r,
        0,
        2 * Math.PI
      );
      headerCanvasContext.stroke();
    }
  } else {
    headerCanvasContext.strokeRect(bubble.x, bubble.y, bubble.r, bubble.r);
    if (ANAGLYPH_SHAPES && anaglyphNameActive) {
      let xOffset = generateRandomNumber(2, 4);
      let yOffset = generateRandomNumber(2, 4);
      headerCanvasContext.strokeStyle = `rgb(255, 0, 0)`;
      headerCanvasContext.strokeRect(
        bubble.x - xOffset,
        bubble.y + yOffset,
        bubble.r,
        bubble.r
      );
      headerCanvasContext.strokeStyle = `rgb(0, 255, 255)`;
      headerCanvasContext.strokeRect(
        bubble.x + xOffset,
        bubble.y + yOffset,
        bubble.r,
        bubble.r
      );
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

const garbageCollectEntityArray = (
  entityArray,
  canvasBoundaries,
  maxEntityAge
) => {
  // I guess we're assuming that all entities are moving left-to-right.
  const toBeDestroyed = new Array();
  const { canvasHeight, canvasWidth } = canvasBoundaries;
  entityArray.forEach((entity) => {
    if (entity.x - entity.sizeX - 1 > canvasWidth) {
      toBeDestroyed.push(entity);
    } else if (
      Date.now() - entity.createdAt >
      (maxEntityAge || ENTITY_DEFAULT_MAX_AGE_MS)
    ) {
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
  canvasContext.drawImage(
    entity.image,
    entity.x,
    entity.y,
    imageSizeX,
    imageSizeY
  );
  if (DEBUG_ENTITY_POSITIONS) {
    const oldFont = canvasContext.font;
    canvasContext.font = "18px Courier";
    canvasContext.fillText(
      `(${entity.x}, ${entity.y})`,
      entity.x - 10,
      entity.y - 10
    );
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
  const fishStartingY = generateRandomNumber(
    fishes.sizeY,
    backingCanvasHeight - fishes.sizeY
  );
  const fishSpeed = generateRandomNumber(3, 8);
  return new Entity(
    -fishes.sizeX,
    fishStartingY,
    fishSpeed,
    fishes.sizeX,
    fishes.sizeY,
    fishes.image
  );
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
  2
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
  2
);

const redGoriyaRunningRightStep1 = {
  corner: {
    x: 448,
    y: 276,
  },
  size: {
    x: 18,
    y: 25,
  },
};

const redGoriyaRunningRightStep2 = {
  corner: {
    x: 470,
    y: 277,
  },
  size: {
    x: 18,
    y: 24,
  },
};

const redGoriyaRunningRightSequence = new SpriteSequence(
  "redGoriyaRunningRight",
  // Thanks to Bruce Juice for the sprite sheet!
  "media/bruces_alttp_enemy_sprites.png",
  [
    // hack so I don't have to invent... a clock
    redGoriyaRunningRightStep1,
    redGoriyaRunningRightStep1,
    redGoriyaRunningRightStep1,
    redGoriyaRunningRightStep1,
    redGoriyaRunningRightStep1,
    redGoriyaRunningRightStep1,
    redGoriyaRunningRightStep2,
    redGoriyaRunningRightStep2,
    redGoriyaRunningRightStep2,
    redGoriyaRunningRightStep2,
    redGoriyaRunningRightStep2,
    redGoriyaRunningRightStep2,
  ],
  2
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
    // Junk code to move link across the screen
    sprite.moveBy(sprite.speed);
    sprite.drawCurrentState(backingCanvasContext);
    // Junk code to dumpster sprites when they leave the right side
    // I would like to say I'll fix but...
    if (sprite.x - 4 > backingCanvas.width) {
      allSprites.splice(allSprites.indexOf(sprite), 1);
    }
  });
};

const jumbleCursor = () => {
  if (!document.hidden) {
    const cursorStyles = ["crosshair", "auto"];
    const randomCursorStyle = randomElement(cursorStyles);
    document.body.style.cursor = randomCursorStyle;
  }
};

const somethingInterestingHappens = () => {
  if (!document.hidden) {
    const randomRoll = generateRandomNumber(1, 100);
    if (randomRoll < 20) {
      addSchoolOfFish();
    } else if (randomRoll > 80) {
      addConstellationOfStars();
    } else if (randomRoll >= 20 && randomRoll <= 40) {
      if (allSprites.length === 0) {
        const linkSprite = new Sprite(-10, generateRandomNumber(15, 700));
        linkSprite.setSpeed([4, 0]);
        linkSprite.addSpriteSequence(linkRunningRightSequence);
        linkSprite.setCurrentState(linkRunningRightSequence);
        allSprites.push(linkSprite);
      }
    } else if (randomRoll > 40 && randomRoll <= 80) {
      if (allSprites.length === 0) {
        const goriya = new Sprite(-10, generateRandomNumber(15, 700));
        goriya.addSpriteSequence(redGoriyaRunningRightSequence);
        goriya.setCurrentState(redGoriyaRunningRightSequence);
        goriya.setSpeed([4, 0]);
        allSprites.push(goriya);
      }
    }
  }
};

const COMMIT_HISTORY_ENDPOINT_URI =
  "https://api.github.com/repos/svidovich/svidovich.github.io/commits";

const COMMIT_LINK_PREFIX =
  "https://github.com/svidovich/svidovich.github.io/commit";
const fillLatestCommits = async (count) => {
  const changelogTable = document.getElementById("changelog");
  const commitHistoryResponse = await fetch(COMMIT_HISTORY_ENDPOINT_URI);

  if (!commitHistoryResponse.ok) {
    throw new Error(
      `Github 'sploded with a uhhh ${commitHistoryResponse.status}. Not much we can do to build changelog. Sad ;(`
    );
  }
  const commitHistory = await commitHistoryResponse.json();

  const latest = commitHistory.slice(0, count);
  latest.forEach((commit) => {
    // Create a row to put into the table
    const thisCommitRow = document.createElement("tr");

    // It contains first the time of the commit,
    const thisCommitTimeTd = document.createElement("td");
    const thisCommitTimeText = document.createTextNode(
      commit.commit.committer.date
    );
    thisCommitTimeTd.style.width = "33%";
    thisCommitTimeTd.appendChild(thisCommitTimeText);
    thisCommitTimeTd.className = "changelogData";

    // Then the commit message!
    const thisCommitMessageTd = document.createElement("td");
    const thisCommitMessagePre = document.createElement("p");
    const thisCommitMessageText = document.createTextNode(
      commit.commit.message
    );
    thisCommitMessageTd.style.width = "50%";
    thisCommitMessageTd.className = "changelogData";
    thisCommitMessagePre.appendChild(thisCommitMessageText);
    thisCommitMessageTd.appendChild(thisCommitMessagePre);

    // Then a link to the commit!
    const thisCommitShaTd = document.createElement("td");
    const thisCommitShaAnchor = document.createElement("a");
    const thisCommitShaText = document.createTextNode("link");
    thisCommitShaAnchor.href = `${COMMIT_LINK_PREFIX}/${commit.sha}`;
    thisCommitShaAnchor.appendChild(thisCommitShaText);
    thisCommitShaAnchor.target = "_blank";
    thisCommitShaTd.appendChild(thisCommitShaAnchor);
    thisCommitShaTd.style.width = "12%";
    thisCommitShaTd.className = "changelogData";

    // Add the table datas to the row,
    thisCommitRow.appendChild(thisCommitTimeTd);
    thisCommitRow.appendChild(thisCommitMessageTd);
    thisCommitRow.appendChild(thisCommitShaTd);

    // Then add the row to the table.
    changelogTable.appendChild(thisCommitRow);
  });
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

  try {
    fillLatestCommits(5).then(
      console.log("Hey programmer! I'm filling out the update log.")
    );
  } catch (err) {
    console.log(`Filling out the commit table didn't go well: ${err}`);
  }

  main = (hiResTimeStamp) => {
    try {
      animationFrameRequestToken = window.requestAnimationFrame(main);
      if (!document.hidden) {
        update();
      }
    } catch (error) {
      console.error(error);
    }
  };
  main();
})();
