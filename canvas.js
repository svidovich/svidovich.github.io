// Lots of concepts from:
// - https://developer.mozilla.org/en-US/docs/Games/Anatomy
// - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations
// - https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/A_basic_ray-caster

// Currently we have 400hx600w to work with
let canvas = document.getElementById("mainCanvas");
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;
let canvasContext = canvas.getContext("2d");

// Boosted from ray caster
const InputKeys = {
  W: 87, // up!
  A: 65, // left!
  S: 83, // down!
  D: 68, // right!
  Q: 81, // bail!
  Z: 90, // grow!
  X: 88, // shrink!
};

let input = {
  right: false,
  up: false,
  left: false,
  down: false,
  quit: false,
  grow: false,
  shrink: false,
  speedUp: false, // TODO ;)
  speedDown: false, // TODO ;)
};

// Helps me stay DRY
const changeInputByEventType = (eventType) => {
  if (eventType === "keydown") {
    return true;
  } else if (eventType === "keyup") {
    return false;
  }
};

// a function for telling which key we pressed
const keySwitch = (keyPressEvent) => {
  // We've been handed an event containing a keypress.
  // What key is it that was pressed?
  const keyCode = keyPressEvent.keyCode;
  const eventType = keyPressEvent.type;
  switch (keyCode) {
    // Change our input struct depending on the keycode
    case InputKeys.W:
      input.up = changeInputByEventType(eventType);
      break;
    case InputKeys.A:
      input.left = changeInputByEventType(eventType);
      break;
    case InputKeys.S:
      input.down = changeInputByEventType(eventType);
      break;
    case InputKeys.D:
      input.right = changeInputByEventType(eventType);
      break;
    case InputKeys.Z:
      input.grow = changeInputByEventType(eventType);
      break;
    case InputKeys.X:
      input.shrink = changeInputByEventType(eventType);
      break;
    case InputKeys.Q:
      input.quit = true;
      break;
  }
};

// Add the listeners for keyboard usage.
window.addEventListener("keydown", keySwitch);
window.addEventListener("keyup", keySwitch);

// Draws a border around the canvas!
const drawCanvasFrame = (canvasContext) => {
  canvasContext.beginPath();
  canvasContext.moveTo(1, 1);
  canvasContext.lineTo(canvasWidth - 1, 1);
  canvasContext.lineTo(canvasWidth - 1, canvasHeight - 1);
  canvasContext.lineTo(1, canvasHeight - 1);
  canvasContext.lineTo(1, 1);
  canvasContext.stroke();
};

const drawCircle = (canvasContext, x, y, r) => {
  // We must beginPath, otherwise we'll sweep between updates instead
  // of drawing a new circle each time.
  canvasContext.beginPath();
  // void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
  canvasContext.arc(x, y, r, 0, 2 * Math.PI);
  canvasContext.stroke();
};

// I don't think this is how you do this, but it's late.
// Let's research a better way tomorrow.
let myCircleData = {
  x: 100,
  y: 100,
  r: 20,
  speed: 3,
};

// A function to update my circle's data based on input.
const updateCircleFromInput = (inputObject) => {
  // Can this get more DRY?
  if (inputObject.up === true) {
    // because (0,0) is in the top right with
    // y growing as we go down
    myCircleData.y -= myCircleData.speed;
  }
  if (inputObject.down === true) {
    myCircleData.y += myCircleData.speed;
  }
  if (inputObject.right === true) {
    myCircleData.x += myCircleData.speed;
  }
  if (inputObject.left === true) {
    myCircleData.x -= myCircleData.speed;
  }
  if (inputObject.grow === true) {
    myCircleData.r += myCircleData.speed / 2;
  }
  if (inputObject.shrink === true) {
    if (myCircleData.r > 1) {
      myCircleData.r -= myCircleData.speed / 2;
    }
  }
};

// An update function to be called from main.
const update = () => {
  // clear the canvas
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  // draw the frame around the canvas
  drawCanvasFrame(canvasContext);
  // Read the input object to see what's up. Modify
  // the circle state based on the input.
  updateCircleFromInput(input);
  drawCircle(canvasContext, myCircleData.x, myCircleData.y, myCircleData.r);
};

// main is an immediately invoked function expression! google it lol
// when the browser finds this, it interprets it and immediately queues
// it up for run
(() => {
  let animationFrameRequestToken;
  // hiResTimeStamp is of type DOMHighResTimeStamp, and is automatically
  // passed as an arg to main because it's a listed callback of window's
  // requestAnimationFrame
  main = (hiResTimeStamp) => {
    // call requestAnimationFrame first so that the browser receives in
    // early enough to make a plan even if the current frame misses the
    // vsync window. main will always be synced to the framerate because
    // it's always getting placed in the queue next.
    // The animationFrameRequestToken assigned to here is a token that can
    // be used to destroy the animation we're doing. It's a LONG INT. We can
    // call window.cancelAnimationFrame with this token to end the animation.
    animationFrameRequestToken = window.requestAnimationFrame(main);

    update();
  };
  main();
  // This is how you can destroy the loop
  // window.cancelAnimationFrame(animationFrameRequestToken);
})();
