import { distance, drawCircle, drawRandomColoredCircle, drawRectangle, drawCanvasFrame, randomInt } from "./common.js";

let canvas = document.getElementById("mainCanvas");
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;
let canvasContext = canvas.getContext("2d");

let playerHealth = 3;

// Maybe this can get influenced by powerups?
let minTimeBetweenPlayerProjectilesMS = 175;
const projectileSpeed = 30;
const projectileSize = 2;

const InputKeys = {
  A: 65, // left!
  D: 68, // right!
  L: 37, // also left!
  R: 39, // also right!
  space: 32, // shoot!
};

class Input {
  constructor() {
    this.right = false;
    this.left = false;
    this.shooting = false;

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
      case InputKeys.A:
        this.left = this.changeInputByEventType(eventType);
        break;
      case InputKeys.D:
        this.right = this.changeInputByEventType(eventType);
        break;
      case InputKeys.L:
        this.left = this.changeInputByEventType(eventType);
        break;
      case InputKeys.R:
        this.right = this.changeInputByEventType(eventType);
        break;
      case InputKeys.space:
        this.shooting = this.changeInputByEventType(eventType);
        break;
    }
  };
}

class Character {
  constructor(x, y, size, color, orientation) {
    this.speed = 5;
    this.size = size || 2;
    this.color = color || "rgb(67, 179, 174)";
    this.x = x;
    this.y = y || canvasHeight - 20;
    this.queueDeletion = false;
    this.orientation = orientation || "down";
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
      x: this.x + 5 * this.size,
      y: this.orientation === "down" ? this.y + 4 * this.size : this.y - 4 * this.size,
      size: 5 * this.size,
    };
  }

  moveBy(dx) {
    // Don't let the player leave the boundaries using simple checks.
    // Just checking for this.x < canvasWidth won't let us move if we
    // hit the boundary. We need to check to see if where we're _going_
    // is inside the boundary or not.
    let rightBoundary = 10 * this.size;
    if (this.x + rightBoundary + dx <= canvasWidth && this.x + dx >= 0) {
      this.x += dx;
    }
  }
}

class Enemy extends Character {
  constructor(x, y, size, color, speed, target) {
    super(x, y, size, color, "down");
    this.target = target || null;
    this.speed = speed || 1;
    this.hunting = setInterval(() => {
      this.hunt();
    }, 60);

    this.shooting = setInterval(() => {
      characterShoot(this, onScreenEnemyProjectiles);
    }, 1000);
  }

  moveBy(dx, dy) {
    let rightBoundary = 10 * this.size;
    if (this.x + rightBoundary + dx <= canvasWidth && this.x + dx >= 0) {
      this.x += dx;
    }
    this.y += dy;
  }

  hunt() {
    if (this.target !== null) {
      let targetHitBoxDetails = this.target.hitBoxDetails;
      let selfHitBoxDetails = this.hitBoxDetails;
      let targetX = targetHitBoxDetails.x;

      // The target y value depends on the target's orientation
      // -- we want to get as close as we can to the tip of the
      // target's ship.
      let targetY =
        this.target.orientation === "up"
          ? targetHitBoxDetails.y - targetHitBoxDetails.size
          : targetHitBoxDetails.y + targetHitBoxDetails.size;

      // Which way we're going depends on the our ship's orientation
      // -- if we're facing up, then we need a different sign than
      // if we were facing down.
      let dySign = this.orientation === "up" ? -1 : 1;
      let dx, dy;

      // If we're close enough to see the whites of their eyes,
      // we probably don't need to get any closer, ya?
      if (Math.abs(selfHitBoxDetails.y - targetY) < 40) {
        dy = 0;
      } else {
        dy = this.speed * dySign;
      }
      // Strafe until we're lined up with the target, then don't
      // bother strafing anymore.
      if (selfHitBoxDetails.x - targetX > 0) {
        dx = -this.speed;
      } else if (selfHitBoxDetails.x - targetX < 0) {
        dx = this.speed;
      } else if (selfHitBoxDetails.x - targetX === 0) {
        dx = 0;
      }
      this.moveBy(dx, dy);
    }
  }
}

