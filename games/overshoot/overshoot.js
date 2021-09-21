import { distance, drawCircle, drawDisc, garbageCollectObjects, randomInt, drawRectangle } from "../common.js";

// We need to chill with the DOM to warn our user about cookies.
const cookieBanner = document.getElementById("cookie-banner");
const cookieCloseButton = document.getElementById("close");
const cookieBailButton = document.getElementById("noway");
if (localStorage.getItem("cookieSeenOvershoot") === "shown") {
  cookieBanner.style.display = "none";
}

cookieCloseButton.onclick = () => {
  cookieBanner.style.display = "none";
  localStorage.setItem("cookieSeenOvershoot", "shown");
};

cookieBailButton.onclick = () => {
  location.href = "index.html";
};

// Things we want to be global

let canvas = document.getElementById("mainCanvas");
let canvasContext = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

let { left: canvasLeftEdgeX, top: canvasTopEdgeY } = canvas.getBoundingClientRect();

// Magic numbers
// How big should the status bar be? This big:
const statusBarHeight = 50;
// Used in the projectile calculations. Yes, earth gravity. It would be
// kind of neat / cute if we were to have our catapult destroy targets
// on different planets, with accurate gravity constants ;D
const gravity = -9.8;
// The internet tells me that rAF tends to hit about 60 times per second.
// So be it, our frame rate is 60fps, like it or lump it.
const roughFrameRate = 1 / 60;
// In radians, this is how much we update when we receive an event to change
// where the catapult aims. It's set very low because I wanted a limiter for
// how fast the user's aim changed ( to avoid ragequitting because of aim
// that is too sensitive ) but I didn't want to explicitly time debounce.
let aimAdjustInterval = 0.03;
// A sort of percentage -- we use this in a product. At its base, this means
// that we're reducing to 20% of some whole number. Thus, the higher this is,
// the more power with which we launch projectiles.
let launchPowerDivisor = 0.2;
// The actual radius of projectiles. We're kind of assuming that bigger projectiles
// means an easier game, since it *should* make targets easier to hit.
let ammoSize = 6;
// The player starts out with 4 projectiles. Perhaps, through upgrades, they
// can get some more. If they're lucky and I'm gracious.
let playerAmmoCount = 4;
// If this is set to true, then a projectile can hit a target and not be destroyed
// until it either leaves the screen or hits one more target. In essence, this gives
// projectiles a little bit of 'health'.
let crashThroughActive = false;
// If this is set to true, as a player moves the aiming reticle for the catapult,
// the parabolic line matching the angle and a reasonable initial velocity will be
// drawn, to help the player aim at targets. This is going to be SO COOL
let drawAimLineActive = false;

// Status stuff
let controlsPaused = false;

let needToCheckUpgrades = false;

const GameInterfaces = Object.freeze({
  mainMenu: "mainMenu",
  levelSelect: "levelSelect",
  shop: "shop",
  targetPractice: "targetPractice",
  battlefield: "battlefield",
});

let currentInterface = GameInterfaces.mainMenu;

// This is a mapping of upgrade names to callables that make
// their effects happen in-game. The callables should be
// somewhat close to idempotent.
const upgradeStruct = {
  moreAmmoOs: () => {
    playerAmmoCount = 6;
  },
  mostAmmoOS: () => {
    playerAmmoCount = 10;
  },
  biggerAmmoOS: () => {
    ammoSize = 12;
  },
  hiPowerOS: () => {
    launchPowerDivisor = 0.4;
  },
  crashThroughOS: () => {
    crashThroughActive = true;
  },
  drawAimLineOS: () => {
    drawAimLineActive = true;
  },
};

// User data!
const setUpGameData = () => {
  let data = {
    numbers: ["lootOS"],
    upgrades: Object.keys(upgradeStruct),
  };
  data.numbers.forEach((numericValue) => {
    if (localStorage.getItem(numericValue) === null) {
      localStorage.setItem(numericValue, 0);
    }
  });
  data.upgrades.forEach((upgrade) => {
    if (localStorage.getItem(upgrade) === null) {
      localStorage.setItem(upgrade, { purchased: false, active: false, applied: false });
    }
  });
};

