import { randomInt } from "../cards/utilities.js";
import { CrvenkapaBook } from "./data/crvenkapa.js";

// const globalCanvas = document.getElementById("workspacecanvas");
// let parentFrameWidth = globalCanvas.parentElement.clientWidth;
// let parentFrameHeight = globalCanvas.parentElement.clientHeight;
// globalCanvas.width = (95 / 100) * parentFrameWidth;
// globalCanvas.height = (95 / 100) * parentFrameHeight;
const FONT_SIZE_PX = 10;
const WORD_BANK_SPACING_CONSTANT = 15;
const WORD_BANK_SPACING_Y = 75;
const BUTTON_DEFAULT_HEIGHT = 40;

const screenDivisor = 1;

let globalCtx = undefined;
const getCtx = (canvasElement, reset = false) => {
  if (globalCtx === undefined || reset === true) {
    globalCtx = canvasElement.getContext("2d");
  }
  return globalCtx;
};

// const gctx = () => {
//   return getCtx(globalCanvas);
// };

const getLines = (ctx, text, maxWidth) => {
  const words = text.split(" ");
  const lines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
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
  let lines;
  if (maxWidth) {
    lines = getLines(canvasContext, text, maxWidth - x);
  } else {
    lines = [text];
  }
  for (let i = 0; i < lines.length; i++) {
    canvasContext.fillText(lines[i], (x / screenDivisor) | 0, (y + (i * fontSizePx * 1.5) / screenDivisor) | 0);
  }
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
  constructor(text, x, y, h, color = "red") {
    super();
    this.text = text;
    this.x = x;
    this.y = y;
    this.w = text.length * FONT_SIZE_PX * 2;
    this.h = h;
    this.color = color;

    this.vertices = [
      new Coordinate(this.x, this.y),
      new Coordinate(this.x + this.w, this.y),
      new Coordinate(this.x, this.y + this.h),
      new Coordinate(this.x + this.w, this.y + this.h),
    ];
  }

  draw(ctx) {
    const oldStyle = ctx.strokeStyle;
    ctx.strokeStyle = this.color;
    // Begin path or leak memory intensely for no good reason.
    ctx.beginPath();
    ctx.roundRect(
      (this.x / screenDivisor) | 0,
      (this.y / screenDivisor) | 0,
      (this.w / screenDivisor) | 0,
      (this.h / screenDivisor) | 0,
      5
    );
    ctx.stroke();
    ctx.fillText(
      this.text,
      this.x / screenDivisor + (this.w * 1.2) / FONT_SIZE_PX, // may need adjusted
      this.y / screenDivisor + (this.h * 3) / FONT_SIZE_PX // may need adjusted
    );
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

const globalCanvasObjects = new Array();
const globalCanvasObjectsByLocation = new Object();

const addObjectToCanvas = (obj) => {
  // Pushes a given object to the global canvas array, and adds it
  // to the location map. Objects in the array will have their draw()
  // method called in a loop.
  globalCanvasObjects.push(obj);
  addObjectToLocationMap(obj, globalCanvasObjectsByLocation);
};

const addObjectToLocationMap = (obj, mapping) => {
  /*
  A location map is an object of the following form:

  {
    <xCoordinate>: {
      <yCoordinate>: [Object, ...], ...
    }, ...
  }

  We use this in our 'object finding' algorithm that helps us to do
  somewhat efficient collision detection.
  This function adds an object that supplies an array of Coordinate
  objects in a property called 'vertices' to just such a mapping.
  */
  for (const vertex of obj.vertices) {
    // If we've never seen this x value before, add it!
    if (!mapping.hasOwnProperty(vertex.x)) {
      mapping[vertex.x] = new Object();
    }
    // If we've never seen this y value for this given x value before, add it!
    if (!mapping[vertex.x].hasOwnProperty(vertex.y)) {
      mapping[vertex.x][vertex.y] = new Array();
    }
    // Put the object at [x][y].
    mapping[vertex.x][vertex.y].push(obj);
  }
};

const addButtonsFromWordlist = (wordList, startX, startY) => {
  // Given a set of strings and a place to start, add a bunch of
  // hoverable buttons to the canvas.

  let lastButton; // Store the last button we wrote in this!
  for (const [index, element] of wordList.entries()) {
    // If lastButton is undefined, it means we're looking at the first button
    // in our row. We should place the button at startX. Otherwise, we're going
    // to place the button based on its last neighbor's right edge.
    const buttonX = lastButton === undefined ? startX : lastButton.x + lastButton.w + WORD_BANK_SPACING_CONSTANT;
    const thisButton = new Button(element, buttonX, startY, BUTTON_DEFAULT_HEIGHT);

    // If we detect that this button would go beyond the limit of the canvas,
    if (thisButton.x + thisButton.w >= globalCanvas.width) {
      // reset 'lastButton',
      lastButton = undefined;
      // and restart in a new row. The first word of the next row should be our current word.
      addButtonsFromWordlist(wordList.slice(index), startX, startY + WORD_BANK_SPACING_Y);
      // There's some goofy behaviour here if we don't return. I think it's something to do
      // with the loop construct -- we pass the end of the list more than once if we don't
      return;
    } else {
      // Otherwise, everything is normal. We can just add a word.
      lastButton = thisButton;
      addObjectToCanvas(thisButton);
    }
  }
};

// addButtonsFromWordlist(
//   [
//     "Ja",
//     "se",
//     "vracam",
//     "i",
//     "ne",
//     "biti",
//     "super",
//     "doline",
//     "prababa",
//     "rakija",
//     "rajice",
//     "momak",
//     "slatko",
//     "zora",
//     "hajduci",
//     "junak",
//     "ustanka",
//     "sloboda",
//   ],
//   105,
//   405
// );

console.log(CrvenkapaBook);

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
    // Create our list of elements by ( as evenly as we can )
    // dividing the space into count buckets.
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
  // Create a divided plane from a pair of partitions.
  const plane = new Array();
  if (x.elements.length !== y.elements.length) {
    throw new Error("Partitions must be of equal length, dork");
  }
  // For every element of the first partition,
  for (let i = 0; i < x.elements.length; i++) {
    // the plane square's starting x position is going to be this element.
    const xStart = x.elements[i];
    // The plane square's ending x position is either:
    // - the next element when we're not at the penultimate element
    // - the last element when we are
    const xEnd = i === x.elements.length - 1 ? x.end : x.elements[i + 1];
    // The same logic is repeated to get the y coordinates from the second partition
    for (let j = 0; j < y.elements.length; j++) {
      const yStart = y.elements[j];
      const yEnd = j === y.elements.length - 1 ? y.end : y.elements[j + 1];
      // When we've got everything, add it to our "plane", which is an array of squares.
      plane.push(new PlaneSquare(xStart, yStart, xEnd, yEnd));
    }
  }
  return plane;
};

// const plane = planeFromPartitions(new Partition(0, globalCanvas.width, 4), new Partition(0, globalCanvas.height, 4));

const searchPlaneForObjectsNearLocation = (plane, mappedObjects, locationX, locationY) => {
  // Search the given plane for objects...
  // Mapped objects is a mapped searchable hash table? wtf is this called?
  // Keyed like
  // {xvalue: {yvalue: Object, yvalue2: Object2}, xvalue2: {yvalue3: Object3}}
  // Values don't exist unless there's something there.
  // The algo goes like this:
  // For every square in the plane,
  const objectsFound = new Set();
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
              mappedObjects[objectsXOrdinate][objectsYOrdinate].forEach((foundObject) => {
                if (foundObject.containsCoordinate(new Coordinate(locationX, locationY))) {
                  objectsFound.add(foundObject);
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
/*
globalCanvas.addEventListener("mousemove", (event) => {
  // When we move the mouse on the canvas we should detect the
  // location of the cursor so that we can perform actions on
  // objects with which the cursor might be colliding at the time
  cursorLocation.x = event.offsetX;
  cursorLocation.y = event.offsetY;
  const objectsAtMouseLocation = searchPlaneForObjectsNearLocation(
    plane,
    globalCanvasObjectsByLocation,
    cursorLocation.x,
    cursorLocation.y
  );
  if (objectsAtMouseLocation.size !== 0) {
    document.body.style.cursor = "pointer";
    objectsAtMouseLocation.forEach((obj) => {
      obj.color = "green";
    });
  } else {
    document.body.style.cursor = "auto";
  }
  lastObjectsFound.forEach((obj) => {
    if (!objectsAtMouseLocation.has(obj)) {
      obj.color = "red";
    }
  });
  lastObjectsFound = objectsAtMouseLocation;
});
*/
const update = () => {
  gctx().clearRect(0, 0, globalCanvas.width, globalCanvas.height);

  gctx().beginPath();
  gctx().moveTo(globalCanvas.width / 2, 25);
  gctx().lineTo(globalCanvas.width / 2, globalCanvas.height - 25);
  gctx().lineWidth = 2;
  gctx().stroke();

  const mySentence =
    "This is a particularly long sentence with a lot of words in it that goes across the center. I can continue to add another sentence, and I am on my way to a paragraph.";
  const another =
    "This is a sentence that goes on the other side of the book. The letters won't run off the edge, though!";

  const sentences = Object.values(CrvenkapaBook.sentences);
  for (let i = 0; i < sentences.length; i++) {
    writeTextWithAlignment(
      gctx(),
      sentences[i].english,
      25,
      25 + 75 * i,
      undefined,
      16,
      "courier",
      globalCanvas.width / 2 - 25
    );
    writeTextWithAlignment(
      gctx(),
      sentences[i].jugoslavian,
      globalCanvas.width / 2 + 25,
      25 + 75 * i,
      undefined,
      16,
      "courier",
      globalCanvas.width - 25
    );
  }
  // const myLines = getLines(gctx(), mySentence, globalCanvas.width / 2 - 25);
  // for (let j = 0; j < myLines.length; j++) {
  //   writeTextWithAlignment(gctx(), myLines[j], 25, 100 + 25 * j, "align", 16, "courier");
  // }

  writeTextWithAlignment(
    gctx(),
    `x: ${cursorLocation.x}, y: ${cursorLocation.y}`,
    5,
    globalCanvas.height - FONT_SIZE_PX * 3
  );
  globalCanvasObjects.forEach((obj) => {
    obj.draw(gctx());
  });
};

window.devicePixelRatio = screenDivisor;
// gctx().scale(window.devicePixelRatio, window.devicePixelRatio);

// finally query the various pixel ratios
/*
const devicePixelRatio = window.devicePixelRatio || 1;
const backingStoreRatio =
  gctx().webkitBackingStorePixelRatio ||
  gctx().mozBackingStorePixelRatio ||
  gctx().msBackingStorePixelRatio ||
  gctx().oBackingStorePixelRatio ||
  gctx().backingStorePixelRatio ||
  1;
const ratio = devicePixelRatio / backingStoreRatio;

// upscale the canvas if the two ratios don't match
if (devicePixelRatio !== backingStoreRatio) {
  const oldWidth = globalCanvas.width;
  const oldHeight = globalCanvas.height;

  globalCanvas.width = oldWidth * ratio;
  globalCanvas.height = oldHeight * ratio;

  globalCanvas.style.width = oldWidth + "px";
  globalCanvas.style.height = oldHeight + "px";

  // now scale the context to counter
  // the fact that we've manually scaled
  // our canvas element
  gctx().scale(ratio, ratio);
}
*/
(() => {
  // let animationFrameRequestToken;
  // const main = (hiResTimeStamp) => {
  //   try {
  //     animationFrameRequestToken = window.requestAnimationFrame(main);

  //     update();
  //   } catch (error) {
  //     console.error(error);
  //     window.webkitCancelAnimationFrame(animationFrameRequestToken);
  //   }
  // };
  const main = () => {
    const ws = document.getElementById("workspacediv");
    Object.entries(CrvenkapaBook.sentences).forEach((entry) => {
      const [idx, sentence] = entry;
      const lp = document.createElement("p");
      lp.classList.add("storyparagraphs");
      const lt = document.createTextNode(sentence.english);
      lp.appendChild(lt);
      lp.id = `left-text-${idx}`;
      ws.appendChild(lp);

      const rp = document.createElement("p");
      rp.classList.add("storyparagraphs");
      const rt = document.createTextNode(sentence.jugoslavian);
      rp.appendChild(rt);
      rp.id = `right-text-${idx}`;
      ws.appendChild(rp);

      [lp, rp].forEach((paragraph) => {
        paragraph.addEventListener("mouseover", () => {
          lp.style.color = "darkslateblue";
          rp.style.color = "darkslateblue";
        });
        paragraph.addEventListener("mouseleave", () => {
          lp.style.color = "black";
          rp.style.color = "black";
        });
      });
    });
    // leftPage.textContent += sentence.english;
    // leftPage.textContent += "\n\n";
  };

  main();
})();