class Projectile {
  constructor(x, y, speed, direction, power) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = speed;
    this.power = power || 1;
    this.createdTime = Date.now();
    this.queueDeletion = false;

    this.setInMotion();
  }

  setInMotion() {
    // I'm lifting some of this logic from what I've learned in the
    // bubbles game I made.
    setInterval(() => {
      // If we've hit the top, we need to destroy ourselves.

      if (this.y >= canvasHeight || this.y <= 0) {
        this.queueDeletion = true;
      }
      if (this.direction === "up") {
        this.y -= this.speed;
      } else if (this.direction === "down") {
        this.y += this.speed;
      } else {
        throw new Error(`${this.direction} is not a valid direction.`);
      }
    }, 50);
  }
}

// Handle these separately because ???
const onScreenProjectiles = new Array();
const onScreenEnemyProjectiles = new Array();

const characterShoot = (characterObject, projectilesArray) => {
  let readyToFire = true; // boolean
  let currentProjectileCount = projectilesArray.length;
  // Quick rev limiter for firing. We have a 'created at' timestamp on each of the
  // projectiles on-screen. Since each time we create a new projectile we 'push' to
  // the back of the array, the last element of the array will be the last projectile.
  // If we've made a new projectile too recently, we set 'readyToFire' to false, which
  // causes downstream to not make a new projectile.
  // This can only ever happen if there's a projectile on screen already!
  if (currentProjectileCount > 0) {
    let lastProjectileTime = projectilesArray[currentProjectileCount - 1].createdTime;
    if (Date.now() - lastProjectileTime < minTimeBetweenPlayerProjectilesMS) {
      readyToFire = false;
    }
  }
  if (readyToFire === true) {
    let midpointdx = 5 * characterObject.size;
    let tipY = 9 * characterObject.size;
    const x = characterObject.coordinates.x + midpointdx;
    const y =
      characterObject.orientation === "up"
        ? characterObject.coordinates.y - tipY
        : characterObject.coordinates.y + tipY;
    let firedProjectile = new Projectile(x, y, projectileSpeed, characterObject.orientation);
    projectilesArray.push(firedProjectile);
  }
};

// The objects in the array need to have a 'queueDeletion' property
const garbageCollectObjects = (arrayOfObjects) => {
  arrayOfObjects.forEach((deletableObject) => {
    if (deletableObject.queueDeletion === true) {
      const deletableObjectIndex = arrayOfObjects.indexOf(deletableObject);
      arrayOfObjects.splice(deletableObjectIndex, 1);
    }
  });
};

const updateCharacterFromInput = (inputObject, characterObject) => {
  // Can this get more DRY?
  if (inputObject.right === true) {
    characterObject.moveBy(characterObject.speed);
  }
  if (inputObject.left === true) {
    characterObject.moveBy(-characterObject.speed);
  }
};

const fireLaz0rFromInput = (inputObject, characterObject) => {
  if (inputObject.shooting === true) {
    characterShoot(characterObject, onScreenProjectiles);
  }
};

// Draws a little arrow at x, y.
const drawArrow = (canvasContext, x, y, facing, size, rgbString) => {
  // Facing is going to be hacky. These guys can only face two directions,
  // up and down.
  let tipY;
  let elbowY;
  let scale = size || 1;
  if (facing === "down") {
    tipY = y + 10 * scale;
    elbowY = y + 3 * scale;
  } else if (facing === "up") {
    tipY = y - 9 * scale;
    elbowY = y - 3 * scale;
  } else {
    throw new Error(`${facing} is not a valid facing.`);
  }
  canvasContext.beginPath();
  canvasContext.moveTo(x + 5 * scale, elbowY);
  canvasContext.lineTo(x + 10 * scale, y);
  canvasContext.lineTo(x + 5 * scale, tipY);
  canvasContext.lineTo(x, y);
  canvasContext.lineTo(x + 5 * scale, elbowY);

  let oldStyle = canvasContext.strokeStyle;
  let oldWidth = canvasContext.lineWidth;
  canvasContext.lineWidth = size;
  canvasContext.strokeStyle = rgbString || "black";
  canvasContext.stroke();
  canvasContext.strokeStyle = oldStyle;
  canvasContext.lineWidth = oldWidth;
};

