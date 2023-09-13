import { randomInt } from "../cards/utilities.js";
import { CrvenkapaBook } from "./data/crvenkapa.js";

const globalCanvas = document.getElementById("workspacecanvas");
let parentFrameWidth = globalCanvas.parentElement.clientWidth;
let parentFrameHeight = globalCanvas.parentElement.clientHeight;
globalCanvas.width = (95 / 100) * parentFrameWidth;
globalCanvas.height = (95 / 100) * parentFrameHeight;
const FONT_SIZE_PX = 10;

let globalCtx = undefined;
const getCtx = (canvasElement, reset = false) => {
  if (globalCtx === undefined || reset === true) {
    globalCtx = canvasElement.getContext("2d");
  }
  return globalCtx;
};

const writeTextWithAlignment = (
  canvasContext, // CanvasRenderingContext2D
  text, // string
  x, // int
  y, // int
  alignment = "left", // string?
  fontSizePx = FONT_SIZE_PX, // int?
  font = "Arial", // string?
  maxWidth = undefined // int?
) => {
  const oldFont = canvasContext.font;
  const oldAlign = canvasContext.textAlign;
  canvasContext.textAlign = alignment;
  canvasContext.font = `${fontSizePx}px ${font}`;
  canvasContext.fillText(text, (x / 2) | 0, (y / 2) | 0);
  canvasContext.font = oldFont;
  canvasContext.textAlign = oldAlign;
};

const cursorLocation = {
  x: undefined,
  y: undefined,
};

