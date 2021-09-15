import { distance, drawCircle, drawDisc, garbageCollectObjects, randomInt, drawRectangle } from "../common.js";

// We need to chill with the DOM to warn our user about cookies.
const cookieBanner = document.getElementById("cookie-banner");
const cookieCloseButton = document.getElementById("close");
const cookieBailButton = document.getElementById("noway");
if (localStorage.getItem("cookieSeenOvershoot") === "shown") {
  cookieBanner.style.display = "none";
}

cookieCloseButton.onclick = () => {
  cookieBanner.style.display = "none";
  localStorage.setItem("cookieSeenOvershoot", "shown");
};

cookieBailButton.onclick = () => {
  location.href = "index.html";
};

// Things we want to be global

let canvas = document.getElementById("mainCanvas");
let canvasContext = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

let { left: canvasLeftEdgeX, top: canvasTopEdgeY } = canvas.getBoundingClientRect();

// Magic numbers
const statusBarHeight = 50;
const gravity = -9.8;
const roughFrameRate = 1 / 60;
let aimAdjustInterval = 0.03;
let launchPowerDivisor = 0.2;

// User data!
const setUpGameData = () => {
  let data = {
    numbers: ["ammunitionDeltaOS", "powerDeltaOS", "lootOS"],
    upgrades: ["moreProjectilesOS", "biggerAmmoOS"],
  };
  data.numbers.forEach((numericValue) => {
    if (localStorage.getItem(numericValue) === null) {
      localStorage.setItem(numericValue, 0);
    }
  });
  data.upgrades.forEach((upgrade) => {
    if (localStorage.getItem(upgrade) === null) {
      localStorage.setItem(upgrade, false);
    }
  });
};

setUpGameData();

// Status stuff
let controlsPaused = false;

const GameInterfaces = Object.freeze({
  mainMenu: "mainMenu",
  levelSelect: "levelSelect",
  shop: "shop",
  battlefield: "battlefield",
});

let currentInterface = GameInterfaces.mainMenu;

// This kind of thing really sucks and needs refactored. I think there should probably be
// a menu icon class that gets drawn, one size fits all, yada yada, and has definite bounds,
// and a function? that draws something inside it
const mainMenuTargetPracticeLocationX = 100;
const mainMenuTargetPracticeLocationY = 75;
const mainMenuTargetPracticeSizeX = 100;
const mainMenuTargetPracticeSizeY = 100;
const drawMainMenu = (canvasContext) => {
  // Drawing the target practice button
  canvasContext.strokeRect(
    mainMenuTargetPracticeLocationX,
    mainMenuTargetPracticeLocationY,
    mainMenuTargetPracticeSizeX,
    mainMenuTargetPracticeSizeY
  );
  drawTarget(
    canvasContext,
    mainMenuTargetPracticeSizeX / 2 + mainMenuTargetPracticeLocationX,
    mainMenuTargetPracticeSizeY / 2 + mainMenuTargetPracticeLocationY,
    (mainMenuTargetPracticeSizeX + mainMenuTargetPracticeSizeY) / 4
  );
  canvasContext.fillText(
    "Target ",
    mainMenuTargetPracticeSizeX / 2 + mainMenuTargetPracticeLocationX - 15,
    mainMenuTargetPracticeSizeY / 2 + mainMenuTargetPracticeLocationY
  );
  canvasContext.fillText(
    "Practice!",
    mainMenuTargetPracticeSizeX / 2 + mainMenuTargetPracticeLocationX - 20,
    mainMenuTargetPracticeSizeY / 2 + mainMenuTargetPracticeLocationY + 10
  );
};

const mainMenuClickHandler = (canvasContext, clickCoordinates) => {
  const { x, y } = clickCoordinates;
  // Yeah this really sucks lol. The menu icon could have a member function that does this
  // so I never have to write this code.
  if (
    x >= mainMenuTargetPracticeLocationX &&
    x <= mainMenuTargetPracticeLocationX + mainMenuTargetPracticeSizeX &&
    y >= mainMenuTargetPracticeLocationY &&
    y <= mainMenuTargetPracticeLocationY + mainMenuTargetPracticeSizeY
  ) {
    currentInterface = GameInterfaces.battlefield;
  }
};