const computeCollisions = (projectiles, entities) => {
  entities.forEach((entity) => {
    projectiles.forEach((projectile) => {
      if (distance(projectile, entity.hitBoxDetails) <= entity.hitBoxDetails.size) {
        projectile.queueDeletion = true;
        entity.queueDeletion = true;
        // gameScore += 1;
      }
    });
  });
};

const handleEnemyDeaths = (projectiles, enemies) => {
  computeCollisions(projectiles, enemies);
  enemies.forEach((enemy) => {
    if (enemy.queueDeletion === true) {
      clearInterval(enemy.hunting);
      clearInterval(enemy.shooting);
    }
  });
};

const handlePlayerHits = (enemyProjectiles, playerCharacter) => {
  enemyProjectiles.forEach((projectile) => {
    if (distance(projectile, playerCharacter.hitBoxDetails) <= playerCharacter.hitBoxDetails.size) {
      projectile.queueDeletion;
      garbageCollectObjects(enemyProjectiles);
      playerHealth -= projectile.power;
      console.log(`I'm hit! ${playerHealth} HP left.`);
    }
    if (playerHealth <= 0) {
      console.log("Oh dear, you are dead!");
    }
  });
};

const playerInput = new Input();
let playerShip = new Character(canvasWidth / 2, undefined, 3, undefined, "up");

let enemyShip = new Enemy(canvasWidth / 2, 100, 3, "red", 2, playerShip);
// let enemyShip0 = new Enemy(canvasWidth / 2, 200, 4, "blue");
// let enemyShip1 = new Enemy(canvasWidth / 2, 300, 5, "green");
// let enemyShip2 = new Enemy(canvasWidth / 2, 500, 6, "purple");

let onScreenEnemies = new Array();
onScreenEnemies.push(enemyShip);
// onScreenEnemies.push(enemyShip0);
// onScreenEnemies.push(enemyShip1);
// onScreenEnemies.push(enemyShip2);

const update = () => {
  // clear the canvas
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  // Get the player's current location
  updateCharacterFromInput(playerInput, playerShip);

  drawCircle(canvasContext, playerShip.hitBoxDetails.x, playerShip.hitBoxDetails.y, playerShip.hitBoxDetails.size);

  onScreenEnemies.forEach((enemy) => {
    drawCircle(canvasContext, enemy.hitBoxDetails.x, enemy.hitBoxDetails.y, enemy.hitBoxDetails.size);
    drawArrow(canvasContext, enemy.coordinates.x, enemy.coordinates.y, "down", enemy.size, enemy.color);
  });
  // Draw the playerplayerShip.x + 5 * playerShip.size, playerShip.y - 5 * playerShip.size, 5 * playerShip.size;
  drawArrow(canvasContext, playerShip.coordinates.x, playerShip.coordinates.y, "up", playerShip.size, playerShip.color);
  fireLaz0rFromInput(playerInput, playerShip);
  onScreenProjectiles.forEach((element) => {
    drawCircle(canvasContext, element.x, element.y, projectileSize);
  });

  onScreenEnemyProjectiles.forEach((element) => {
    drawCircle(canvasContext, element.x, element.y, projectileSize);
  });

  handleEnemyDeaths(onScreenProjectiles, onScreenEnemies);
  handlePlayerHits(onScreenEnemyProjectiles, playerShip);
  garbageCollectObjects(onScreenProjectiles);
  garbageCollectObjects(onScreenEnemies);
};

(() => {
  let animationFrameRequestToken;
  const main = (hiResTimeStamp) => {
    animationFrameRequestToken = window.requestAnimationFrame(main);

    update();
  };
  main();
})();
