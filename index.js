const canvas = document.getElementById("headerCanvas");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;
const canvasContext = canvas.getContext("2d");

const NAME_COLOR_CHANGE_SPEED_MS = 100;
const NAME_COLOR_CHANGE_QUANTITY = 5;

const generateRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min));
};

let nameFontState = {
  r: 0,
  g: 0,
  b: 0,
};

const advanceNameFontState = () => {
  nameFontState.r = (nameFontState.r + NAME_COLOR_CHANGE_QUANTITY) % 255;
  nameFontState.g = (nameFontState.g + NAME_COLOR_CHANGE_QUANTITY) % 255;
  nameFontState.b = (nameFontState.b + NAME_COLOR_CHANGE_QUANTITY) % 255;
};

const randomizeNameFontState = () => {
  nameFontState.r = generateRandomNumber(1, 255);
  nameFontState.g = generateRandomNumber(1, 255);
  nameFontState.b = generateRandomNumber(1, 255);
};

const drawName = () => {
  //   canvasContext.strokeRect(0, 0, canvasWidth, canvasHeight);
  let oldFont = canvasContext.font;
  let oldFillStyle = canvasContext.fillStyle;
  canvasContext.font = "25px Courier";
  canvasContext.fillStyle = `rgb(${nameFontState.r}, ${nameFontState.g}, ${nameFontState.b})`;
  canvasContext.fillText("Samuel Vidovich", canvasWidth / 3, canvasHeight / 2);
  canvasContext.font = oldFont;
  canvasContext.fillStyle = oldFillStyle;
};

const bubblesArray = new Array();

class Bubble {
  constructor(x, y, r, speed) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = speed;
  }
  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }
  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }
}

const randomBubbleFactory = () => {};

const update = () => {
  drawName();
};

(() => {
  let animationFrameRequestToken;

  // Set state of name colours here to guarantee no race
  // condition
  randomizeNameFontState();
  // Change the colour of the name rather quickly,
  window.setInterval(advanceNameFontState, NAME_COLOR_CHANGE_SPEED_MS);
  // And reset it to something random rather less quickly.
  window.setInterval(randomizeNameFontState, NAME_COLOR_CHANGE_SPEED_MS * 100);

  main = (hiResTimeStamp) => {
    try {
      animationFrameRequestToken = window.requestAnimationFrame(main);

      update();
    } catch (error) {
      console.error(error);
    }
  };
  main();
})();
