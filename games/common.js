export const name = "common";

// For computing the distance between two points
// A and B, each with a component x and a component y
export const distance = (A, B) => {
  return Math.sqrt(Math.pow(B.y - A.y, 2) + Math.pow(B.x - A.x, 2));
};

export const drawCircle = (canvasContext, x, y, r) => {
  canvasContext.beginPath();
  // void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
  canvasContext.arc(x, y, r, 0, 2 * Math.PI);
  canvasContext.stroke();
};

export const drawDisc = (canvasContext, x, y, r) => {
  canvasContext.beginPath();
  // void ctx.arc(x, y, radius, startAngle, endAngle [, counterclockwise]);
  canvasContext.arc(x, y, r, 0, 2 * Math.PI);
  canvasContext.fill();
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
  // Note that it's not start -> destination, it's start and size
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

// Swept collision detection: checks if a line segment intersects a circle
// This solves the "bullet tunneling" problem where fast projectiles skip over enemies
// lineStart: {x, y} - starting point of the line segment
// lineEnd: {x, y} - ending point of the line segment
// circleCenter: {x, y} - center of the circle
// circleRadius: number - radius of the circle
// Returns: boolean - true if the line segment intersects the circle
export const lineCircleIntersection = (lineStart, lineEnd, circleCenter, circleRadius) => {
  // Vector from line start to line end
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;

  // Vector from line start to circle center
  const fx = lineStart.x - circleCenter.x;
  const fy = lineStart.y - circleCenter.y;

  // Quadratic formula coefficients for line-circle intersection
  // We're solving: ||lineStart + t * direction - circleCenter||^2 = radius^2
  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = (fx * fx + fy * fy) - circleRadius * circleRadius;

  // Discriminant tells us if there's an intersection
  const discriminant = b * b - 4 * a * c;

  // No intersection if discriminant is negative
  if (discriminant < 0) {
    return false;
  }

  // Calculate the two possible intersection points along the infinite line
  const discriminantSqrt = Math.sqrt(discriminant);
  const t1 = (-b - discriminantSqrt) / (2 * a);
  const t2 = (-b + discriminantSqrt) / (2 * a);

  // Check if either intersection point is within our line segment (0 <= t <= 1)
  // t1 is the first intersection point, t2 is the second
  if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
    return true;
  }

  // Also check if the circle contains the entire segment
  // (both endpoints inside the circle)
  if (t1 < 0 && t2 > 1) {
    return true;
  }

  return false;
};

// The objects in the array need to have a 'queueDeletion' property
export const garbageCollectObjects = (arrayOfObjects) => {
  arrayOfObjects.forEach((deletableObject) => {
    if (deletableObject.queueDeletion === true) {
      const deletableObjectIndex = arrayOfObjects.indexOf(deletableObject);
      arrayOfObjects.splice(deletableObjectIndex, 1);
    }
  });
};
