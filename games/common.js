export const name = "common";

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
