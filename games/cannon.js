import { drawCanvasFrame } from "./common.js";

let canvas = document.getElementById("mainCanvas");
let canvasHeight = canvas.height;
let canvasWidth = canvas.width;
let canvasContext = canvas.getContext("2d");

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

let playerInput = new MouseFollowingInput();
// setInterval(() => {
//   console.log(playerInput.coordinates);
// }, 1000);
// We can divine where the circle belongs based on
// the current location of the player's cursor
const cursorSize = 15;
const drawCursor = (canvasContext, input) => {
  let x = input.coordinates.x;
  let y = input.coordinates.y;
  canvasContext.beginPath();
  // void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
  canvasContext.arc(x, y, cursorSize, 0, 2 * Math.PI);
  canvasContext.stroke();
};

const update = () => {
  // clear the canvas
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  // draw the frame around the canvas
  drawCanvasFrame(canvasContext);
  // draw the player's cursor
  drawCursor(canvasContext, playerInput);
};

(() => {
  let animationFrameRequestToken;
  const main = (hiResTimeStamp) => {
    animationFrameRequestToken = window.requestAnimationFrame(main);

    update();
  };
  main();
})();
