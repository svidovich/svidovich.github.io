import { drawCircle, drawDisc, randomInt, drawRectangle } from "../common.js";

let canvas = document.getElementById("mainCanvas");
let canvasContext = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

// Magic numbers
const statusBarHeight = 50;

const InputKeys = {
  space: 32,
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
    this.up = false;
    this.down = false;
    this.enter = false;

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
    }
  };
}

class Target {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

const drawTarget = (canvasContext, x, y) => {
  const oldFillStyle = canvasContext.fillStyle;
  // We want to alternate colours between white and red,
  // starting with red. We can do so with a quick parity
  // check based on the ring count.
  for (let i = 1; i <= 4; i++) {
    canvasContext.fillStyle = i % 2 === 0 ? "white" : "red";
    drawDisc(canvasContext, x, y, 20 - 4 * i);
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

const updateCatapultFromInput = (inputObject, catapult) => {
  if (inputObject.up === true) {
    if (catapult.angle - 0.03 < -Math.PI / 2) {
      catapult.angle = -Math.PI / 2;
    } else {
      catapult.aimAdjust(-0.03);
    }
  }
  if (inputObject.down === true) {
    if (catapult.angle + 0.03 > 0) {
      catapult.angle = 0;
    } else {
      catapult.aimAdjust(0.03);
    }
  }
  // If we're holding the space key, let's try to adjust the
  // catapult's launching power.
  if (inputObject.space === true) {
    catapult.powerAdjust(1);
    // Otherwise, we aren't holding the space key.
  } else {
    // Don't poweradjust to 0 unless we have to. There's
    // more compute involved there. We would rather do a simple
    // check here to see if we're already at 0.
    if (catapult.launchingPower !== 0) {
      catapult.powerAdjust(0, true);
    }
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

const drawCatapultAimingLine = (canvasContext, catapult) => {
  const { x: catapultX, y: catapultY } = catapult.coordinates;
  const catapultSize = catapult.size;
  const angle = catapult.angle;
  const oldStrokeStyle = canvasContext.strokeStyle;
  const oldLineWidth = canvasContext.lineWidth;

  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 3;
  canvasContext.beginPath();
  //   canvasContext.moveTo(catapultX, catapultY);
  canvasContext.moveTo(
    catapultX + catapultSize * 14 * Math.cos(angle),
    catapultY + catapultSize * 14 * Math.sin(angle)
  );
  canvasContext.lineTo(
    catapultX + catapultSize * 22 * Math.cos(angle),
    catapultY + catapultSize * 22 * Math.sin(angle)
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

const statusItemsFont = "12px courier";
const drawStatusBar = (canvasContext, playerCatapult) => {
  const oldFillStyle = canvasContext.fillStyle;
  const oldStrokeStyle = canvasContext.strokeStyle;
  const oldFont = canvasContext.font;
  canvasContext.font = statusItemsFont;

  canvasContext.strokeRect(0, 0, canvasWidth, statusBarHeight);

  const midBarText = statusBarHeight / 2 + 4;

  const angleMeterLocationX = 50;

  const convertedAngle = -parseFloat(`${(playerCatapult.angle * 180) / Math.PI}`).toFixed(2);
  canvasContext.fillText(`Angle: ${convertedAngle}°`, angleMeterLocationX, midBarText);

  const powerMeterLocationX = 400;
  const powerMeterLocationY = statusBarHeight / 2 - 4;
  canvasContext.fillText("Power:", powerMeterLocationX - 50, midBarText);
  const powerBarGradient = canvasContext.createLinearGradient(powerMeterLocationX, 0, powerMeterLocationX + 100, 0);
  powerBarGradient.addColorStop(0.0, "green");
  powerBarGradient.addColorStop(0.333, "yellow");
  powerBarGradient.addColorStop(0.666, "orange");
  powerBarGradient.addColorStop(1.0, "red");
  canvasContext.fillStyle = powerBarGradient;
  canvasContext.fillRect(powerMeterLocationX, powerMeterLocationY, playerCatapult.launchingPower, 10);
  canvasContext.fillStyle = oldFillStyle;

  const ammoMeterLocationX = 160;
  canvasContext.fillText("Ammo:", ammoMeterLocationX, midBarText);
  for (let i = 1; i <= playerCatapult.ammoCount; i++) {
    drawCircle(canvasContext, ammoMeterLocationX + 35 + 10 * i, midBarText - 3, 3);
  }

  canvas.fillStyle = canvasContext.font = oldFont;
};

// Destruct & rename
let { x: randomX, y: randomY } = getRandomTargetLocation();
let myRandomTarget = new Target(randomX, randomY);

let playerCatapult = new Catapult(100, 500, 0, 4);
let playerInput = new Input();

const update = () => {
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

  updateCatapultFromInput(playerInput, playerCatapult);
  drawStatusBar(canvasContext, playerCatapult);
  drawTarget(canvasContext, myRandomTarget.x, myRandomTarget.y);
  drawCatapultFrame(canvasContext, playerCatapult);
  drawCatapultAimingLine(canvasContext, playerCatapult);
};

(() => {
  let animationFrameRequestToken;
  const main = (hiResTimeStamp) => {
    animationFrameRequestToken = window.requestAnimationFrame(main);

    update();
  };
  main();
})();
