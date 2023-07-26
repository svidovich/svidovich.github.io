import { CrvenkapaBook } from "./data/crvenkapa.js";

const canvas = document.getElementById("workspacecanvas");
const parentFrameWidth = canvas.parentElement.clientWidth;
const parentFrameHeight = canvas.parentElement.clientHeight;
canvas.width = (95 / 100) * parentFrameWidth;
canvas.height = (95 / 100) * parentFrameHeight;
const canvasContext = canvas.getContext("2d");
const FONT_SIZE_PX = 18;

for (const [index, sentence] of Object.entries(CrvenkapaBook.sentences)) {
  console.log(sentence.jugoslavian);
}
window.devicePixelRatio = 2;
canvasContext.scale(window.devicePixelRatio, window.devicePixelRatio);
const update = () => {
  const parentFrameWidth = canvas.parentElement.clientWidth;
  const parentFrameHeight = canvas.parentElement.clientHeight;
  canvas.width = (95 / 100) * parentFrameWidth;
  canvas.height = (95 / 100) * parentFrameHeight;
  canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  for (const [index, sentence] of Object.entries(CrvenkapaBook.sentences)) {
    const oldFont = canvasContext.font;
    const oldAlign = canvasContext.textAlign;
    canvasContext.textAlign = "left";
    canvasContext.font = `${FONT_SIZE_PX}px Arial`;
    canvasContext.fillText(sentence.jugoslavian, 5, FONT_SIZE_PX + 1.5 * FONT_SIZE_PX * index);
    canvasContext.font = oldFont;
    canvasContext.textAlign = oldAlign;
  }
};

(() => {
  let animationFrameRequestToken;
  const main = (hiResTimeStamp) => {
    try {
      animationFrameRequestToken = window.requestAnimationFrame(main);

      update();
    } catch (error) {
      console.error(error);
      window.webkitCancelAnimationFrame(animationFrameRequestToken);
    }
  };
  main();
})();
