// Currently we have 400hx600w to work with
let canvas = document.getElementById("mainCanvas");
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;
let canvasContext = canvas.getContext("2d");

const KEY_UP = "ArrowUp";
const KEY_DOWN = "ArrowDown";
const KEY_LEFT = "ArrowLeft";
const KEY_RIGHT = "ArrowRight";

class Input {
  constructor() {
    this.keys = {};
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    this.keys[event.key] = true;
  }

  handleKeyUp(event) {
    this.keys[event.key] = false;
  }

  isKeyPressed(key) {
    return !!this.keys[key];
  }
}

class SpriteState {
  constructor() {
    this.paths = new Map();
  }

  addDirectionPath(direction, path) {
    this.paths.set(direction, path);
  }

  getPathForDirection(direction) {
    return this.paths.get(direction);
  }
}

class SpritePathSet {
  constructor() {
    this.states = new Map();
  }

  addStatePaths(state, spriteState) {
    this.states.set(state, spriteState);
  }

  getSpriteState(state) {
    return this.states.get(state);
  }
}

class Character {
  constructor(x, y, speed, spritePathSet) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.spritePathSet = spritePathSet;
    this.currentSpriteState = null;
    this.currentDirection = "down";
    this.input = new Input();

    this.loadSprites();
  }

  async loadSprites() {
    const spriteStates = this.spritePathSet.getSpriteStates();
    const sprites = {};

    for (const [state, spriteState] of spriteStates) {
      const stateSprites = {};

      for (const [direction, path] of spriteState.getPathEntries()) {
        try {
          const sprite = await loadImage(path);
          stateSprites[direction] = sprite;
        } catch (error) {
          console.error(`Failed to load sprite for state "${state}", direction "${direction}":`, error);
        }
      }

      sprites[state] = stateSprites;
    }

    this.sprites = sprites;
    this.setSpriteState("idle");
  }

  setSpriteState(state) {
    if (this.sprites[state]) {
      this.currentSpriteState = this.sprites[state];
    } else {
      console.error(`Invalid sprite state: "${state}"`);
    }
  }

  draw() {
    if (this.currentSpriteState && this.currentSpriteState[this.currentDirection]) {
      const currentSprite = this.currentSpriteState[this.currentDirection];
      // Draw the current sprite on the canvas using currentSprite
    }
  }

  updatePosition() {
    // Movement logic here
  }
}

const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (error) => reject(error);
    image.src = src;
  });
};

class Player extends Character {
  constructor(x, y, speed) {
    super(x, y, speed);
    this.input = new Input();
  }

  updatePosition() {
    if (this.input.isKeyPressed(KEY_UP)) {
      this.y -= this.speed;
    }
    if (this.input.isKeyPressed(KEY_DOWN)) {
      this.y += this.speed;
    }
    if (this.input.isKeyPressed(KEY_LEFT)) {
      this.x -= this.speed;
    }
    if (this.input.isKeyPressed(KEY_RIGHT)) {
      this.x += this.speed;
    }
  }
}

const drawCanvasFrame = () => {
  // add some drawing logic
};

// An update function to be called from main.
const update = () => {
  // clear the canvas
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  // draw the frame around the canvas
  drawCanvasFrame(canvasContext);
};

// main is an immediately invoked function expression!
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