const levelSelectClickHandler = (canvasContext) => {};

const shopClickHandler = (canvasContext) => {};

const battlefieldClickHandler = () => {
  return;
};

const interfaceClickHandler = (canvasContext, clickEvent) => {
  let clickCoordinates = {
    x: clickEvent.clientX - canvasLeftEdgeX,
    y: clickEvent.clientY - canvasTopEdgeY,
  };
  switch (currentInterface) {
    case GameInterfaces.mainMenu:
      mainMenuClickHandler(canvasContext, clickCoordinates);
      break;
    case GameInterfaces.levelSelect:
      levelSelectClickHandler(canvasContext);
      break;
    case GameInterfaces.shop:
      shopClickHandler(canvasContext);
      break;
    case GameInterfaces.battlefield:
      battlefieldClickHandler();
      break;
  }
};

canvas.addEventListener("click", interfaceClickHandler.bind(null, canvasContext));

let onScreenProjectiles = new Array();
let onScreenTargets = new Array();

const InputKeys = {
  space: 32,
  lshift: 16,
  up: 38,
  down: 40,
  enter: 13,
};

// Some day, especially if I try to make a multiplayer game,
// this class will probably be a subclass to whatever the player
// characters are. For now, I guess it's not the worst thing ever
// that it's out here.
class Input {
  constructor() {
    this.space = false;
    this.firedFlag = false;
    this.up = false;
    this.down = false;
    this.enter = false;
    this.lshift = false;

    this.register();
  }

  changeInputByEventType = (eventType) => {
    if (eventType === "keydown") {
      return true;
    } else if (eventType === "keyup") {
      return false;
    }
  };

  register() {
    window.addEventListener("keydown", this.keySwitch);
    window.addEventListener("keyup", this.keySwitch);
  }

  // a function for telling which key we pressed
  keySwitch = (keyPressEvent) => {
    // We've been handed an event containing a keypress.
    // What key is it that was pressed?
    const keyCode = keyPressEvent.keyCode;
    const eventType = keyPressEvent.type;

    switch (keyCode) {
      case InputKeys.space:
        this.space = this.changeInputByEventType(eventType);
        // When we release the space bar, we should set a flag that we can
        // retrieve later when we're firing -- that means we're done charging
        // up, and it's time to release our projectile.
        if (eventType === "keyup") {
          this.firedFlag = true;
        }
        break;
      case InputKeys.up:
        this.up = this.changeInputByEventType(eventType);
        break;
      case InputKeys.down:
        this.down = this.changeInputByEventType(eventType);
        break;
      case InputKeys.enter:
        this.enter = this.changeInputByEventType(eventType);
        break;
      case InputKeys.lshift:
        this.shift = this.changeInputByEventType(eventType);
        break;
    }
  };
}

class Target {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

const drawTarget = (canvasContext, x, y, r) => {
  const oldFillStyle = canvasContext.fillStyle;
  // We want to alternate colours between white and red,
  // starting with red. We can do so with a quick parity
  // check based on the ring count.
  for (let i = 1; i <= 4; i++) {
    canvasContext.fillStyle = i % 2 === 0 ? "white" : "red";
    drawDisc(canvasContext, x, y, r - 4 * i);
    canvasContext.fillStyle = oldFillStyle;
  }
};

class Catapult {
  constructor(x, y, angle, size, ammoCount) {
    this.x = x;
    this.y = y;
    this.angle = angle || 0;
    this.size = size || 1;

    this.ammoCount = ammoCount || 3;

    this.launchingPower = 0;
    this.lastPowerChange = 0; // Becomes date time
    this.powerChangeDebounceTime = 0.1; // ms
    this.maxPower = 100;
    this.fired = false;
  }

  aimAdjust(da) {
    this.angle += da;
  }