const updateUpgrades = () => {
  Object.entries(upgradeStruct).forEach((entry) => {
    // Destruct entries into key / value.
    const [key, value] = entry;
    // We may have purchased something, but it may not be active.
    // For example, if we have purchased both ammo quanitity
    // upgrades, only one should be active at a time.
    let { purchased, active, applied } = localStorage.getItem(key);
    // NOTE
    // Honestly I'm not sure about this block of code. I don't
    // really know what's going to happen when I have two upgrades
    // that have an effect on the same... stuff. Stuff? Stuff. If
    // anything goofy happens between upgrades, it's probably this.
    // I can't think the six steps ahead right this second, I will
    // like to see it in action to debug.
    if (!applied) {
      if (purchased && active) {
        // This is a callable, so let's call it.
        value.call();
        applied = true;
      }
      localStorage.setItem(key, {
        purchased: purchased,
        active: active,
        applied: applied,
      });
    }
  });
  // At the end, we should always put the 'check upgrades' flag
  // back to being false.
  needToCheckUpgrades = false;
};

setUpGameData();
updateUpgrades();

class MenuItem {
  constructor(x, y, w, h) {
    if (this.constructor === MenuItem) {
      throw new Error("Refusing to instantiate abstract class MenuItem.");
    }
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  get coordinates() {
    return { x: this.x, y: this.y };
  }

  draw(canvasContext) {
    throw new Error("Method 'draw()' must be implemented.");
  }

  clickAction() {
    throw new Error("Method 'clickAction()' must be implemented.");
  }

  isClicked(clickCoordinates) {
    const { x: clickX, y: clickY } = clickCoordinates;
    if (clickX >= this.x && clickX <= this.x + this.w && clickY >= this.y && clickY <= this.y + this.h) {
      this.clickAction();
    }
  }
}

class MainMenuTargetPractice extends MenuItem {
  constructor(x, y, w, h) {
    super(x, y, w, h);
  }

  draw(canvasContext) {
    // Drawing the target practice button
    canvasContext.strokeRect(this.x, this.y, this.w, this.h);
    drawTarget(canvasContext, this.w / 2 + this.x, this.h / 2 + this.y, (this.w + this.h) / 4);
    canvasContext.fillText("Target ", this.w / 2 + this.x - 15, this.h / 2 + this.y);
    canvasContext.fillText("Practice!", this.w / 2 + this.x - 20, this.h / 2 + this.y + 10);
  }

  clickAction() {
    currentInterface = GameInterfaces.targetPractice;
  }
}

class MainMenuShopLink extends MenuItem {
  constructor(x, y, w, h) {
    super(x, y, w, h);
  }

  draw(canvasContext) {
    canvasContext.strokeRect(this.x, this.y, this.w, this.h);
    const oldFont = canvasContext.font;
    canvasContext.font = `bold ${this.w}px courier`;
    canvasContext.fillText("$", this.x, this.y + this.h - this.h / 3);
    canvasContext.font = `bold ${this.w / 4}px courier`;
    canvasContext.fillText("Shop", this.x + this.w / 3, this.y + this.h - this.w / 12);
    canvasContext.font = oldFont;
  }
  clickAction() {
    currentInterface = GameInterfaces.shop;
  }
}

// To be used Anywhere! Designed to be a rectangle.
class MainMenuLink extends MenuItem {
  constructor(x, y) {
    const w = 100;
    const h = 25;
    super(x, y, w, h);
    this.w = w;
    this.h = h;
  }

  draw(canvasContext) {
    canvasContext.strokeRect(this.x, this.y, this.w, this.h);
    const oldFont = canvasContext.font;
    canvasContext.font = `bold ${this.h / 2}px courier`;
    canvasContext.fillText("Main Menu", this.x + this.w / 6, this.y + this.h / 1.5);
    canvasContext.font = oldFont;
  }

  guaranteedClickActions() {
    currentInterface = GameInterfaces.mainMenu;
  }

  extraClickActions() {
    return;
  }

