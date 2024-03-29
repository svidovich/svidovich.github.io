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

    this.register();
  }
  // Helps me stay DRY
  changeInputByEventType = (eventType) => {
    if (eventType === "keydown") {
      return true;
    } else if (eventType === "keyup") {
      return false;
    }
  };
  register() {
    // Add the listeners for keyboard usage.
    // Binding allows us to pass arbitrary input objects into the event listener
    // callback.
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
      // Change our input struct depending on the keycode
      case InputKeys.W:
        this.up = this.changeInputByEventType(eventType);
        break;
      case InputKeys.A:
        this.left = this.changeInputByEventType(eventType);
        break;
      case InputKeys.S:
        this.down = this.changeInputByEventType(eventType);
        break;
      case InputKeys.D:
        this.right = this.changeInputByEventType(eventType);
        break;
      case InputKeys.Z:
        this.grow = this.changeInputByEventType(eventType);
        break;
      case InputKeys.X:
        this.shrink = this.changeInputByEventType(eventType);
        break;
      case InputKeys.Q:
        this.quit = true;
        break;
    }
  };
}

playerInput = new Input();

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
    // Don't let the player leave the boundaries using simple checks.
    // Just checking for this.x < canvasWidth won't let us move if we
    // hit the boundary. We need to check to see if where we're _going_
    // is inside the boundary or not.
    if (this.x + dx <= canvasWidth && this.x + dx >= 0) {
      this.x += dx;
    }
    if (this.y + dy <= canvasHeight && this.y + dy >= 0) {
      this.y += dy;
    }
  }
}

// Compliments of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};

class Enemy extends Character {
  constructor(x, y, r, speed) {
    super(x, y, r, speed);
    this.setInMotion();
  }
  setInMotion() {
    let slope = randomInt(-10, 10);
    let ySign = 1;
    // For whatever reason, when I try to use setInterval with this.moveBy,
    // 'this' winds up being null in the caller, which I don't really understand
    // Anyway, this is how we update random movement for the enemies. They just
    // float around.
    setInterval(() => {
      // If we've hit the right or left side, we should reverse our slope. This will
      // cause us to 'bounce off' the side, and start moving in a different direction.
      if (this.x >= canvasWidth || this.x <= 0) {
        slope = -slope;
      }
      // If we've hit the top or bottom, we should reverse the sign of our y value. This
      // will cause us to start moving in the opposite direction with respect to the y
      // axis, which is just a bounce off the top or bottom.
      if (this.y >= canvasHeight || this.y <= 0) {
        ySign = -ySign;
      }
      // Finally, given our computed slope and y sign, whatever they are, update our
      // location.
      this.x += slope;
      this.y += 1 * ySign;
      // I've set the interval here to be rather swift so that we pre-empt the browser
      // framerate. It's very smooth this way.
    }, 50);
  }
}

myCircle = new Character(100, 100, 20, 3);

const randomEnemyFactory = () => {
  let enemySpawnX = randomInt(0, canvasWidth);
  let enemySpawnY = randomInt(0, canvasHeight);
  let enemySize = randomInt(15, 60);
  let enemySpeed = randomInt(1, 6);
  return new Enemy(enemySpawnX, enemySpawnY, enemySize, enemySpeed);
};

let enemyCollection = new Array();
let enemyCount = 12;
for (let i = 0; i < enemyCount; i++) {
  enemyCollection.push(randomEnemyFactory());
}

// anotherCircle = randomEnemyFactory();

const updateCharacterFromInput = (inputObject, characterObject) => {
  // Can this get more DRY?
  if (inputObject.up === true) {
    // because (0,0) is in the top right with
    // y growing as we go down
    characterObject.moveBy(0, -characterObject.speed);
  }
  if (inputObject.down === true) {
    characterObject.moveBy(0, characterObject.speed);
  }
  if (inputObject.right === true) {
    characterObject.moveBy(characterObject.speed, 0);
  }
  if (inputObject.left === true) {
    characterObject.moveBy(-characterObject.speed, 0);
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
  updateCharacterFromInput(playerInput, myCircle);
  drawCircle(canvasContext, myCircle);
  enemyCollection.forEach((enemy) => {
    drawCircle(canvasContext, enemy);
  });
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
    try {
      animationFrameRequestToken = window.requestAnimationFrame(main);

      update();
    } catch (error) {
      console.error(error);
      window.webkitCancelAnimationFrame(animationFrameRequestToken);
    }
  };
  main();
  // This is how you can destroy the loop
  // window.cancelAnimationFrame(animationFrameRequestToken);
})();
