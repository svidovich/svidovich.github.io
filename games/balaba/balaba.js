import { distance, drawCircle, drawRandomColoredCircle, drawRectangle, drawCanvasFrame, randomInt } from "../common.js";
import { gamePlayStages } from "./stages.js";
const SHOW_HITBOXES = false;
const MAXIMUM_HEALTH = 100;
const MAXIMUM_SHIELD = 50;

let canvas = document.getElementById("mainCanvas");
let canvasContext = canvas.getContext("2d");
// Define these globally so I can access them
// between modules & business logic
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

const initialPlayerProjectileInterval = 175;
let minTimeBetweenPlayerProjectilesMS = 175;
let weaponPowerUpIsActive = false;
let projectileSpeed = 30;
let projectileSize = 2;
let score = 0;

let deathCondition = false;
let victoryCondition = false;

let onScreenEnemies = new Array();
let onScreenEnemyProjectiles = new Array();
let onScreenPowerUps = new Array();
let onScreenProjectiles = new Array();

const InputKeys = {
  A: 65, // left!
  D: 68, // right!
  L: 37, // also left!
  R: 39, // also right!
  space: 32, // shoot!
  up: 38,
  down: 40,
  enter: 13,
};

class Input {
  constructor() {
    this.right = false;
    this.left = false;
    this.shooting = false;

    // These are just for the menu.
    this.up = false;
    this.down = false;
    this.enter = false;

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

class Character {
  constructor(x, y, size, color, orientation) {
    this.speed = 5;
    this.size = size || 2;
    this.color = color || "rgb(67, 179, 174)";
    this.x = x;
    this.y = y;
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
      // The hitbox for a character is a circle. To make it work right, we need to
      // handle both possible orientations of a character.
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
  constructor(x, y, size, color, speed, points) {
    super(x, y, size, color, "down");
    this.speed = speed || 1;
    this.points = points || 10;
  }

  moveBy(dx, dy) {
    let rightBoundary = 10 * this.size;
    if (this.x + rightBoundary + dx <= canvasWidth && this.x + dx >= 0) {
      this.x += dx;
    }
    this.y += dy;
  }
}

class Player extends Character {
  constructor(x, y, size, color, orientation) {
    super(x, y, size, color, orientation);
    this.health = 100;
    this.shield = 0;
  }
}

// The type of enemy that'll follow you into the grave.
class Hunter extends Enemy {
  constructor(x, y, size, color, target) {
    super(x, y, size, color, 1, 100);
    this.target = target || null;

    this.hunting = setInterval(() => {
      this.hunt();
    }, 60);

    this.speed = randomInt(2, 6);

    this.shooting = setInterval(() => {
      NPCShoot(this, onScreenEnemyProjectiles);
    }, 250);
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

// The type of enemy that knows that sometimes getting
// bullets out there is important.
class Support extends Enemy {
  constructor(x, y, size, color, speed) {
    super(x, y, size, color, 1, 50);
    this.speed = speed || randomInt(2, 4);
    this.strafeSign = 1;
    this.strafing = setInterval(() => {
      this.strafe();
    }, 40);

    this.shooting = setInterval(() => {
      NPCShoot(this, onScreenEnemyProjectiles);
    }, 500);
  }
  strafe() {
    let centerLineX = this.hitBoxDetails.x;
    if (canvasWidth - centerLineX < 75) {
      this.strafeSign = -1;
    }
    if (centerLineX < 75) {
      this.strafeSign = 1;
    }
    this.moveBy(this.speed * this.strafeSign, 0);
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
    this.intervalId = setInterval(() => {
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

// Base class for powerups
class PowerUp {
  constructor(x, y, target) {
    this.x = x;
    this.y = y;
    // Color and letter are how we decorate the powerup
    // Have a default in case programmer forgets to add
    // these to the inheriting classes ;)
    this.color = "black";
    this.letter = "P";
    this.styleCenteringAdjustments = {
      x: 0,
      y: 7,
    };
    // Target is who we're applying our powerup to.
    this.target = target;
    this.queueDeletion = false;
    this.points = 15;
  }

  // Powerups just slowly move down the screen. We _do not_
  // call the set in motion in the constructor of PowerUp;
  // that's the responsibility of a class that extends this
  // one. This is effectively an abstract base class, which
  // I _think_ are called mixins here, but we don't need to
  // go that far, I don't think.
  setInMotion() {
    this.intervalId = setInterval(() => {
      if (this.y >= canvasHeight) {
        this.queueDeletion = true;
      }
      this.y += 2;
    }, 40);
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

class HealthPowerUp extends PowerUp {
  constructor(x, y, target, strength) {
    super(x, y, target);
    this.strength = strength;
    this.color = "red";
    this.letter = "H";
    this.styleCenteringAdjustments = {
      x: -7,
      y: 7,
    };
    this.setInMotion();
  }

  apply() {
    // We don't want to exceed maximum health. If we're about to,
    // give us max health. Otherwise, fork over the goods.
    if (this.target.health !== MAXIMUM_HEALTH) {
      if (this.target.health + this.strength > MAXIMUM_HEALTH) {
        this.target.health = MAXIMUM_HEALTH;
      } else {
        this.target.health += this.strength;
      }
    }
    score += this.points;
  }
}

class ShieldPowerUp extends PowerUp {
  constructor(x, y, target, strength) {
    super(x, y, target);
    this.strength = strength;
    this.color = "blue";
    this.letter = "S";
    this.styleCenteringAdjustments = {
      x: -7,
      y: 7,
    };
    this.setInMotion();
  }

  apply() {
    if (this.target.shield !== MAXIMUM_SHIELD) {
      if (this.target.shield + this.strength > MAXIMUM_SHIELD) {
        this.target.shield = MAXIMUM_SHIELD;
      } else {
        this.target.shield += this.strength;
      }
    }
    score += this.points;
  }
}

class WeaponPowerUp extends PowerUp {
  constructor(x, y, target, strength, duration) {
    super(x, y, target);
    this.strength = strength;
    // ! Must be in MS !
    this.duration = duration;
    this.color = "green";
    this.letter = "W";
    // Still looks a little hokey. Will take advice ;)
    this.styleCenteringAdjustments = {
      x: -9,
      y: 7,
    };
    this.setInMotion();
  }

  apply() {
    minTimeBetweenPlayerProjectilesMS -= this.strength;
    weaponPowerUpIsActive = true;
    // We should turn the weapon powerup off after a given
    // amount of time so that the powerup isn't permanent.
    setTimeout(() => {
      minTimeBetweenPlayerProjectilesMS += this.strength;
      weaponPowerUpIsActive = false;
    }, this.duration);
    score += this.points;
  }
}

const PowerUpTypes = Object.freeze({
  health: "health",
  shield: "shield",
  weapon: "weapon",
});

///////////////////////////////////////////
//
/// Global Player Ship Definition
//
//////////

const playerInput = new Input();
let playerShip = new Player(canvasWidth / 2, canvasHeight - 20, 3, undefined, "up");

// We define the way NPCs shoot differently from players, because all of the on-screen
// NPCs share the same array for their projectiles. Because of the way the player shooting
// is implemented, this would make it so that only one NPC would ever be able to shoot
// because of the time limit on firing. Here, we just don't keep track; enemy shooting is
// set on an interval anyway.
const NPCShoot = (characterObject, projectilesArray) => {
  let midpointdx = 5 * characterObject.size;
  let tipY = 9 * characterObject.size;
  const x = characterObject.coordinates.x + midpointdx;
  const y =
    characterObject.orientation === "up" ? characterObject.coordinates.y - tipY : characterObject.coordinates.y + tipY;
  let firedProjectile = new Projectile(x, y, projectileSpeed, characterObject.orientation);
  projectilesArray.push(firedProjectile);
};

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
  // Carefully chosen magic values make the arrow look pretty.
  // Trust the styles.
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

const drawPowerup = (canvasContext, powerUp) => {
  // A powerup is essentially an NxN box around the coordinates of the
  // powerup. The coordinates of the powerup are the centerpoint of that
  // box. We need to do some extraction and calculation.
  let startX = powerUp.coordinates.x;
  let startY = powerUp.coordinates.y;

  // Keep track of the old styles so we can restore them once we're done
  // drawing the powerup itself
  const oldStrokeStyle = canvasContext.strokeStyle;
  const newStrokeStyle = powerUp.color;

  canvasContext.strokeStyle = newStrokeStyle;
  // Powerups are 20x20. Start and finish appropriately.
  canvasContext.strokeRect(startX - 10, startY - 10, 20, 20);
  canvasContext.strokeStyle = oldStrokeStyle;

  const oldFont = canvasContext.font;
  // Good fotn :^)
  const newFont = "20px Arial";
  const oldFillStyle = canvasContext.fillStyle;
  const newFillStyle = powerUp.color;

  canvasContext.font = newFont;
  canvasContext.fillStyle = newFillStyle;
  // We may have adjustments from the powerUp. If so, apply them to the
  // fill text.
  let powerUpCenteringAdjustments = powerUp.styleCenteringAdjustments;
  canvasContext.fillText(
    powerUp.letter,
    startX + powerUpCenteringAdjustments.x,
    startY + powerUpCenteringAdjustments.y
  );
  canvasContext.font = oldFont;
  canvasContext.fillStyle = oldFillStyle;
};

const computeCollisions = (projectiles, entities) => {
  entities.forEach((entity) => {
    projectiles.forEach((projectile) => {
      if (distance(projectile, entity.hitBoxDetails) <= entity.hitBoxDetails.size) {
        projectile.queueDeletion = true;
        entity.queueDeletion = true;
      }
    });
  });
};

// This is the RNG for whether or not killing an enemy nets you a powerup.
// Make adjustments here, if you dare.
const rngPowerUpGenerator = (x, y, target, strength) => {
  const RNG = randomInt(1, 100);
  if (100 - RNG > 99) {
    return new HealthPowerUp(x, y, target, strength);
  } else if (100 - RNG > 98) {
    return new ShieldPowerUp(x, y, target, strength);
  } else if (100 - RNG > 95) {
    return new WeaponPowerUp(x, y, target, 50, randomInt(3000, 6000));
  } else {
    return null;
  }
};

const handleEnemyDeaths = (projectiles, enemies) => {
  computeCollisions(projectiles, enemies);
  enemies.forEach((enemy) => {
    if (enemy.queueDeletion === true) {
      clearInterval(enemy.hunting);
      clearInterval(enemy.shooting);
      const enemyDeathPowerUpReward = rngPowerUpGenerator(enemy.x, enemy.y, playerShip, randomInt(10, 25));
      if (enemyDeathPowerUpReward !== null) {
        onScreenPowerUps.push(enemyDeathPowerUpReward);
      }
      score += enemy.points;
    }
  });
};

const handlePlayerHits = (enemyProjectiles, playerCharacter) => {
  enemyProjectiles.forEach((projectile) => {
    if (distance(projectile, playerCharacter.hitBoxDetails) <= playerCharacter.hitBoxDetails.size) {
      projectile.queueDeletion;
      garbageCollectObjects(enemyProjectiles);
      let availableDamage = projectile.power;
      let leftOverdamage;
      // If we have some shield left,
      if (playerCharacter.shield > 0) {
        // Check to see if we would over-kill the shield.
        if (playerCharacter.shield - availableDamage < 0) {
          // If so, we should get the remainder of over-killing the shield,
          leftOverdamage = Math.abs(playerCharacter.shield - availableDamage);
          // Then compute the damage to the shield as that damage which would
          // reduce the shield to exactly zero.
          let shieldDamage = availableDamage - leftOverdamage;
          // Damage the shield,
          playerCharacter.shield -= shieldDamage;
          // then re-set availableDamage.
          availableDamage = leftOverdamage;
        } else {
          // If not, just deal damage to the shield.
          playerCharacter.shield -= availableDamage;
          availableDamage = 0;
        }
      }
      // By this time, availableDamage is either just projectile.power,
      // or it's some reduced amount because our shield has been over-
      // kiled. Either way, we should check if this projectile will over-
      // kill us.
      if (playerCharacter.health - availableDamage < 0) {
        // If so, just kill us.
        playerCharacter.health = 0;
      } else {
        // otherwise, damage us normally.
        playerCharacter.health -= availableDamage;
      }
    }
    if (playerCharacter.health <= 0) {
      deathCondition = true;
    }
  });
};

const handlePowerUps = (projectiles, powerUps) => {
  powerUps.forEach((powerUp) => {
    projectiles.forEach((projectile) => {
      if (distance(projectile, powerUp) < 20) {
        powerUp.queueDeletion = true;
        projectile.queueDeletion = true;
        powerUp.apply();
      }
    });
  });
};

const drawLargeBanner = (canvasContext, message, adjX, adjY) => {
  let oldFillStyle = canvasContext.fillStyle;
  let oldFont = canvasContext.font;
  let xAdjustment = adjX || 0;
  let yAdjustment = adjY || 0;
  let bannerLocationX = canvasWidth / 2 - 100 + xAdjustment;
  let bannerLocationY = canvasHeight / 2 + yAdjustment;
  canvasContext.font = "50px Courier";
  canvasContext.fillStyle = `rgb(${randomInt(100, 200)}, ${randomInt(100, 200)}, ${randomInt(100, 200)})`;
  canvasContext.fillText(message, bannerLocationX, bannerLocationY);
  canvasContext.fillStyle = oldFillStyle;
  canvasContext.font = oldFont;
  return {
    x: bannerLocationX,
    y: bannerLocationY,
  };
};

const drawVictoryBanner = (canvasContext) => {
  drawLargeBanner(canvasContext, "YOU WIN!");
};

const drawDeathBanner = (canvasContext) => {
  drawLargeBanner(canvasContext, "YOU DIED!", -25);
};

const menuOptions = ["Mission", "Survival"];
let selectedGameMode = null;

let optionLocations = new Object();
const drawMenu = (canvasContext) => {
  let titleLocation = drawLargeBanner(canvasContext, "🅱️ALA🅱️A");
  for (let i = 0; i < menuOptions.length; i++) {
    let oldFont = canvasContext.font;
    let oldFillStyle = canvasContext.fillStyle;
    canvasContext.font = "25px Courier";
    canvasContext.fillStyle = "grey";
    let menuOptionLocationX = titleLocation.x + 25;
    let menuOptionLocationY = titleLocation.y + (i + 1) * 30;
    let menuOptionText = menuOptions[i];
    // Most of the time we'll skip this check. The first time, we'll
    // add to the object. I didn't want to generate a new object every
    // time I draw the menu.
    if (!Object.keys(optionLocations).includes(menuOptionText)) {
      optionLocations[menuOptionText] = {
        x: menuOptionLocationX,
        y: menuOptionLocationY,
      };
    }
    canvasContext.fillText(menuOptionText, menuOptionLocationX, menuOptionLocationY);
    canvasContext.font = oldFont;
    canvasContext.fillStyle = oldFillStyle;
  }
};

// This function is proof that I've never done this before in my life
let hoveredGameModeIdx = 0;
let lastHoveredGameModeFromInput = 0;
const updateHoveredGameModeFromInput = (canvasContext, inputObject) => {
  // This bit debounces the menu options so we don't hyper speed
  // them when we press a button 8D
  if (Date.now() - lastHoveredGameModeFromInput > 200) {
    if (inputObject.down === true) {
      // I _think_ this means that we're uh, on the last option
      if (hoveredGameModeIdx + 1 === menuOptions.length) {
        hoveredGameModeIdx = 0;
      } else {
        hoveredGameModeIdx += 1;
      }
      lastHoveredGameModeFromInput = Date.now();
    } else if (inputObject.up === true) {
      if (hoveredGameModeIdx - 1 < 0) {
        hoveredGameModeIdx = menuOptions.length - 1;
      } else {
        hoveredGameModeIdx -= 1;
      }
      lastHoveredGameModeFromInput = Date.now();
    } else if (inputObject.enter === true) {
      selectedGameMode = menuOptions[hoveredGameModeIdx];
    }
  }
  let hoveredGameMode = menuOptions[hoveredGameModeIdx];
  const selectorX = optionLocations[hoveredGameMode].x - 10;
  const selectorY = optionLocations[hoveredGameMode].y - 5;
  drawCircle(canvasContext, selectorX, selectorY, 5);
};

//\//////////\\\////////////////////////////////\\\\\\\///////
// Staging Stuff: This sucks, really bad lol.
//\//////////\\\////////////////////////\\\/////\\\\\\\///////

// Given enemy details, get a new enemy out.
const generateEnemy = (enemyDetails) => {
  let enemyX = enemyDetails.x ? enemyDetails.x : canvasWidth / 2;
  let enemyY = enemyDetails.y ? enemyDetails.y : 100;

  if (enemyDetails.enemyType === "hunter") {
    // x: any, y: any, size: any, color: any, target: any
    return new Hunter(enemyX, enemyY, 3, "red", playerShip);
  } else if (enemyDetails.enemyType == "support") {
    // x: any, y: any, size: any, color: any, speed: any
    return new Support(enemyX, enemyY, 3, "red", randomInt(2, 5));
  } else {
    throw new Error(`${enemyDetails.enemyType} is not a valid enemy type.`);
  }
};

const serializeEnemyDetails = (enemyType, enemyX, enemyY) => {
  return {
    enemyType: enemyType,
    x: enemyX,
    y: enemyY,
  };
};

// This method has a side effect: when it's run, an enemy will appear on-screen
// Don't use it until you're ready
const addEnemyToSubStageFromArray = (arrayOfSimpleEnemyDetails, enemiesArray) => {
  let enemy = generateEnemy(serializeEnemyDetails(...arrayOfSimpleEnemyDetails));
  onScreenEnemies.push(enemy);
};

// Build the game state to mirror the stage template in stages.js
let stageState = new Object();
Object.keys(gamePlayStages).forEach((stageID) => {
  stageState[stageID] = new Object();
  Object.keys(gamePlayStages[stageID]).forEach((subStageID) => {
    stageState[stageID][subStageID] = {
      subStageStatus: "none",
      enemies: [],
    };
  });
});

// Very serious business
const StageStatesEnum = Object.freeze({
  none: "none",
  started: "started",
  finished: "finished",
});

const startSubStage = (stageID, subStageID) => {
  let subStageEnemiesArray = new Array();
  gamePlayStages[stageID][subStageID].forEach((simpleEnemyDetailsArray) => {
    addEnemyToSubStageFromArray(simpleEnemyDetailsArray, stageState[stageID][subStageID]["enemies"]);
  });
  stageState[stageID][subStageID]["subStageStatus"] = StageStatesEnum.started;
};

const finishSubStage = (stageID, subStageID) => {
  stageState[stageID][subStageID]["subStageStatus"] = StageStatesEnum.finished;
  let stageCount = Object.keys(stageState).length;
  let subStageCountForStage = Object.keys(stageState[stageID]).length;
  // Here, we've reached the end of the stage, and run out of substages. To continue,
  // we need to go to the next stage.
  if (currentSubStage === subStageCountForStage) {
    // Here, we're at the last stage, and there's nothing left to do
    // we should revert the stage vars and throw up the victory flag
    if (currentStage + 1 > stageCount) {
      currentStage = currentStage;
      currentSubStage = currentSubStage;
      victoryCondition = true;
      return;
      // Or, it's time to advance to the next stage.
    } else {
      currentStage += 1;
      currentSubStage = 1;
    }
    // Or ( ! ) it's time to advance to the next substage.
  } else {
    currentSubStage += 1;
  }
};

// This is like... some kind of messed up state machine. It works OK.
let currentStage = 1;
let currentSubStage = 1;
const handleStage = (id) => {
  if (stageState[id][currentSubStage]["subStageStatus"] === StageStatesEnum.started) {
    if (onScreenEnemies.length === 0) {
      finishSubStage(id, currentSubStage);
    }
  } else if (stageState[id][currentSubStage]["subStageStatus"] === StageStatesEnum.none) {
    startSubStage(id, currentSubStage);
  }
};

const drawStatusBar = (canvasContext, playerCharacter) => {
  canvasContext.strokeRect(0, 0, canvasWidth, 50);
  canvasContext.fillText(`Score: ${score}`, 20, 30);

  const oldFillStyle = canvasContext.fillStyle;
  const oldStrokeStyle = canvasContext.strokeStyle;
  let healthBarYLocation = 20;
  let healthBarHeight = 10;

  let healthBarXLocation = canvasWidth - 200;
  let healthBarTextLocationX = healthBarXLocation - 90;
  let healthBarTextLocationY = healthBarYLocation + 8;

  // Deciding to tie the shield bar and the health bar together. Good idea?
  // Who knows. Remains to be seen.
  let shieldBarXLocation = healthBarXLocation;
  let shieldBarYLocation = healthBarYLocation + 15;
  let shieldBarTextLocationX = shieldBarXLocation - 90;
  let shieldBarTextLocationY = shieldBarYLocation + 8;

  // Display a cute lil W in a box if we have the weapon powerup!
  if (weaponPowerUpIsActive === true) {
    canvasContext.strokeStyle = "green";
    canvasContext.fillStyle = "green";
    canvasContext.strokeRect(canvasWidth - 50, 20, 20, 20);
    canvasContext.fillText("W", canvasWidth - 45, 35);
    canvasContext.strokeStyle = oldStrokeStyle;
    canvasContext.fillStyle = oldFillStyle;
  }

  canvasContext.fillText(`Level ${currentStage}, wave ${currentSubStage}`, 220, 30);

  canvasContext.fillText(
    `Health: ${playerCharacter.health} / ${MAXIMUM_HEALTH}`,
    healthBarTextLocationX,
    healthBarTextLocationY
  );
  canvasContext.fillText(
    `Health: ${playerCharacter.shield} / ${MAXIMUM_SHIELD}`,
    shieldBarTextLocationX,
    shieldBarTextLocationY
  );
  // Lots of handling for negatives here. In short, we don't really want to have a health bar
  // that stretches backward or does dumb stuff if the player's health goes below zero. Now,
  // because future me is an OK programmer, player's health _shouldn't_ go below zero, but...
  // no less, let's uh. Make sure. Just to be sure.
  canvasContext.fillStyle = "green";
  canvasContext.fillRect(
    healthBarXLocation,
    healthBarYLocation,
    playerCharacter.health >= 0 ? playerCharacter.health : 0,
    healthBarHeight
  );
  canvasContext.fillStyle = "red";
  // The red part of the health bar should signify remaining health. Thus, place it right at the end of
  // the green part, and give it a length equal to MAXIMUM_HEALTH - currentHealth
  const redBarXLocation =
    playerCharacter.health >= 0
      ? healthBarXLocation + MAXIMUM_HEALTH - (MAXIMUM_HEALTH - playerCharacter.health)
      : healthBarXLocation;
  const redBarWidth = playerCharacter.health >= 0 ? MAXIMUM_HEALTH - playerCharacter.health : MAXIMUM_HEALTH;
  canvasContext.fillRect(redBarXLocation, healthBarYLocation, redBarWidth, healthBarHeight);

  canvasContext.fillStyle = "blue";
  // Note: anti-patternly setting the height of the shield bar to be the size of the health bar
  canvasContext.fillRect(shieldBarXLocation, shieldBarYLocation, playerCharacter.shield, healthBarHeight);
  canvasContext.fillStyle = oldFillStyle;
};

const update = () => {
  // clear the canvas
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  if (selectedGameMode !== null) {
    if (victoryCondition === false && deathCondition === false) {
      if (selectedGameMode === "Mission") {
        handleStage(currentStage);
      } else if (selectedGameMode === "Survival") {
        console.log("MEWOTH");
        return;
      }

      // Draw the status bar ( amazing, I know )
      drawStatusBar(canvasContext, playerShip);
      // Get the player's current location
      updateCharacterFromInput(playerInput, playerShip);
      if (SHOW_HITBOXES === true) {
        drawCircle(
          canvasContext,
          playerShip.hitBoxDetails.x,
          playerShip.hitBoxDetails.y,
          playerShip.hitBoxDetails.size
        );
      }

      onScreenEnemies.forEach((enemy) => {
        if (SHOW_HITBOXES === true) {
          drawCircle(canvasContext, enemy.hitBoxDetails.x, enemy.hitBoxDetails.y, enemy.hitBoxDetails.size);
        }
        drawArrow(canvasContext, enemy.coordinates.x, enemy.coordinates.y, "down", enemy.size, enemy.color);
      });
      // Draw the player
      drawArrow(
        canvasContext,
        playerShip.coordinates.x,
        playerShip.coordinates.y,
        "up",
        playerShip.size,
        playerShip.color
      );
      fireLaz0rFromInput(playerInput, playerShip);
      onScreenProjectiles.forEach((element) => {
        drawCircle(canvasContext, element.x, element.y, projectileSize);
      });

      onScreenEnemyProjectiles.forEach((element) => {
        drawCircle(canvasContext, element.x, element.y, projectileSize);
      });

      onScreenPowerUps.forEach((powerUp) => {
        drawPowerup(canvasContext, powerUp);
      });

      // Get latest deaths, powerups, hits, etc. _before_ garbage collecting.
      handleEnemyDeaths(onScreenProjectiles, onScreenEnemies);
      handlePlayerHits(onScreenEnemyProjectiles, playerShip);
      handlePowerUps(onScreenProjectiles, onScreenPowerUps);
      [onScreenEnemyProjectiles, onScreenEnemies, onScreenPowerUps].forEach((garbageCollectibleArray) => {
        garbageCollectObjects(garbageCollectibleArray);
      });
      // In case we hit some goofy race condition, let's always try to reset the weapons.
      if (!weaponPowerUpIsActive && initialPlayerProjectileInterval !== minTimeBetweenPlayerProjectilesMS) {
        minTimeBetweenPlayerProjectilesMS = initialPlayerProjectileInterval;
      }
    } else {
      if (victoryCondition === true) {
        drawVictoryBanner(canvasContext);
      }
      if (deathCondition === true) {
        drawDeathBanner(canvasContext);
      }
    }
  } else {
    drawMenu(canvasContext);
    updateHoveredGameModeFromInput(canvasContext, playerInput);
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