  powerAdjust(dP, reset) {
    if (Date.now() - this.lastPowerChange > this.powerChangeDebounceTime) {
      if (reset !== true) {
        // Don't let use exceed max power. Just set to max instead.
        if (this.launchingPower + dP > this.maxPower) {
          this.launchingPower = this.maxPower;
        } else {
          this.launchingPower += dP;
        }
        // Reset flag allows us to just update power to 0.
      } else {
        this.launchingPower = 0;
      }
      // Set this so that we can debounce.
      this.lastPowerChange = Date.now();
    }
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  get catapultState() {
    return {
      x: this.x,
      y: this.y,
      angle: this.angle,
    };
  }
}

class Projectile {
  constructor(x, y, size, v0, a0) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.r = this.size;
    this.v0 = v0; // Initial velocity
    this.a0 = a0; // Initial Angle
    this.t = 0;

    this.queueDeletion = false;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  adjustPosition() {
    this.t += roughFrameRate;
    this.x += this.v0 * Math.cos(this.a0) * this.t;
    // The sign for the addition on the y term is positive here because of our reference
    // frame. The origin is in the _top_ left, not the bottom left, so the math is
    // slightly goofy. The x term is the same, because x is still increasing left-to-right.
    this.y += this.t * this.v0 * Math.sin(this.a0) - 0.5 * gravity * Math.pow(this.t, 2);
    // If we're off screen to the right or the bottom, we should get garbage collected
    if (this.x > canvasWidth || this.y > canvasHeight) {
      this.queueDeletion = true;
    }
  }
}

const fireCatapult = (catapult) => {
  // If we're not already in the middle of firing,
  if (controlsPaused !== true && catapult.ammoCount > 0) {
    onScreenProjectiles.push(
      new Projectile(
        catapult.x,
        // This should prolly be constantized, but meh. It's the location of
        // the top bolt.
        catapult.y - 10 * playerCatapult.size + 2,
        catapult.size,
        // If we don't reduce this a touch, it's too fast, lol.
        catapult.launchingPower * launchPowerDivisor,
        catapult.angle
      )
    );
    catapult.ammoCount -= 1;
    controlsPaused = true;
  }
};

const updateCatapultFromInput = (inputObject, catapult) => {
  if (onScreenProjectiles.length === 0) {
    controlsPaused = false;
  }
  if (controlsPaused !== true) {
    if (inputObject.up === true) {
      // Make sure we don't go too far overhead
      if (catapult.angle - aimAdjustInterval < -Math.PI / 2) {
        catapult.angle = -Math.PI / 2;
      } else {
        catapult.aimAdjust(-aimAdjustInterval);
      }
    }
    if (inputObject.down === true) {
      // Make sure we don't go too far out front
      if (catapult.angle + aimAdjustInterval > 0) {
        catapult.angle = 0;
      } else {
        catapult.aimAdjust(aimAdjustInterval);
      }
    }
    // If we're holding the space key, let's try to adjust the
    // catapult's launching power.
    if (inputObject.space === true) {
      catapult.powerAdjust(1);
      // Otherwise, we aren't holding the space key.
    } else {
      if (inputObject.firedFlag === true) {
        fireCatapult(catapult);
        inputObject.firedFlag = false;
      }
      // Don't poweradjust to 0 unless we have to. There's
      // more compute involved there. We would rather do a simple
      // check here to see if we're already at 0.
      if (catapult.launchingPower !== 0) {
        catapult.powerAdjust(0, true);
      }
    }
  }
};

const updateGlobalEnvironmentFromInput = (inputObject) => {
  // Enable precision aiming
  if (inputObject.shift === true) {
    aimAdjustInterval = 0.003;
  } else {
    aimAdjustInterval = 0.03;
  }
};

const drawCatapultFrame = (canvasContext, catapult) => {
  let { x: catapultX, y: catapultY } = catapult.coordinates;
  let catapultSize = catapult.size;
  let baseStart = {
    x: catapultX - 12 * catapultSize,
    y: catapultY - 3 * catapultSize,
  };
  let baseFinish = {
    x: catapultX + 12 * catapultSize,
    // This is just Y because the coordinates of the catapult
    // point to the very center at the very bottom.
    y: catapultY,
  };
  drawRectangle(canvasContext, baseStart, baseFinish);

  let pillarStart = {
    x: catapultX + 1 * catapultSize,
    y: catapultY - 12 * catapultSize,
  };
  let pillarFinish = {
    x: catapultX + 4 * catapultSize,
    y: catapultY - 3 * catapultSize,
  };
  drawRectangle(canvasContext, pillarStart, pillarFinish);

  // Drawing the braces on the front
  canvasContext.beginPath();
  canvasContext.moveTo(catapultX + 4 * catapultSize, catapultY - 10 * catapultSize);
  canvasContext.lineTo(catapultX + 12 * catapultSize, catapultY - 3 * catapultSize);
  canvasContext.moveTo(catapultX + 4 * catapultSize, catapultY - 8 * catapultSize);
  canvasContext.lineTo(catapultX + 10 * catapultSize, catapultY - 3 * catapultSize);
  canvasContext.stroke();

  // Decorating with some circles
  drawCircle(canvasContext, catapultX + 2 * catapultSize + 2, catapultY - 2 * catapultSize + 2, catapultSize);
  drawCircle(canvasContext, catapultX + 2 * catapultSize + 2, catapultY - 10 * catapultSize + 2, catapultSize);
  drawCircle(canvasContext, catapultX - 10 * catapultSize, catapultY - 2 * catapultSize + 2, catapultSize);
  drawCircle(canvasContext, catapultX + 11 * catapultSize, catapultY - 2 * catapultSize + 2, catapultSize);
};

const drawCatapultArmAndBucket = (canvasContext, catapult) => {
  const { x: catapultX, y: catapultY } = catapult.coordinates;
  const catapultSize = catapult.size;
  const hingeX = catapultX + 2 * catapultSize + 2;
  const hingeY = catapultY - 2 * catapultSize + 2;

  canvasContext.beginPath();

  canvasContext.moveTo(hingeX, hingeY);
  canvasContext.lineTo(hingeX, hingeY - 2 * catapultSize);
  canvasContext.lineTo(hingeX - 10 * catapultSize, hingeY - 10 * catapultSize);
  canvasContext.lineTo(hingeX - 12 * catapultSize, hingeY - 7 * catapultSize);
  canvasContext.lineTo(hingeX - 9 * catapultSize, hingeY - 5 * catapultSize);
  canvasContext.lineTo(hingeX - 7 * catapultSize, hingeY - 6 * catapultSize);
  canvasContext.lineTo(hingeX, hingeY);

  canvasContext.stroke();
};

const drawCatapultAimingLine = (canvasContext, catapult) => {
  const { x: catapultX, y: catapultY } = catapult.coordinates;
  const yAimPoint = catapultY - 10 * catapult.size + 2;

  const catapultSize = catapult.size;
  const angle = catapult.angle;
  const oldStrokeStyle = canvasContext.strokeStyle;
  const oldLineWidth = canvasContext.lineWidth;

  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 3;
  canvasContext.beginPath();
  canvasContext.moveTo(
    catapultX + catapultSize * 14 * Math.cos(angle),
    yAimPoint + catapultSize * 14 * Math.sin(angle)
  );
  canvasContext.lineTo(
    catapultX + catapultSize * 28 * Math.cos(angle),
    yAimPoint + catapultSize * 28 * Math.sin(angle)
  );
  canvasContext.stroke();
  canvasContext.strokeStyle = oldStrokeStyle;
  canvasContext.lineWidth = oldLineWidth;
};

const getRandomTargetLocation = () => {
  // Stick to QI?
  return {
    x: randomInt(canvasWidth / 2, canvasWidth),
    y: randomInt(statusBarHeight, canvasHeight / 2),
  };
};

// An updated version which accounts for the size of both the
// projectile and the entity. This is for projectiles and entities
// that are either circular or that have circular hitboxes, and that
// have a component 'r' representing their radii.
// In addition, it's only going to run through all of the entities
// and projectiles if there's some of each to run through.
const computeCollisions = (projectiles, entities) => {
  if (entities.length > 0 && projectiles.length > 0) {
    entities.forEach((entity) => {
      projectiles.forEach((projectile) => {
        if (distance(projectile, entity) - projectile.r - entity.r <= 0) {
          projectile.queueDeletion = true;
          entity.queueDeletion = true;
        }
      });
    });
  }
};

// It's definitely not ideal to re-instantiate these variables
// every time the screen is updated!
const statusItemsFont = "12px courier";
const midBarText = statusBarHeight / 2 + 4;
const angleMeterLocationX = 50;
const powerMeterLocationX = 400;
const powerMeterLocationY = statusBarHeight / 2 - 4;
const ammoMeterLocationX = 160;
const drawStatusBar = (canvasContext, playerCatapult) => {
  const oldFillStyle = canvasContext.fillStyle;
  const oldStrokeStyle = canvasContext.strokeStyle;
  const oldFont = canvasContext.font;
  canvasContext.font = statusItemsFont;

  canvasContext.strokeRect(0, 0, canvasWidth, statusBarHeight);

  const convertedAngle = -parseFloat(`${(playerCatapult.angle * 180) / Math.PI}`).toFixed(2);
  canvasContext.fillText(`Angle: ${convertedAngle}°`, angleMeterLocationX, midBarText);

  canvasContext.fillText("Power:", powerMeterLocationX - 50, midBarText);
  const powerBarGradient = canvasContext.createLinearGradient(powerMeterLocationX, 0, powerMeterLocationX + 100, 0);
  powerBarGradient.addColorStop(0.0, "green");
  powerBarGradient.addColorStop(0.333, "yellow");
  powerBarGradient.addColorStop(0.666, "orange");
  powerBarGradient.addColorStop(1.0, "red");
  canvasContext.fillStyle = powerBarGradient;
  canvasContext.fillRect(powerMeterLocationX, powerMeterLocationY, playerCatapult.launchingPower, 10);
  canvasContext.fillStyle = oldFillStyle;

  canvasContext.fillText("Ammo:", ammoMeterLocationX, midBarText);
  for (let i = 1; i <= playerCatapult.ammoCount; i++) {
    drawCircle(canvasContext, ammoMeterLocationX + 35 + 10 * i, midBarText - 3, 3);
  }
  canvasContext.font = oldFont;
};

for (let i = 1; i <= 4; i++) {
  // Destruct & rename
  let { x: randomX, y: randomY } = getRandomTargetLocation();
  onScreenTargets.push(new Target(randomX, randomY, 20));
}

let playerCatapult = new Catapult(75, 600, 0, 4, 6);
let playerInput = new Input();

const drawBattleField = () => {
  updateGlobalEnvironmentFromInput(playerInput);
  updateCatapultFromInput(playerInput, playerCatapult);

  drawStatusBar(canvasContext, playerCatapult);
  drawCatapultFrame(canvasContext, playerCatapult);
  drawCatapultArmAndBucket(canvasContext, playerCatapult);
  drawCatapultAimingLine(canvasContext, playerCatapult);

  onScreenTargets.map((target) => {
    drawTarget(canvasContext, target.x, target.y, target.r);
  });

  onScreenProjectiles.map((projectile) => {
    projectile.adjustPosition();
    drawCircle(canvasContext, projectile.x, projectile.y, projectile.size);
  });
  computeCollisions(onScreenProjectiles, onScreenTargets);
  garbageCollectObjects(onScreenProjectiles);
  garbageCollectObjects(onScreenTargets);
};

const update = () => {
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  if (currentInterface === null) {
    currentInterface = GameInterfaces.mainMenu;
  }
  if (currentInterface === GameInterfaces.mainMenu) {
    drawMainMenu(canvasContext);
  } else if (currentInterface === GameInterfaces.battlefield) {
    drawBattleField();
  }
};

(() => {
  let animationFrameRequestToken;
  const main = (hiResTimeStamp) => {
    animationFrameRequestToken = window.requestAnimationFrame(main);

    update();
  };
  main();
})();
