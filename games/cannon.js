import { drawCircle, drawRectangle, drawCanvasFrame, randomInt } from "./common.js";

let canvas = document.getElementById("mainCanvas");
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;
let canvasContext = canvas.getContext("2d");

// The score.
let scoreCard = document.getElementById("scoreCard");
let gameScore = 0;
// The encouragement.
let encouragement = document.getElementById("encouragement");
setInterval(() => {
  let belt = int2KarateBelt(gameScore);
  if (belt !== "black") {
    encouragement.innerText = `Point-and-Click. You can do it, ${belt} belt!`;
  } else {
    encouragement.innerText = `Well done, ${belt} belt! You've done it!`;
  }
}, 2000);

// Some settings around projectiles
const projectileSpeed = 50;
const projectileSize = 5;
// Will projectiles bounce?
const projectilesWillBounce = false;
// General Constants for Gameplay
const cursorSize = 15;
// Keep this even because I don't feel like programming around
// floors and other dumb numeric problems, OK? I'm hateful, and _will_
// enforce this
const cannonSideLength = 32;
if (cannonSideLength % 2 !== 0) {
  throw new Error("Cannon side length should be even in parity!");
}

class MouseFollowingInput {
  constructor() {
    this.x;
    this.y;
    this.register();
  }

  register() {
    // Adding listeners for the mouse

    // Binding
    // Here, when we add the event listener, and when updateMouseState is called
    // as a callback, _inside of updateMouseState_ 'this' is NOT the class. It's
    // the _canvas_, which means if I try to set this.x and this.y, that's meaning-
    // less. So, I need to be able to pass the class in through to the update
    // function. I can do this by setting a new variable, _cls, here, since in the
    // context I'm in right now, 'this' IS the class.
    // Now, on the other side, the first argument to the function being passed to bind
    // will be the class, and the second argument being passed will be the event.
    let _cls = this;
    canvas.addEventListener("mousemove", this.updateMouseState.bind(null, _cls));
  }

