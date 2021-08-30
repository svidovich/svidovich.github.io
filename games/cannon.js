import { drawRectangle, drawCanvasFrame } from "./common.js";

let canvas = document.getElementById("mainCanvas");
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;
let canvasContext = canvas.getContext("2d");

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

let playerInput = new MouseFollowingInput();

// Add a cannon right in the middle of the canvas
let cannon1 = new CannonData(canvasWidth / 2, canvasHeight / 2);

// We can divine where the circle belongs based on
// the current location of the player's cursor
const drawCursor = (canvasContext, input) => {
  let x = input.coordinates.x;
  let y = input.coordinates.y;
  canvasContext.beginPath();
  // void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
  canvasContext.arc(x, y, cursorSize, 0, 2 * Math.PI);
  canvasContext.stroke();
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

  canvasContext.rotate(cannonRadians);
  // Draw the rectangle!
  canvasContext.fillStyle = "purple";
  // The rectangle is at (0, 0) because the current reference frame is at the location
  // where we put the cannon.
  canvasContext.fillRect(0, 0, cannonSideLength, Math.floor(cannonSideLength / 8));
  // Move the transformation matrix? Back exactly to where it came from

  canvasContext.restore();
};

const update = () => {
  // clear the canvas
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  // draw the frame around the canvas
  drawCanvasFrame(canvasContext);
  // draw the player's cursor
  drawCursor(canvasContext, playerInput);
  drawCannon(canvasContext, cannon1);
};

(() => {
  let animationFrameRequestToken;
  const main = (hiResTimeStamp) => {
    animationFrameRequestToken = window.requestAnimationFrame(main);

    update();
  };
  main();
})();
