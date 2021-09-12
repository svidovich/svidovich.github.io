import { drawCircle, drawDisc, randomInt, drawRectangle } from "../common.js";

let canvas = document.getElementById("mainCanvas");
let canvasContext = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

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
  constructor(x, y, angle, size) {
    this.x = x;
    this.y = y;
    this.angle = angle || 0;
    this.size = size || 1;
  }

  aimAdjust(da) {
    angle += da;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

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
    y: randomInt(0, canvasHeight / 2),
  };
};

// Destruct & rename
let { x: randomX, y: randomY } = getRandomTargetLocation();
let myRandomTarget = new Target(randomX, randomY);

let myCatapult = new Catapult(100, 500, 0, 4);

const update = () => {
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

  drawTarget(canvasContext, myRandomTarget.x, myRandomTarget.y);
  drawCatapultFrame(canvasContext, myCatapult);
  drawCatapultAimingLine(canvasContext, myCatapult);
  myCatapult.angle += 0.1;
};

(() => {
  let animationFrameRequestToken;
  const main = (hiResTimeStamp) => {
    animationFrameRequestToken = window.requestAnimationFrame(main);

    update();
  };
  main();
})();
