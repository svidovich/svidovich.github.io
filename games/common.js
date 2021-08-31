export const name = "common";

export const drawCircle = (canvasContext, x, y, r) => {
  canvasContext.beginPath();
  // void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
  canvasContext.arc(x, y, r, 0, 2 * Math.PI);
  canvasContext.stroke();
};

export const drawRandomColoredCircle = (canvasContext, x, y, r) => {
  canvasContext.beginPath();
  // void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
  canvasContext.arc(x, y, r, 0, 2 * Math.PI);
  let oldStyle = canvasContext.strokeStyle;
  canvasContext.strokeStyle = `rgb(${randomInt(1, 254)}, ${randomInt(1, 254)}, ${randomInt(1, 254)})`;
  canvasContext.stroke();
  canvasContext.strokeStyle = oldStyle;
};

// start and finish are both objects of the form
// {x: int, y: int}
// that describe the coordinate of the top left corner and the
// bottom right corners of the rectange respectively
export const drawRectangle = (canvasContext, start, finish) => {
  canvasContext.strokeRect(start.x, start.y, finish.x - start.x, finish.y - start.y);
};

// Draws a border around the canvas!
export const drawCanvasFrame = (canvasContext) => {
  let start = {
    x: 1,
    y: 1,
  };
  let finish = {
    x: canvasContext.canvas.clientWidth - 1,
    y: canvasContext.canvas.clientHeight - 1,
  };
  drawRectangle(canvasContext, start, finish);
};

export const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
};