  clickAction() {
    this.guaranteedClickActions();
    this.extraClickActions();
  }
}

let mainMenuItems = new Array();
mainMenuItems.push(new MainMenuTargetPractice(100, 100, 100, 100));
mainMenuItems.push(new MainMenuShopLink(250, 100, 100, 100));
const drawMainMenu = (canvasContext) => {
  mainMenuItems.forEach((item) => {
    item.draw(canvasContext);
  });
};

const mainMenuClickHandler = (canvasContext, clickCoordinates) => {
  const { x, y } = clickCoordinates;
  // Yeah this really sucks lol. The menu icon could have a member function that does this
  // so I never have to write this code.
  mainMenuItems.forEach((item) => {
    return item.isClicked(clickCoordinates);
  });
};

class ShopItem extends MenuItem {
  constructor(x, y, cost, description, storageKey, purchaseAction, imagePath) {
    let w = 100;
    let h = 100;
    super(x, y, w, h);
    this.cost = cost;
    this.description = description;
    this.storageKey = storageKey;
    this.purchaseAction = purchaseAction;
    this.imagePath = imagePath;

    this.loadImage();
  }

  loadImage() {
    if (this.imagePath !== undefined) {
      this.image = new Image();
      this.image.src = this.imagePath;
    } else {
      this.image = null;
    }
  }

  clickAction() {
    if (localStorage.getItem("lootOS") < this.cost) {
      console.log("Not enough cash");
    } else {
      localStorage.setItem(this.storageKey, { purchased: true, active: true, applied: true });
      // Set a flag that we should check upgrades.
      needToCheckUpgrades = true;
    }
  }

  draw(canvasContext) {
    canvasContext.strokeRect(this.x, this.y, this.w, this.h);
    // this.drawIcon();
    const oldFont = canvasContext.font;
    canvasContext.font = `14px bold courier`;
    canvasContext.fillText(this.description, this.x + this.w / 10, this.y + this.h + 14);
    canvasContext.fillText(`$${this.cost}`, this.x + this.w / 3, this.y + this.h + 28);
    if (this.image !== null) {
      canvasContext.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    canvasContext.font = oldFont;
  }
}

let shopItems = new Array();
const biggerAmmoPurchaseAction = { type: "switch" };
let biggerAmmo = new ShopItem(
  100,
  125,
  250,
  "Bigger Ammo",
  "biggerAmmoOS",
  biggerAmmoPurchaseAction,
  "./overshoot/media/biggerAmmo.png"
);

let moreAmmo = new ShopItem(
  250,
  125,
  500,
  "More Ammo",
  "biggerAmmoOS",
  biggerAmmoPurchaseAction,
  "./overshoot/media/moreAmmo.png"
);

let crashThrough = new ShopItem(
  400,
  125,
  750,
  "Two-Hit Ammo",
  "biggerAmmoOS",
  biggerAmmoPurchaseAction,
  "./overshoot/media/crashThrough.png"
);

shopItems.push(new MainMenuLink(25, 25));
shopItems.push(biggerAmmo);
shopItems.push(moreAmmo);
shopItems.push(crashThrough);

// Starting to feel moist
const drawShop = (canvasContext) => {
  shopItems.forEach((item) => {
    item.draw(canvasContext);
  });
};

// Definitely moist. Needs to be... DRY
const shopClickHandler = (canvasContext, clickCoordinates) => {
  shopItems.forEach((item) => {
    return item.isClicked(clickCoordinates);
  });
};

const levelSelectClickHandler = (canvasContext) => {};

let onScreenProjectiles = new Array();
let onScreenTargets = new Array();

const InputKeys = {
  space: 32,
  lshift: 16,
  up: 38,
  down: 40,
  enter: 13,
};

// Some day, especially if I try to make a multiplayer game,
// this class will probably be a subclass to whatever the player
// characters are. For now, I guess it's not the worst thing ever
// that it's out here.
class Input {
  constructor() {
    this.space = false;
    this.firedFlag = false;
    this.up = false;
    this.down = false;
    this.enter = false;
    this.lshift = false;

    this.register();
  }

  changeInputByEventType = (eventType) => {
    if (eventType === "keydown") {
      return true;
    } else if (eventType === "keyup") {
      return false;
    }
  };

  register() {
    window.addEventListener("keydown", this.keySwitch);
    window.addEventListener("keyup", this.keySwitch);
  }

