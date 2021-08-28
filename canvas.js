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

class Input {
  // TODO: I should be able to bind specific keys to each of
  // these different actions, so that when I instantiate a new
  // input class, I can set up controls.
  constructor(keycodes) {
    this.right = false;
    this.up = false;
    this.left = false;
    this.down = false;
    this.quit = false;
    this.grow = false;
    this.shrink = false;
    this.speedUp = false;
    this.speedDown = false;
  }
}

// Helps me stay DRY
const changeInputByEventType = (eventType) => {
  if (eventType === "keydown") {
    return true;
  } else if (eventType === "keyup") {
    return false;
  }
};

// a function for telling which key we pressed
const keySwitch = (keyPressEvent, inputObject) => {
  // We've been handed an event containing a keypress.
  // What key is it that was pressed?
  const keyCode = keyPressEvent.keyCode;
  const eventType = keyPressEvent.type;
  switch (keyCode) {
    // Change our input struct depending on the keycode
    case InputKeys.W:
      inputObject.up = changeInputByEventType(eventType);
      break;
    case InputKeys.A:
      inputObject.left = changeInputByEventType(eventType);
      break;
    case InputKeys.S:
      inputObject.down = changeInputByEventType(eventType);
      break;
    case InputKeys.D:
      inputObject.right = changeInputByEventType(eventType);
      break;
    case InputKeys.Z:
      inputObject.grow = changeInputByEventType(eventType);
      break;
    case InputKeys.X:
      inputObject.shrink = changeInputByEventType(eventType);
      break;
    case InputKeys.Q:
      inputObject.quit = true;
      break;
  }
};

playerInput = new Input();

// Add the listeners for keyboard usage.
// Binding allows us to pass arbitrary input objects into the event listener
// callback.
window.addEventListener("keydown", keySwitch.bind(playerInput));
window.addEventListener("keyup", keySwitch.bind(playerInput));

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

const drawCircle = (canvasContext, circleData) => {
  // We must beginPath, otherwise we'll sweep between updates instead
  // of drawing a new circle each time.
  canvasContext.beginPath();
  // void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
  canvasContext.arc(circleData.x, circleData.y, circleData.r, 0, 2 * Math.PI);
  canvasContext.stroke();
};

// A more general representation of a character in space
class Character {
  constructor(x, y, r, speed) {
    this.x = x;
    this.y = y;
    this.r = r; // temporary
    this.speed = speed;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  set setSpeed(s) {
    this.speed = s;
  }

  set setSize(r) {
    this.r = r;
  }

  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}

myCircle = new Character(100, 100, 20, 3);
anotherCircle = new Character(200, 200, 20, 1);

const updateCharacterFromInput = (inputObject, characterObject) => {
  // Can this get more DRY?
  if (inputObject.up === true) {
    // because (0,0) is in the top right with
    // y growing as we go down
    characterObject.y -= characterObject.speed;
  }
  if (inputObject.down === true) {
    characterObject.y += characterObject.speed;
  }
  if (inputObject.right === true) {
    characterObject.x += characterObject.speed;
  }
  if (inputObject.left === true) {
    characterObject.x -= characterObject.speed;
  }
  if (inputObject.grow === true) {
    characterObject.r += characterObject.speed / 2;
  }
  if (inputObject.shrink === true) {
    if (characterObject.r > 1) {
      characterObject.r -= characterObject.speed / 2;
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
  updateCharacterFromInput(input, myCircle);
  drawCircle(canvasContext, myCircle);
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