  updateMouseState(cls, mouseEvent) {
    cls.x = mouseEvent.offsetX;
    cls.y = mouseEvent.offsetY;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

class CannonData {
  // The cannon winds up being _centered_ on (x,y)
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 90;
  }

  get getBarrelAngle() {
    return this.angle;
  }

  set setBarrelAngle(a) {
    this.angle = a;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  set coordinates(coordinates) {
    this.x = coordinates.x;
    this.y = coordinates.y;
  }
}

class Projectile {
  constructor(x, y, angle, speed) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.hasBounced = false;
    this.queueDeletion = false;

    this.setInMotion();
  }

  setInMotion() {
    // I'm lifting some of this logic from what I've learned in the
    // bubbles game I made.
    setInterval(() => {
      // If we've hit the right or left side, we should reverse our slope. This will
      // cause us to 'bounce off' the side, and start moving in a different direction.
      // We only get to bounce off once. After that, we need to destroy ourselves.

      if (this.x >= canvasWidth || this.x <= 0) {
        if (projectilesWillBounce) {
          if (this.hasBounced === false) {
            this.speed = -this.speed;
            this.hasBounced = true;
          } else {
            this.queueDeletion = true;
          }
        } else {
          this.queueDeletion = true;
        }
      }

      // If we've hit the top or bottom, we should reverse the sign of our y value. This
      // will cause us to start moving in the opposite direction with respect to the y
      // axis, which is just a bounce off the top or bottom.
      // We only get to bounce off once. After that, we need to destroy ourselves.

      if (this.y >= canvasHeight || this.y <= 0) {
        if (projectilesWillBounce) {
          if (this.hasBounced === false) {
            this.speed = -this.speed;
            this.hasBounced = true;
          } else {
            this.queueDeletion = true;
          }
        } else {
          this.queueDeletion = true;
        }
      }

      // The next position is based on a simple vector decomposition.
      // Here, the magnitude is the speed, and then we decompose the
      // vector angle into its consituent parts.
      this.x += this.speed * Math.cos((this.angle * Math.PI) / 180);
      this.y += this.speed * Math.sin((this.angle * Math.PI) / 180);
    }, 50);
  }
}

class RandomPathBubble {
  // Lifted from Character and Enemy in bubbles.js
  constructor(x, y, r, speed) {
    this.x = x;
    this.y = y;
    this.r = r; // temporary
    this.speed = speed;
    this.queueDeletion = false;

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

let playerInput = new MouseFollowingInput();

// Add a cannon right in the middle of the canvas
let cannon1 = new CannonData(canvasWidth / 2, canvasHeight / 2);

// We can divine where the circle belongs based on
// the current location of the player's cursor
const drawCursor = (canvasContext, input) => {
  let x = input.coordinates.x;
  let y = input.coordinates.y;
  drawCircle(canvasContext, x, y, cursorSize);
};

const int2KarateBelt = (integer) => {
  if (integer > 700) {
    return "black";
  } else if (integer > 450) {
    return "sienna";
  } else if (integer > 250) {
    return "green";
  } else if (integer > 100) {
    return "blue";
  } else if (integer > 50) {
    return "orange";
  } else {
    return "yellow";
  }
};

const drawCannon = (canvasContext, cannonData) => {
  let cannonBaseX = cannonData.coordinates.x;
  let cannonBaseY = cannonData.coordinates.y;
  // We're centering the cannon's base around the (x,y)
  // coordinate pair given. To do so, calculate the top left
  // and bottom right corners of the square of side length
  // cannonSideLength centered at the (x,y) coordinate pair in
  // cannonData.
  let cannonBaseStart = {
    x: cannonBaseX - cannonSideLength / 2,
    y: cannonBaseY + cannonSideLength / 2,
  };
  let cannonBaseFinish = {
    x: cannonBaseX + cannonSideLength / 2,
    y: cannonBaseY - cannonSideLength / 2,
  };
  drawRectangle(canvasContext, cannonBaseStart, cannonBaseFinish);

  // Rotating a rectangle that acts as the cannon's barrel.
  canvasContext.save();

  // Draw a rectangle to start with
  // canvasContext.fillStyle = "blue";
  // canvasContext.fillRect(cannonBaseX, cannonBaseY, cannonSideLength, Math.floor(cannonSideLength / 8));
  // Move the transformation matrix? to the center of the cannon
  canvasContext.translate(cannonBaseX, cannonBaseY);
  // Rotation by the current angle of the cannon barrel according to the cannon data.

  // Since we have translated over to the base of the cannon, the angle we need to pass
  // in needs to be calculated based on a translated reference frame. That's fine, we
  // simply subtract the location of the cannon's base from the player input location.

  let referenceFrameTransformedX = playerInput.coordinates.x - cannonBaseX;
  let referenceFrameTransformedY = playerInput.coordinates.y - cannonBaseY;

  // Computing the angle that the cannon should have based on the
  // current input value. Uses arctangent calculation using opposite
  // & adjacent to save calculating a hypotenuse. Output is apparently
  // already in radians, so no need to convert when using rotate().
  // We can just pass in to atan2 since we have already accounted for the difference in
  // the reference frame. This is the arctangent of the triangle with opp-hyp intersection
  // located at (referenceFrameTransformedX, referenceFrameTransformedY)
  let cannonRadians = Math.atan2(referenceFrameTransformedY, referenceFrameTransformedX);
  // Reset the state of the cannon to have the new angle set. In hindsight, demanding degrees
  // was probably a really bad idea. Maybe we'll fix that. Either way, we need to expose this
  // so that things other than this transformation know what angle the cannon is pointing to.
  let cannonDegrees = (cannonRadians * 180) / Math.PI;
  cannonData.angle = cannonDegrees;

  canvasContext.rotate(cannonRadians);
  // Draw the rectangle!
  canvasContext.fillStyle = int2KarateBelt(gameScore);
  // The rectangle is at (0, -1) because the current reference frame is at the location
  // where we put the cannon, and because the rectangle looks a little better if we
  // translate it upward by 1.
  canvasContext.fillRect(0, -1, cannonSideLength, Math.floor(cannonSideLength / 8));
  // Move the transformation matrix? Back exactly to where it came from

  canvasContext.restore();
};

const onScreenProjectiles = new Array();
const fireCannon = (cannonData, mouseClickEvent) => {
  const x = cannonData.coordinates.x;
  const y = cannonData.coordinates.y;
  const angle = cannonData.angle;
  let firedProjectile = new Projectile(x, y, angle, projectileSpeed);
  onScreenProjectiles.push(firedProjectile);
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

let maxOnScreenBubbles = 15;
let onScreenBubbles = new Array();
const bubbleGenerator = () => {
  let enemySpawnX = randomInt(0, canvasWidth);
  let enemySpawnY = randomInt(0, canvasHeight);
  let enemySize = randomInt(30, 75);
  let enemySpeed = randomInt(1, 6);
  return new RandomPathBubble(enemySpawnX, enemySpawnY, enemySize, enemySpeed);
};

const randomlyGenerateBubbles = (chance) => {
  // Chance: an integer in [1, 100]. Specifying 10 means there's
  // a 10% chance to spawn a bubble.
  if (randomInt(1, 100) > 100 - chance && onScreenBubbles.length < maxOnScreenBubbles) {
    onScreenBubbles.push(bubbleGenerator());
  }
};

// For computing the distance between two points
// A and B, each with a component x and a component y
const D = (A, B) => {
  return Math.sqrt(Math.pow(B.y - A.y, 2) + Math.pow(B.x - A.x, 2));
};

const computeCollisions = (projectiles, bubbles) => {
  projectiles.forEach((projectile) => {
    bubbles.forEach((bubble) => {
      if (D(projectile, bubble) <= bubble.r) {
        projectile.queueDeletion = true;
        bubble.queueDeletion = true;
        gameScore += 1;
      }
    });
  });
};

canvas.addEventListener("click", fireCannon.bind(null, cannon1));

const update = () => {
  // clear the canvas
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  // draw the frame around the canvas
  drawCanvasFrame(canvasContext);
  // draw the player's cursor
  drawCursor(canvasContext, playerInput);
  drawCannon(canvasContext, cannon1);
  onScreenProjectiles.forEach((element) => {
    drawCircle(canvasContext, element.x, element.y, projectileSize);
  });
  randomlyGenerateBubbles(5);
  onScreenBubbles.forEach((bubble) => {
    drawCircle(canvasContext, bubble.x, bubble.y, bubble.r);
  });
  computeCollisions(onScreenProjectiles, onScreenBubbles);
  garbageCollectObjects(onScreenProjectiles);
  garbageCollectObjects(onScreenBubbles);
  scoreCard.innerText = `${gameScore}`;
};

(() => {
  let animationFrameRequestToken;
  const main = (hiResTimeStamp) => {
    animationFrameRequestToken = window.requestAnimationFrame(main);

    update();
  };
  main();
})();