  // a function for telling which key we pressed
  keySwitch = (keyPressEvent) => {
    // We've been handed an event containing a keypress.
    // What key is it that was pressed?
    const keyCode = keyPressEvent.keyCode;
    const eventType = keyPressEvent.type;

    switch (keyCode) {
      case InputKeys.space:
        this.space = this.changeInputByEventType(eventType);
        // When we release the space bar, we should set a flag that we can
        // retrieve later when we're firing -- that means we're done charging
        // up, and it's time to release our projectile.
        if (eventType === "keyup") {
          this.firedFlag = true;
        }
        break;
      case InputKeys.up:
        this.up = this.changeInputByEventType(eventType);
        break;
      case InputKeys.down:
        this.down = this.changeInputByEventType(eventType);
        break;
      case InputKeys.enter:
        this.enter = this.changeInputByEventType(eventType);
        break;
      case InputKeys.lshift:
        this.shift = this.changeInputByEventType(eventType);
        break;
    }
  };
}

class Target {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.value = 0;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

const drawTarget = (canvasContext, x, y, r) => {
  const oldFillStyle = canvasContext.fillStyle;
  // We want to alternate colours between white and red,
  // starting with red. We can do so with a quick parity
  // check based on the ring count.
  for (let i = 1; i <= 4; i++) {
    canvasContext.fillStyle = i % 2 === 0 ? "white" : "red";
    drawDisc(canvasContext, x, y, r - 4 * i);
    canvasContext.fillStyle = oldFillStyle;
  }
};

class Catapult {
  constructor(x, y, angle, size, ammoCount) {
    this.x = x;
    this.y = y;
    this.angle = angle || 0;
    this.size = size || 1;

    this.ammoCount = ammoCount || 3;

    this.launchingPower = 0;
    this.lastPowerChange = 0; // Becomes date time
    this.powerChangeDebounceTime = 0.1; // ms
    this.maxPower = 100;
    this.fired = false;
  }

  aimAdjust(da) {
    this.angle += da;
  }

  powerAdjust(dP, reset) {
    if (Date.now() - this.lastPowerChange > this.powerChangeDebounceTime) {
      if (reset !== true) {
        // Don't let use exceed max power. Just set to max instead.
        if (this.launchingPower + dP > this.maxPower) {
          this.launchingPower = this.maxPower;
        } else {
          this.launchingPower += dP;
        }
        // Reset flag allows us to just update power to 0.
      } else {
        this.launchingPower = 0;
      }
      // Set this so that we can debounce.
      this.lastPowerChange = Date.now();
    }
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  get catapultState() {
    return {
      x: this.x,
      y: this.y,
      angle: this.angle,
    };
  }
}

class Projectile {
  constructor(x, y, size, v0, a0) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.r = this.size;
    this.v0 = v0; // Initial velocity
    this.a0 = a0; // Initial Angle
    this.t = 0;

