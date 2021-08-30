import { drawCircle, drawRectangle, drawCanvasFrame } from "./common.js";

let canvas = document.getElementById("mainCanvas");
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;
let canvasContext = canvas.getContext("2d");
// So that we know the limits of our canvas
let boundingClientRectangle = canvas.getBoundingClientRect();
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
    // this.x = x;
    // this.y = y;
    this.x;
    this.y;
    this.register();
  }

  register() {
    // Add listeners for the mouse
    console.log("registering...");
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
  constructor(x, y, destX, destY, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.hasBounced = false;

    // I hate this approach. Too many corner cases.
    // Next time we'll figure out what was wrong with the angles
    console.log(Math.abs(destX - x));
    if (Math.abs(destX - x) < 20) {
      this.slope = 10;
    } else {
      this.slope = (destY - y) / (destX - x);
    }
    // If we're in quadrant III or IV, we will need
    // to augment the calculation so that as we update
    // x, we're subtracting instead of adding. To do so,
    // detect our quadrant, then revert the speed
    if (destX < x) {
      this.speed = -this.speed;
    }

    this.setInMotion();
  }

  setInMotion() {
    // This is what I want to do but it didn't work well the first time
    // so i went with a different approach. Fml, I hate the new approach
    // I know the angle at which the barrel of the gun firing
    // this projectile is pointed, but I need a slope to give my
    // projectile direction. Slope, being 'rise-over-run', is then
    // equivalent to the tangent of my angle, y/x or opposite-over-
    // adjacent.
    let ySign = 1;
    // I'm lifting some of this logic from what I've learned in the
    // bubbles game I made.
    setInterval(() => {
      // If we've hit the right or left side, we should reverse our slope. This will
      // cause us to 'bounce off' the side, and start moving in a different direction.
      // We only get to bounce off once. After that, we need to destroy ourselves.

      // if (this.x >= canvasWidth || this.x <= 0) {
      //   if (this.hasBounced === false) {
      //     this.slope = -this.slope;
      //     this.hasBounced === true;
      //   } else {
      //     console.log("I should garbage collect myself now.");
      //   }
      // }

      // If we've hit the top or bottom, we should reverse the sign of our y value. This
      // will cause us to start moving in the opposite direction with respect to the y
      // axis, which is just a bounce off the top or bottom.
      // We only get to bounce off once. After that, we need to destroy ourselves.

      // if (this.y >= canvasHeight || this.y <= 0) {
      //   if (this.hasBounced === false) {
      //     ySign = -ySign;
      //     this.hasBounced === true;
      //   } else {
      //     console.log("I should garbage collect myself now.");
      //   }
      // }

      // Finally, given our computed slope and y sign, whatever they are, update our
      // location.
      let previousX = this.x;
      let previousY = this.y;
      this.x += this.speed;
      this.y += this.slope * (this.x - previousX); // * this.x + 1 * ySign;
      // this.x += this.slope;
      // this.y += 1 * ySign;
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
  canvasContext.fillStyle = "purple";
  // The rectangle is at (0, -1) because the current reference frame is at the location
  // where we put the cannon, and because the rectangle looks a little better if we
  // translate it upward by 1.
  canvasContext.fillRect(0, -1, cannonSideLength, Math.floor(cannonSideLength / 8));
  // Move the transformation matrix? Back exactly to where it came from

  canvasContext.restore();
};

const projectileSpeed = 50;
const projectileSize = 5;
const onScreenProjectiles = new Array();
const fireCannon = (cannonData, mouseClickEvent) => {
  let x = cannonData.coordinates.x;
  let y = cannonData.coordinates.y;
  // We need to compute the difference between the inside of the canvas
  // and the edge of the screen. The mouse event is nice, but it doesn't
  // give us coordinates inside of the canvas.
  let destX = mouseClickEvent.clientX - boundingClientRectangle.left;
  let destY = mouseClickEvent.clientY - boundingClientRectangle.top;
  let firedProjectile = new Projectile(x, y, destX, destY, projectileSpeed);
  onScreenProjectiles.push(firedProjectile);
  console.log(onScreenProjectiles);
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
};

(() => {
  let animationFrameRequestToken;
  const main = (hiResTimeStamp) => {
    animationFrameRequestToken = window.requestAnimationFrame(main);

    update();
  };
  main();
})();