class Coordinate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class AbstractCanvasObject {
  constructor() {
    if (this.constructor == AbstractCanvasObject) {
      throw new Error("Instantiation of abstract class");
    }
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  moveBy(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  draw(
    ctx // CanvasRenderingContext2D
  ) {
    throw new Error("Not Implemented");
  }

  containsCoordinate(
    coordinate // Coordinate
  ) {
    throw new Error("Not Implemented");
  }
}

class Button extends AbstractCanvasObject {
  constructor(text, x, y, w, h, color = "red") {
    super();
    this.text = text;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  draw(ctx) {
    const oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = this.color;
    // need to write an adjustment function i think
    ctx.strokeRect((this.x / 2) | 0, (this.y / 2) | 0, (this.w / 2) | 0, (this.h / 2) | 0);
    ctx.strokeStyle = oldStyle;
  }

  containsCoordinate(coordinate) {
    if (
      this.x <= coordinate.x &&
      coordinate.x <= this.x + this.w &&
      this.y <= coordinate.y &&
      coordinate.y <= this.y + this.h
    ) {
      return true;
    } else {
      return false;
    }
  }
}

const myCoolButton = new Button("FART", 150, 150, 100, 50);
const myCoolButton2 = new Button("FART2", 150, 150, 100, 50);
const myCoolButton3 = new Button("FART3", 155, 155, 100, 50);
const myCoolButton4 = new Button("FART4", 255, 255, 100, 50);

const shapes = new Array();
const shapesByLocation = new Object();

shapes.push(myCoolButton);
shapes.push(myCoolButton2);
shapes.push(myCoolButton3);
shapes.push(myCoolButton4);

const locationMap = new Object();

const addObjectToLocationMap = (obj, mapping) => {
  // I think I have to map this for all of the corners of an object
  if (!mapping.hasOwnProperty(obj.x)) {
    mapping[obj.x] = new Object();
  }
  if (!mapping[obj.x].hasOwnProperty(obj.y)) {
    mapping[obj.x][obj.y] = new Array();
  }
  if (!mapping[obj.x].hasOwnProperty(obj.y + obj.h)) {
    mapping[obj.x][obj.y + obj.h] = new Array();
  }
  if (!mapping.hasOwnProperty(obj.x + obj.w)) {
    mapping[obj.x + obj.w] = new Object();
  }
  if (!mapping[obj.x + obj.w].hasOwnProperty(obj.y)) {
    mapping[obj.x + obj.w][obj.y] = new Array();
  }
  if (!mapping[obj.x + obj.w].hasOwnProperty(obj.y + obj.h)) {
    mapping[obj.x + obj.w][obj.y + obj.h] = new Array();
  }
  console.log(locationMap);
  console.log(obj);
  mapping[obj.x][obj.y].push(obj);
  mapping[obj.x][obj.y + obj.h].push(obj);
  mapping[obj.x + obj.w][obj.y].push(obj);
  mapping[obj.x + obj.w][obj.y + obj.h].push(obj);
};

addObjectToLocationMap(myCoolButton, locationMap);
addObjectToLocationMap(myCoolButton2, locationMap);
addObjectToLocationMap(myCoolButton3, locationMap);
addObjectToLocationMap(myCoolButton4, locationMap);

// window.addEventListener("resize", () => {
//   parentFrameWidth = globalCanvas.parentElement.clientWidth;
//   parentFrameHeight = globalCanvas.parentElement.clientHeight;
//   globalCanvas.width = (95 / 100) * parentFrameWidth;
//   globalCanvas.height = (95 / 100) * parentFrameHeight;
//   getCtx(globalCanvas, true);
// });

class PlaneSquare {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }
}

class Partition {
  constructor(start, end, count) {
    this.start = start;
    this.end = end;
    this.elements = new Array();
    this.width = (end - start) / count;
    let bucketStart = start;
    for (let i = 0; i < count; ++i) {
      this.elements.push(bucketStart | 0);
      bucketStart += this.width;
    }
  }
}

const planeFromPartitions = (
  x, // Partition
  y // Partition
) => {
  const plane = new Array();
  if (x.elements.length !== y.elements.length) {
    throw new Error("Partitions must be of equal length, dork");
  }
  for (let i = 0; i < x.elements.length; i++) {
    const xStart = x.elements[i];
    console.log(`partlen ${x.elements.length}, idx ${i}, ${x.end}`);
    const xEnd = i === x.elements.length - 1 ? x.end : x.elements[i + 1];
    for (let j = 0; j < y.elements.length; j++) {
      const yStart = y.elements[j];
      const yEnd = j === y.elements.length - 1 ? y.end : y.elements[j + 1];
      plane.push(new PlaneSquare(xStart, yStart, xEnd, yEnd));
    }
  }
  return plane;
};

const plane = planeFromPartitions(new Partition(0, globalCanvas.width, 4), new Partition(0, globalCanvas.height, 4));

const searchPlaneForObjectsNearLocation = (plane, mappedObjects, locationX, locationY) => {
  // Search the given plane for objects...
  // Mapped objects is a mapped searchable hash table? wtf is this called?
  // Keyed like
  // {xvalue: {yvalue: Object, yvalue2: Object2}, xvalue2: {yvalue3: Object3}}
  // Values don't exist unless there's something there.
  // The algo goes like this:
  // For every square in the plane,
  const objectsFound = new Array();
  plane.forEach((square) => {
    // If that square contains our location, we should continue. Otherwise, who cares?
    if (
      square.startX <= locationX &&
      locationX <= square.endX &&
      square.startY <= locationY &&
      locationY <= square.endY
    ) {
      // For every key of our goofy map structure, uniquely, which we know to be
      // the x-ordinate for some object,
      new Set(Object.keys(mappedObjects)).forEach((objectsXOrdinate) => {
        // If the x-ordinate of the object lies inside the x-boundaries of our
        // square, continue to the next phase.
        if (square.startX < objectsXOrdinate && objectsXOrdinate < square.endX) {
          // Now, we know our object is in the right y boundaries. For every abscissa
          // of every object with the x-ordinate we're looking at right now, which we
          // know to be the valid second value of a coordinate pair for some object,
          Object.keys(mappedObjects[objectsXOrdinate]).forEach((objectsYOrdinate) => {
            // If the object's abscissa lies within the y-boundaries of our square,
            // we have found an object in this square.
            if (square.startY < objectsYOrdinate && objectsYOrdinate < square.endY) {
              console.log("Found");
              console.log(mappedObjects[objectsXOrdinate][objectsYOrdinate]);
              console.log("In the square");
              console.log(square);
              console.log(`Which was near ${locationX}, ${locationY}`);
              mappedObjects[objectsXOrdinate][objectsYOrdinate].forEach((foundObject) => {
                if (foundObject.containsCoordinate(new Coordinate(locationX, locationY))) {
                  objectsFound.push(foundObject);
                }
              });
            }
          });
        }
      });
    }
  });
  return objectsFound;
};

let lastObjectsFound = new Array();
globalCanvas.addEventListener("mousemove", (event) => {
  cursorLocation.x = event.offsetX;
  cursorLocation.y = event.offsetY;
  const objectsAtMouseLocation = searchPlaneForObjectsNearLocation(
    plane,
    locationMap,
    cursorLocation.x,
    cursorLocation.y
  );
  if (objectsAtMouseLocation.length !== 0) {
    document.body.style.cursor = "pointer";
    objectsAtMouseLocation.forEach((obj) => {
      obj.color = "green";
    });
  } else {
    document.body.style.cursor = "auto";
  }
  lastObjectsFound.forEach((obj) => {
    if (!objectsAtMouseLocation.includes(obj)) {
      obj.color = "red";
    }
  });
  lastObjectsFound = objectsAtMouseLocation;
});

const update = () => {
  // canvas.width = (95 / 100) * parentFrameWidth;
  // canvas.height = (95 / 100) * parentFrameHeight;
  // const parentFrameWidth = canvas.parentElement.clientWidth;
  // const parentFrameHeight = canvas.parentElement.clientHeight;

  getCtx(globalCanvas).clearRect(0, 0, globalCanvas.width, globalCanvas.height);

  for (const [index, sentence] of Object.entries(CrvenkapaBook.sentences)) {
    writeTextWithAlignment(getCtx(globalCanvas), sentence.jugoslavian, 5, 2 * FONT_SIZE_PX + 3 * FONT_SIZE_PX * index);
  }
  writeTextWithAlignment(
    getCtx(globalCanvas),
    `x: ${cursorLocation.x}, y: ${cursorLocation.y}`,
    5,
    globalCanvas.height - FONT_SIZE_PX * 3
  );
  shapes.forEach((shape) => {
    shape.draw(getCtx(globalCanvas));
  });
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
  window.devicePixelRatio = 2;
  getCtx(globalCanvas).scale(window.devicePixelRatio, window.devicePixelRatio);
  main();
})();