    this.queueDeletion = false;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  adjustPosition() {
    this.t += roughFrameRate;
    this.x += this.v0 * Math.cos(this.a0) * this.t;
    // The sign for the addition on the y term is positive here because of our reference
    // frame. The origin is in the _top_ left, not the bottom left, so the math is
    // slightly goofy. The x term is the same, because x is still increasing left-to-right.
    this.y += this.t * this.v0 * Math.sin(this.a0) - 0.5 * gravity * Math.pow(this.t, 2);
    // If we're off screen to the right or the bottom, we should get garbage collected
    if (this.x > canvasWidth || this.y > canvasHeight) {
      this.queueDeletion = true;
    }
  }
}

const fireCatapult = (catapult) => {
  // If we're not already in the middle of firing,
  if (controlsPaused !== true && catapult.ammoCount > 0) {
    onScreenProjectiles.push(
      new Projectile(
        catapult.x,
        // This should prolly be constantized, but meh. It's the location of
        // the top bolt.
        catapult.y - 10 * playerCatapult.size + 2,
        ammoSize,
        // If we don't reduce this a touch, it's too fast, lol.
        catapult.launchingPower * launchPowerDivisor,
        catapult.angle
      )
    );
    catapult.ammoCount -= 1;
    controlsPaused = true;
  }
};

const updateCatapultFromInput = (inputObject, catapult) => {
  if (onScreenProjectiles.length === 0) {
    controlsPaused = false;
  }
  if (controlsPaused !== true) {
    if (inputObject.up === true) {
      // Make sure we don't go too far overhead
      if (catapult.angle - aimAdjustInterval < -Math.PI / 2) {
        catapult.angle = -Math.PI / 2;
      } else {
        catapult.aimAdjust(-aimAdjustInterval);
      }
    }
    if (inputObject.down === true) {
      // Make sure we don't go too far out front
      if (catapult.angle + aimAdjustInterval > 0) {
        catapult.angle = 0;
      } else {
        catapult.aimAdjust(aimAdjustInterval);
      }
    }
    // If we're holding the space key, let's try to adjust the
    // catapult's launching power.
    if (inputObject.space === true) {
      catapult.powerAdjust(1);
      // Otherwise, we aren't holding the space key.
    } else {
      if (inputObject.firedFlag === true) {
        fireCatapult(catapult);
        inputObject.firedFlag = false;
      }
      // Don't poweradjust to 0 unless we have to. There's
      // more compute involved there. We would rather do a simple
      // check here to see if we're already at 0.
      if (catapult.launchingPower !== 0) {
        catapult.powerAdjust(0, true);
      }
    }
  }
};

const updateGlobalEnvironmentFromInput = (inputObject) => {
  // Enable precision aiming
  if (inputObject.shift === true) {
    aimAdjustInterval = 0.003;
  } else {
    aimAdjustInterval = 0.03;
  }
};

const drawCatapultFrame = (canvasContext, catapult) => {
  let { x: catapultX, y: catapultY } = catapult.coordinates;
  let catapultSize = catapult.size;
  let baseStart = {
    x: catapultX - 12 * catapultSize,
    y: catapultY - 3 * catapultSize,
  };
  let baseFinish = {
    x: catapultX + 12 * catapultSize,
    // This is just Y because the coordinates of the catapult
    // point to the very center at the very bottom.
    y: catapultY,
  };
  drawRectangle(canvasContext, baseStart, baseFinish);

  let pillarStart = {
    x: catapultX + 1 * catapultSize,
    y: catapultY - 12 * catapultSize,
  };
  let pillarFinish = {
    x: catapultX + 4 * catapultSize,
    y: catapultY - 3 * catapultSize,
  };
  drawRectangle(canvasContext, pillarStart, pillarFinish);

  // Drawing the braces on the front
  canvasContext.beginPath();
  canvasContext.moveTo(catapultX + 4 * catapultSize, catapultY - 10 * catapultSize);
  canvasContext.lineTo(catapultX + 12 * catapultSize, catapultY - 3 * catapultSize);
  canvasContext.moveTo(catapultX + 4 * catapultSize, catapultY - 8 * catapultSize);
  canvasContext.lineTo(catapultX + 10 * catapultSize, catapultY - 3 * catapultSize);
  canvasContext.stroke();

  // Decorating with some circles
  drawCircle(canvasContext, catapultX + 2 * catapultSize + 2, catapultY - 2 * catapultSize + 2, catapultSize);
  drawCircle(canvasContext, catapultX + 2 * catapultSize + 2, catapultY - 10 * catapultSize + 2, catapultSize);
  drawCircle(canvasContext, catapultX - 10 * catapultSize, catapultY - 2 * catapultSize + 2, catapultSize);
  drawCircle(canvasContext, catapultX + 11 * catapultSize, catapultY - 2 * catapultSize + 2, catapultSize);
};

const drawCatapultArmAndBucket = (canvasContext, catapult) => {
  const { x: catapultX, y: catapultY } = catapult.coordinates;
  const catapultSize = catapult.size;
  const hingeX = catapultX + 2 * catapultSize + 2;
  const hingeY = catapultY - 2 * catapultSize + 2;

  canvasContext.beginPath();

  canvasContext.moveTo(hingeX, hingeY);
  canvasContext.lineTo(hingeX, hingeY - 2 * catapultSize);
  canvasContext.lineTo(hingeX - 10 * catapultSize, hingeY - 10 * catapultSize);
  canvasContext.lineTo(hingeX - 12 * catapultSize, hingeY - 7 * catapultSize);
  canvasContext.lineTo(hingeX - 9 * catapultSize, hingeY - 5 * catapultSize);
  canvasContext.lineTo(hingeX - 7 * catapultSize, hingeY - 6 * catapultSize);
  canvasContext.lineTo(hingeX, hingeY);

  canvasContext.stroke();
};

const drawCatapultAimingLine = (canvasContext, catapult) => {
  const { x: catapultX, y: catapultY } = catapult.coordinates;
  const yAimPoint = catapultY - 10 * catapult.size + 2;

  const catapultSize = catapult.size;
  const angle = catapult.angle;
  const oldStrokeStyle = canvasContext.strokeStyle;
  const oldLineWidth = canvasContext.lineWidth;

  canvasContext.strokeStyle = "red";
  canvasContext.lineWidth = 3;
  canvasContext.beginPath();
  canvasContext.moveTo(
    catapultX + catapultSize * 14 * Math.cos(angle),
    yAimPoint + catapultSize * 14 * Math.sin(angle)
  );
  canvasContext.lineTo(
    catapultX + catapultSize * 28 * Math.cos(angle),
    yAimPoint + catapultSize * 28 * Math.sin(angle)
  );
  canvasContext.stroke();
  canvasContext.strokeStyle = oldStrokeStyle;
  canvasContext.lineWidth = oldLineWidth;
};

const getRandomTargetLocation = () => {
  // Stick to QI?
  return {
    x: randomInt(canvasWidth / 2, canvasWidth),
    y: randomInt(statusBarHeight, canvasHeight / 2),
  };
};

// An updated version which accounts for the size of both the
// projectile and the entity. This is for projectiles and entities
// that are either circular or that have circular hitboxes, and that
// have a component 'r' representing their radii.
// In addition, it's only going to run through all of the entities
// and projectiles if there's some of each to run through.
const computeCollisions = (projectiles, entities) => {
  if (entities.length > 0 && projectiles.length > 0) {
    entities.forEach((entity) => {
      projectiles.forEach((projectile) => {
        if (distance(projectile, entity) - projectile.r - entity.r <= 0) {
          projectile.queueDeletion = true;
          entity.queueDeletion = true;

          // Let's earn some cash
          if (typeof entity.value === "number") {
            let currentLoot = parseInt(localStorage.getItem("lootOS"));
            localStorage.setItem("lootOS", currentLoot + entity.value);
          }
        }
      });
    });
  }
};

// It's definitely not ideal to re-instantiate these variables
// every time the screen is updated!
const statusItemsFont = "12px courier";
const midBarText = statusBarHeight / 2 + 4;
const angleMeterLocationX = 50;
const powerMeterLocationX = 400;
const powerMeterLocationY = statusBarHeight / 2 - 4;
const ammoMeterLocationX = 160;
const drawStatusBar = (canvasContext, playerCatapult) => {
  const oldFillStyle = canvasContext.fillStyle;
  const oldStrokeStyle = canvasContext.strokeStyle;
  const oldFont = canvasContext.font;
  canvasContext.font = statusItemsFont;

  canvasContext.strokeRect(0, 0, canvasWidth, statusBarHeight);

  const convertedAngle = -parseFloat(`${(playerCatapult.angle * 180) / Math.PI}`).toFixed(2);
  canvasContext.fillText(`Angle: ${convertedAngle}°`, angleMeterLocationX, midBarText);

  canvasContext.fillText("Power:", powerMeterLocationX - 50, midBarText);
  const powerBarGradient = canvasContext.createLinearGradient(powerMeterLocationX, 0, powerMeterLocationX + 100, 0);
  powerBarGradient.addColorStop(0.0, "green");
  powerBarGradient.addColorStop(0.333, "yellow");
  powerBarGradient.addColorStop(0.666, "orange");
  powerBarGradient.addColorStop(1.0, "red");
  canvasContext.fillStyle = powerBarGradient;
  canvasContext.fillRect(powerMeterLocationX, powerMeterLocationY, playerCatapult.launchingPower, 10);
  canvasContext.fillStyle = oldFillStyle;

  canvasContext.fillText("Ammo:", ammoMeterLocationX, midBarText);
  for (let i = 1; i <= playerCatapult.ammoCount; i++) {
    drawCircle(canvasContext, ammoMeterLocationX + 35 + 10 * i, midBarText - 3, 3);
  }

  canvasContext.fillText(`Cash: ${localStorage.getItem("lootOS")}`, canvasWidth - 150, midBarText);

  canvasContext.font = oldFont;
};

let playerCatapult = new Catapult(75, 600, 0, 4, playerAmmoCount);
let playerInput = new Input();

let targetPracticePrepared = false;
const prepareTargetPractice = () => {
  // Reset the current count of on screen targets.
  onScreenTargets.length = 0;
  for (let i = 1; i <= 4; i++) {
    // Destruct & rename
    let { x: randomX, y: randomY } = getRandomTargetLocation();
    let nextTarget = new Target(randomX, randomY, 20);
    nextTarget.value = 3;
    onScreenTargets.push(nextTarget);
  }
  targetPracticePrepared = true;
};

let battleFieldItems = new Array();
let targetPracticeMenuButton = new MainMenuLink(canvasWidth - 110, canvasHeight - 30);
targetPracticeMenuButton.extraClickActions = () => {
  targetPracticePrepared = false;
  // NOTE
  // Is this an OK practice for state management? If this gets ugly, we'll
  // rip it out in favor of some kind of meta state manager, I suppose.
  playerCatapult.ammoCount = playerAmmoCount;
};
battleFieldItems.push(targetPracticeMenuButton);
const drawBattleField = (canvasContext) => {
  updateGlobalEnvironmentFromInput(playerInput);
  updateCatapultFromInput(playerInput, playerCatapult);

  drawStatusBar(canvasContext, playerCatapult);
  drawCatapultFrame(canvasContext, playerCatapult);
  drawCatapultArmAndBucket(canvasContext, playerCatapult);
  drawCatapultAimingLine(canvasContext, playerCatapult);

  onScreenTargets.map((target) => {
    drawTarget(canvasContext, target.x, target.y, target.r);
  });

  onScreenProjectiles.map((projectile) => {
    projectile.adjustPosition();
    drawCircle(canvasContext, projectile.x, projectile.y, projectile.r);
  });
  computeCollisions(onScreenProjectiles, onScreenTargets);
  garbageCollectObjects(onScreenProjectiles);
  garbageCollectObjects(onScreenTargets);
  battleFieldItems.forEach((item) => {
    item.draw(canvasContext);
  });
};

const battlefieldClickHandler = (canvasContext, clickCoordinates) => {
  // Here I am again, rewriting this stupid code. I even had to rearrange the
  // whole document to write this code. This is dumb, again.
  battleFieldItems.forEach((item) => {
    return item.isClicked(clickCoordinates);
  });
};

const targetPracticeClickHandler = (canvasContext, clickCoordinates) => {
  battlefieldClickHandler(canvasContext, clickCoordinates);
};

const interfaceClickHandler = (canvasContext, clickEvent) => {
  let clickCoordinates = {
    x: clickEvent.clientX - canvasLeftEdgeX,
    y: clickEvent.clientY - canvasTopEdgeY,
  };
  switch (currentInterface) {
    case GameInterfaces.mainMenu:
      mainMenuClickHandler(canvasContext, clickCoordinates);
      break;
    case GameInterfaces.levelSelect:
      levelSelectClickHandler(canvasContext);
      break;
    case GameInterfaces.shop:
      shopClickHandler(canvasContext, clickCoordinates);
      break;
    case GameInterfaces.battlefield:
      battlefieldClickHandler(canvasContext, clickCoordinates);
      break;
    case GameInterfaces.targetPractice:
      targetPracticeClickHandler(canvasContext, clickCoordinates);
      break;
  }
};

canvas.addEventListener("click", interfaceClickHandler.bind(null, canvasContext));

const update = () => {
  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
  if (needToCheckUpgrades === true) {
    updateUpgrades();
  }
  if (currentInterface === null) {
    currentInterface = GameInterfaces.mainMenu;
  }
  if (currentInterface === GameInterfaces.mainMenu) {
    drawMainMenu(canvasContext);
  } else if (currentInterface === GameInterfaces.targetPractice) {
    if (targetPracticePrepared === false) {
      prepareTargetPractice();
    }
    drawBattleField(canvasContext);
  } else if (currentInterface === GameInterfaces.shop) {
    drawShop(canvasContext);
  }
};

(() => {
  let animationFrameRequestToken;
  const main = (hiResTimeStamp) => {
    animationFrameRequestToken = window.requestAnimationFrame(main);

    update();
  };
  main();
})();
