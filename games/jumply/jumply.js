import {
  distance,
  drawCircle,
  drawDisc,
  drawSquare,
  garbageCollectObjects,
  getObjectFromLocalStorage,
  putObjectToLocalStorage,
  randomInt,
  drawRectangle,
} from "../common.js";

import { InputKeys } from "../constants.js";
// We need to chill with the DOM to warn our user about cookies.
const cookieBanner = document.getElementById("cookie-banner");
const cookieCloseButton = document.getElementById("close");
const cookieBailButton = document.getElementById("noway");
if (localStorage.getItem("cookieSeenJumply") === "shown") {
  cookieBanner.style.display = "none";
}

cookieCloseButton.onclick = () => {
  cookieBanner.style.display = "none";
  localStorage.setItem("cookieSeenJumply", "shown");
};

cookieBailButton.onclick = () => {
  location.href = "index.html";
};

// Module Constants
const PLAYERSIZE = 20;

// Globals

let canvas = document.getElementById("mainCanvas");
let globalContext = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

let { left: canvasLeftEdgeX, top: canvasTopEdgeY } = canvas.getBoundingClientRect();

class Input {
  constructor() {
    this.right = false;
    this.left = false;
    this.jumping = false;

    this.register();
  }
  changeInputByEventType = (eventType) => {
    if (eventType === "keydown") {
      return true;
    } else if (eventType === "keyup") {
      return false;
    }
  };

  register = () => {
    // Add the listeners for keyboard usage.
    window.addEventListener("keydown", this.keySwitch);
    window.addEventListener("keyup", this.keySwitch);
  };

  // Which key did we press?
  keySwitch = (keyPressEvent) => {
    const keyCode = keyPressEvent.keyCode;
    const eventType = keyPressEvent.type;
    switch (keyCode) {
      case InputKeys.A:
        this.left = this.changeInputByEventType(eventType);
        break;
      case InputKeys.L:
        this.left = this.changeInputByEventType(eventType);
        break;
      case InputKeys.D:
        this.right = this.changeInputByEventType(eventType);
        break;
      case InputKeys.R:
        this.right = this.changeInputByEventType(eventType);
        break;
      case InputKeys.space:
        this.space = this.changeInputByEventType(eventType);
        break;
    }
  };
}

class Character {
  constructor(x, y, size, color) {
    this.speed = 5;
    this.size = size || PLAYERSIZE;
    this.color = color || "rgb(67, 179, 174)";
    this.x = x;
    this.y = y;
    this.jumping = false;
    this.queueDeletion = false;
  }

  set characterSpeed(newSpeed) {
    this.speed = newSpeed;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  get hitBoxDetails() {
    return {
      x: this.x + this.size,
      y: this.y + this.size,
      size: 1 + this.size,
    };
  }

  moveBy(dx) {
    // Don't let the player leave the boundaries using simple checks.
    // Just checking for this.x < canvasWidth won't let us move if we
    // hit the boundary. We need to check to see if where we're _going_
    // is inside the boundary or not.
    let rightBoundary = this.size;
    if (this.x + rightBoundary + dx <= canvasWidth && this.x + dx >= 0) {
      this.x += dx;
    }
  }

  draw(canvasContext) {
    const originalStyle = canvasContext.strokeStyle;
    let oldWidth = canvasContext.lineWidth;
    canvasContext.strokeStyle = this.color;
    canvasContext.lineWidth = 3;
    drawSquare(canvasContext, this.x, this.y, this.size);
    canvasContext.strokeStyle = originalStyle;
    canvasContext.lineWidth = oldWidth;
  }
}

class Player extends Character {
  constructor(x, y, size, color) {
    super(x, y, size, color);
    this.health = 3;
    this.input = new Input();
    this.jumpTimer;
  }
  update(t) {
    if (!t) {
      t = 1;
    }
    if (this.input.right === true) {
      this.moveBy(this.speed * t);
    }
    if (this.input.left === true) {
      this.moveBy(-this.speed * t);
    }
    if (this.input.space === true && this.jumping === false) {
      console.log("NOW JUMPING");
      this.jumpTimer = new Date().getTime();
      this.jumping = true;
    }
    if (this.jumping === true) {
      const tStep = new Date().getTime() - this.jumpTimer;
      this.moveBy(tStep, -Math.pow(tStep - this.speed, 2) + this.speed);
    }
  }
}

let playerCharacter = new Player(5, canvasHeight - PLAYERSIZE, PLAYERSIZE, "rgb(255,0,255)");

const update = (t) => {
  globalContext.clearRect(0, 0, canvasWidth, canvasHeight);
  playerCharacter.update(t);
  playerCharacter.draw(globalContext);
};

(() => {
  let animationFrameRequestToken;
  let lastTime;
  const main = (hiResTimeStamp) => {
    animationFrameRequestToken = window.requestAnimationFrame(main);
    const tsNow = new Date().getTime();
    const timeDiffMs = (tsNow - lastTime) / 10;
    update(timeDiffMs);
    lastTime = tsNow;
  };
  main();
})();
