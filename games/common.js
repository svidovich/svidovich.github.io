export const name = "common";

// Draws a border around the canvas!
export const drawCanvasFrame = (canvasContext) => {
  let canvasWidth = canvasContext.canvas.clientWidth;
  let canvasHeight = canvasContext.canvas.clientHeight;
  canvasContext.beginPath();
  canvasContext.moveTo(1, 1);
  canvasContext.lineTo(canvasWidth - 1, 1);
  canvasContext.lineTo(canvasWidth - 1, canvasHeight - 1);
  canvasContext.lineTo(1, canvasHeight - 1);
  canvasContext.lineTo(1, 1);
  canvasContext.stroke();
};
