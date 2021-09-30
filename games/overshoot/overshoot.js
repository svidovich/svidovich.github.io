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

const getObjectFromLocalStorage = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

const putObjectToLocalStorage = (key, object) => {
  localStorage.setItem(key, JSON.stringify(object));
};

// Things we want to be global

let canvas = document.getElementById("mainCanvas");
let canvasContext = canvas.getContext("2d");
const canvasHeight = canvas.height;
const canvasWidth = canvas.width;

let { left: canvasLeftEdgeX, top: canvasTopEdgeY } = canvas.getBoundingClientRect();

let onScreenProjectiles = new Array();
let onScreenTargets = new Array();

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

// We need a way to persist upgrades through refreshes. We can initialize to these
// values in localStorage, and retrieve them when they need to be used.
const upgradableValues = Object.freeze({
  // The actual radius of projectiles. We're kind of assuming that bigger projectiles
  // means an easier game, since it *should* make targets easier to hit.
  ammoSize: 6,
  // How many targets should a projectile hit before it disappears?
  ammoHealthOS: 1,
  // The player starts out with 4 projectiles. Perhaps, through upgrades, they
  // can get some more. If they're lucky and I'm gracious.
  playerAmmoCount: 4,
  // If this is set to true, then a projectile can hit a target and not be destroyed
  // until it either leaves the screen or hits one more target. In essence, this gives
  // projectiles a little bit of 'health'.
  crashThroughActive: false,
  // If this is set to true, as a player moves the aiming reticle for the catapult,
  // the parabolic line matching the angle and a reasonable initial velocity will be
  // drawn, to help the player aim at targets. This is going to be SO COOL
  drawAimLineActive: false,
  // A sort of percentage -- we use this in a product. At its base, this means
  // that we're reducing to 20% of some whole number. Thus, the higher this is,
  // the more power with which we launch projectiles.
  launchPowerDivisor: 0.2,
  // How much should we add to the player's projectiles' damage?
  playerProjectileDamageModifier: 0,
});

// Status stuff
let controlsPaused = false;

let needToCheckUpgrades = false;

const GameInterfaces = Object.freeze({
  mainMenu: "mainMenu",
  levelSelect: "levelSelect",
  shop: "shop",
  targetPractice: "targetPractice",
  battlefield: "battlefield",
  challenges: "challenges",
  challengeInit: "challengeInit",
});

let activeChallenge = null;
let currentInterface = GameInterfaces.mainMenu;

// This is a mapping of upgrade names to callables that make
// their effects happen in-game. The callables should be
// somewhat close to idempotent.
const upgradeStruct = {
  moreAmmoOS: (restore) => {
    if (restore === true) {
      localStorage.setItem("playerAmmoCount", upgradableValues["playerAmmoCount"]);
    } else {
      localStorage.setItem("playerAmmoCount", 6);
    }
  },
  mostAmmoOS: (restore) => {
    if (restore === true) {
      localStorage.setItem("playerAmmoCount", upgradableValues["playerAmmoCount"]);
    } else {
      localStorage.setItem("playerAmmoCount", 10);
    }
  },
  biggerAmmoOS: (restore) => {
    if (restore === true) {
      localStorage.setItem("ammoSize", upgradableValues["ammoSize"]);
    } else {
      localStorage.setItem("ammoSize", 16);
    }
  },
  hiPowerOS: (restore) => {
    if (restore === true) {
      localStorage.setItem("launchPowerDivisor", upgradableValues["launchPowerDivisor"]);
    } else {
      localStorage.setItem("launchPowerDivisor", 0.4);
    }
  },
  crashThroughOS: (restore) => {
    if (restore === true) {
      localStorage.setItem("crashThroughActive", upgradableValues["crashThroughActive"]);
      localStorage.setItem("ammoHealthOS", 1);
    } else {
      localStorage.setItem("crashThroughActive", true);
      localStorage.setItem("ammoHealthOS", 2);
    }
  },
  leadShotOS: (restore) => {
    if (restore === true) {
      localStorage.setItem("playerProjectileDamageModifier", upgradableValues["playerProjectileDamageModifier"]);
    } else {
      localStorage.setItem("playerProjectileDamageModifier", 10);
    }
  },
  drawAimLineOS: (restore) => {
    localStorage.setItem("drawAimLineActive", true);
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
      putObjectToLocalStorage(upgrade, { purchased: false, active: false, applied: false });
    }
  });
  Object.entries(upgradableValues).forEach((entry) => {
    const [key, value] = entry;
    if (localStorage.getItem(key) === null) {
      localStorage.setItem(key, value);
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
    let { purchased, active, applied } = getObjectFromLocalStorage(key);
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
        value.call(null, false);
        applied = true;
        // Here, we've deactivated a powerup.
      } else if (purchased && !active) {
        // We should call the callable with its restore arg set to true.
        // This should restore whatever the powerup modified to its original
        // value. When we .call(), we set the first argument to null. It's
        // meant to be a value for 'this', but that doesn't matter in this
        // this particular context. The second argument will be the first
        // argument to the actual callable, in this instance, being the
        // 'restore' argument, which we want to set to 'false'.
        value.call(null, true);
        applied = false;
      }
      putObjectToLocalStorage(key, {
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

// Looking back, menus should probably have been classes with methods like
// ThisMenu.addMenuItem(...) to make my life easier
// ThisMenu.clickHandler = () => {...}, and things like that.
// I will remember that for next time. I think doing that now would be a
// pretty significant refactor, unfortunately.
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
    const oldFillStyle = canvasContext.fillStyle;
    for (let i = 1; i <= 4; i++) {
      canvasContext.fillStyle = i % 2 === 0 ? "white" : "red";
      drawDisc(canvasContext, this.w / 2 + this.x, this.h / 2 + this.y, (this.w + this.h) / (4 + i));
    }
    canvasContext.fillStyle = oldFillStyle;

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

class MainMenuChallengesLink extends MenuItem {
  constructor(x, y, w, h) {
    super(x, y, w, h);
  }

  draw(canvasContext) {
    canvasContext.strokeRect(this.x, this.y, this.w, this.h);
    const oldFont = canvasContext.font;
    canvasContext.font = `bold ${this.w - this.w / 4}px courier`;
    canvasContext.fillText("☄️", this.x, this.y + (3 * this.h) / 4);
    canvasContext.font = `bold ${this.w / 8}px courier`;
    canvasContext.fillText("Challenges", this.x + this.w / 8, this.y + this.h - this.w / 16);
    canvasContext.font = oldFont;
  }
  clickAction() {
    currentInterface = GameInterfaces.challenges;
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
mainMenuItems.push(new MainMenuChallengesLink(400, 100, 100, 100));

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
  constructor(x, y, cost, description, storageKey, imagePath) {
    let w = 100;
    let h = 100;
    super(x, y, w, h);
    this.cost = cost;
    this.description = description;
    this.storageKey = storageKey;
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
    let currentCash = localStorage.getItem("lootOS");
    let currentItemStatus = getObjectFromLocalStorage(this.storageKey);
    if (currentItemStatus.purchased === true) {
      putObjectToLocalStorage(this.storageKey, {
        purchased: true,
        active: !currentItemStatus.active,
        applied: false,
      });
      needToCheckUpgrades = true;
      return;
    }
    if (currentCash < this.cost) {
      return;
    } else {
      if (currentItemStatus.purchased !== true) {
        putObjectToLocalStorage(this.storageKey, { purchased: true, active: true, applied: false });
        localStorage.setItem("lootOS", currentCash - this.cost);
      }
      // Set a flag that we should check upgrades.
      needToCheckUpgrades = true;
      return;
    }
  }

  draw(canvasContext) {
    canvasContext.strokeRect(this.x, this.y, this.w, this.h);
    // this.drawIcon();
    const oldFont = canvasContext.font;
    canvasContext.font = `bold 14px courier`;
    canvasContext.fillText(this.description, this.x + this.w / 10, this.y + this.h + 14);
    canvasContext.fillText(`$${this.cost}`, this.x + this.w / 3, this.y + this.h + 28);
    if (this.image !== null) {
      canvasContext.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    let currentItemStatus = getObjectFromLocalStorage(this.storageKey);

    if (currentItemStatus.purchased === true) {
      let oldStrokeStyle = canvasContext.strokeStyle;
      let oldLineWidth = canvasContext.lineWidth;
      canvasContext.lineWidth = 10;
      canvasContext.strokeStyle = "green";
      canvasContext.beginPath();
      canvasContext.moveTo(this.x, this.y + this.h);
      canvasContext.lineTo(this.x + this.w, this.y);
      canvasContext.stroke();
      canvasContext.strokeStyle = oldStrokeStyle;
      canvasContext.lineWidth = oldLineWidth;
    }
    // Only show active / inactive status if we've bought the powerup.
    if (currentItemStatus.purchased === true) {
      const oldFillStyle = canvasContext.fillStyle;
      let statusString;
      if (currentItemStatus.active === true) {
        canvasContext.fillStyle = "green";
        statusString = "Active!";
      } else {
        canvasContext.fillStyle = "red";
        statusString = "Inactive!";
      }
      canvasContext.fillText(statusString, this.x, this.y - 5);
      canvasContext.fillStyle = oldFillStyle;
    }
    canvasContext.font = oldFont;
  }
}

let shopItems = new Array();
// moreAmmoOs mostAmmoOS biggerAmmoOS hiPowerOS crashThroughOS drawAimLineOS

let biggerAmmo = new ShopItem(100, 125, 500, "Bigger Ammo", "biggerAmmoOS", "./overshoot/media/biggerAmmo.png");
let moreAmmo = new ShopItem(250, 125, 500, "More Ammo", "moreAmmoOS", "./overshoot/media/moreAmmo.png");
let crashThrough = new ShopItem(400, 125, 750, "Two-Hit Ammo", "crashThroughOS", "./overshoot/media/crashThrough.png");
let hiPower = new ShopItem(550, 125, 250, "High Power!", "hiPowerOS", "./overshoot/media/hiPower.png");
let leadShot = new ShopItem(700, 125, 300, "Lead Shot", "leadShotOS", "./overshoot/media/leadShot.png");
// let drawAimLine = new ShopItem(700, 125, 1500, "Aim Line", "aimLineOs", "./overshoot/media/drawAimLine.png")

shopItems.push(new MainMenuLink(25, 25));
shopItems.push(biggerAmmo);
shopItems.push(moreAmmo);
shopItems.push(crashThrough);
shopItems.push(hiPower);
shopItems.push(leadShot);

// Starting to feel moist
const drawShop = (canvasContext) => {
  let oldFont = canvasContext.font;
  canvasContext.font = "bold 16px courier";
  canvasContext.fillText(`Cash: ${localStorage.getItem("lootOS")}`, 150, 45);
  canvasContext.font = oldFont;
  shopItems.forEach((item) => {
    item.draw(canvasContext);
  });
};

// Definitely moist. Needs to be... DRY
const shopClickHandler = (clickCoordinates) => {
  shopItems.forEach((item) => {
    return item.isClicked(clickCoordinates);
  });
};

class ChallengesMenuItem extends MenuItem {
  constructor(x, y, description, imagePath, challengeType) {
    let w = 100;
    let h = 100;
    super(x, y, w, h);
    this.description = description;
    this.imagePath = imagePath;
    this.challengeType = challengeType;
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
    if (!this.challengeType) {
      throw new Error("No challenge type assigned!");
    } else {
      activeChallenge = this.challengeType;
      currentInterface = GameInterfaces.challengeInit;
    }
  }

  draw(canvasContext) {
    canvasContext.strokeRect(this.x, this.y, this.w, this.h);
    const oldFont = canvasContext.font;
    canvasContext.font = `bold 14px courier`;
    canvasContext.fillText(this.description, this.x - this.w / 8, this.y + this.h + 14);
    if (this.image !== null) {
      canvasContext.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
    canvasContext.font = oldFont;
  }
}

const challengesMenuItems = new Array();
challengesMenuItems.push(new MainMenuLink(25, 25));

const jungleChallengeMenuItem = new ChallengesMenuItem(
  100,
  125,
  "Jungle Challenge",
  "./overshoot/media/jungleChallenge.png",
  "jungleChallenge"
);

challengesMenuItems.push(jungleChallengeMenuItem);

const challengesMenuClickHandler = (clickCoordinates) => {
  challengesMenuItems.forEach((item) => {
    return item.isClicked(clickCoordinates);
  });
};

const drawChallengesMenu = (canvasContext) => {
  challengesMenuItems.forEach((item) => {
    item.draw(canvasContext);
  });
};

const levelSelectClickHandler = (canvasContext) => {};

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

class Entity {
  constructor(x, y, health, damage) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.damage = damage;
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

class Target extends Entity {
  constructor(x, y, r) {
    super(x, y, 1, 1);
    this.r = r;
    this.value = 0;
  }

  draw(canvasContext) {
    const oldFillStyle = canvasContext.fillStyle;
    // We want to alternate colours between white and red,
    // starting with red. We can do so with a quick parity
    // check based on the ring count.
    for (let i = 1; i <= 4; i++) {
      canvasContext.fillStyle = i % 2 === 0 ? "white" : "red";
      drawDisc(canvasContext, this.x, this.y, this.r - 4 * i);
      canvasContext.fillStyle = oldFillStyle;
    }
  }
}

class MovingTarget extends Target {
  constructor(x, y, r, destX, destY, speed) {
    super(x, y, r);

    this.initialX = x;
    this.initialY = y;
    this.destX = destX;
    this.destY = destY;

    this.speed = speed;

    this.adj = this.destX - this.initialX;
    this.opp = this.destY - this.initialY;

    this.angle = Math.atan2(this.opp, this.adj);
    this.movingTowardDestination = true;
  }

  adjustPosition() {
    if (distance(this.coordinates, { x: this.destX, y: this.destY }) < 25 && this.movingTowardDestination === true) {
      this.speed *= -1;
      this.movingTowardDestination = false;
    }
    if (
      distance(this.coordinates, { x: this.initialX, y: this.initialY }) < 25 &&
      this.movingTowardDestination === false
    ) {
      this.speed *= -1;
      this.movingTowardDestination = true;
    }
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
  }
}

class Brick extends Entity {
  constructor(x, y, kind) {
    super(x, y, 16, 12);
    this.r = 24;
    this.value = 0;
    this.kind = kind;
    this.initialHealth = this.health;
    this.loadImages();
  }

  get coordinates() {
    return {
      x: this.x,
      y: this.y,
    };
  }

  loadImages() {
    const imageWidth = 12;
    const imageHeight = 12;
    this.image = new Image();
    this.image.width = imageWidth;
    this.image.height = imageHeight;
    this.image.src = `./overshoot/media/brick-tiny-${this.kind}.png`;

    this.imageCrackedForm = new Image();
    this.imageCrackedForm.width = imageWidth;
    this.imageCrackedForm.height = imageHeight;
    this.imageCrackedForm.src = `./overshoot/media/brick-tiny-${this.kind}-cracked.png`;
  }

  draw(canvasContext) {
    for (let i = -2; i <= 1; i++) {
      for (let j = -2; j <= 1; j++) {
        let imageToDraw;
        if (this.health <= this.initialHealth / 2) {
          imageToDraw = this.imageCrackedForm;
        } else {
          imageToDraw = this.image;
        }
        canvasContext.drawImage(imageToDraw, this.x + 12 * i, this.y + 12 * j, imageToDraw.width, imageToDraw.height);
      }
    }
    return;
  }
}

class Projectile {
  constructor(x, y, size, v0, a0, damageModifier) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.r = this.size;
    this.v0 = v0; // Initial velocity
    this.a0 = a0; // Initial Angle
    this.t = 0;
    damageModifier = damageModifier || 0;
    this.health = parseInt(localStorage.getItem("ammoHealthOS"));
    this.damage = Math.floor(this.size / 2) + damageModifier;
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

  draw(canvasContext) {
    drawCircle(canvasContext, this.x, this.y, this.r);
  }
}

class Catapult {
  constructor(x, y, angle, size, ammoCount, damageModifier) {
    this.x = x;
    this.y = y;
    this.angle = angle || 0;
    this.size = size || 1;

    this.ammoCount = ammoCount || 3;
    this.damageModifier = damageModifier || 0;
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

  drawCatapultFrame = (canvasContext) => {
    let { x: catapultX, y: catapultY } = this.coordinates;
    let catapultSize = this.size;
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

  drawCatapultArmAndBucket = (canvasContext) => {
    const { x: catapultX, y: catapultY } = this.coordinates;
    const catapultSize = this.size;
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

  drawCatapultAimingLine = (canvasContext) => {
    const { x: catapultX, y: catapultY } = this.coordinates;
    const yAimPoint = catapultY - 10 * this.size + 2;

    const catapultSize = this.size;
    const angle = this.angle;
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

  draw(canvasContext) {
    this.drawCatapultFrame(canvasContext);
    this.drawCatapultArmAndBucket(canvasContext);
    this.drawCatapultAimingLine(canvasContext);
  }

  fire = () => {
    // If we're not already in the middle of firing,
    if (controlsPaused !== true && this.ammoCount > 0) {
      onScreenProjectiles.push(
        new Projectile(
          this.x,
          // This should prolly be constantized, but meh. It's the location of
          // the top bolt.
          this.y - 10 * this.size + 2,
          parseInt(localStorage.getItem("ammoSize")),
          // If we don't reduce this a touch, it's too fast, lol.
          this.launchingPower * parseFloat(localStorage.getItem("launchPowerDivisor")),
          this.angle,
          this.damageModifier || 0
        )
      );
      this.ammoCount -= 1;
      controlsPaused = true;
    }
  };
}

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
        catapult.fire();
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

const getRandomTargetLocation = (quadrant) => {
  // Stick to QI?
  if (quadrant === "Q1") {
    return {
      x: randomInt(canvasWidth / 2, canvasWidth),
      y: randomInt(statusBarHeight, canvasHeight / 2),
    };
  } else if (quadrant === "Q2") {
    return {
      x: randomInt(0, canvasWidth / 2),
      y: randomInt(statusBarHeight, canvasHeight / 2),
    };
  } else if (quadrant === "Q3") {
    return {
      x: randomInt(0, canvasWidth / 2),
      y: randomInt(canvasHeight / 2, canvasHeight),
    };
  } else if (quadrant === "Q4") {
    return {
      x: randomInt(canvasWidth / 2, canvasWidth),
      y: randomInt(canvasHeight / 2, canvasHeight),
    };
  } else {
    throw new Error(`${quadrant} is not a valid quadrant. Choose Q1, Q2, Q3, or Q4.`);
  }
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
          projectile.health -= entity.damage;
          if (projectile.health <= 0) {
            projectile.queueDeletion = true;
          }
          entity.health -= projectile.damage;
          if (entity.health <= 0) {
            entity.queueDeletion = true;
            // Let's earn some cash
            if (typeof entity.value === "number") {
              let currentLoot = parseInt(localStorage.getItem("lootOS"));
              localStorage.setItem("lootOS", currentLoot + entity.value);
            }
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
const drawStatusBar = (canvasContext, catapult) => {
  const oldFillStyle = canvasContext.fillStyle;
  const oldStrokeStyle = canvasContext.strokeStyle;
  const oldFont = canvasContext.font;
  canvasContext.font = statusItemsFont;

  canvasContext.strokeRect(0, 0, canvasWidth, statusBarHeight);

  const convertedAngle = -parseFloat(`${(catapult.angle * 180) / Math.PI}`).toFixed(2);
  canvasContext.fillText(`Angle: ${convertedAngle}°`, angleMeterLocationX, midBarText);

  canvasContext.fillText("Power:", powerMeterLocationX - 50, midBarText);
  const powerBarGradient = canvasContext.createLinearGradient(powerMeterLocationX, 0, powerMeterLocationX + 100, 0);
  powerBarGradient.addColorStop(0.0, "green");
  powerBarGradient.addColorStop(0.333, "yellow");
  powerBarGradient.addColorStop(0.666, "orange");
  powerBarGradient.addColorStop(1.0, "red");
  canvasContext.fillStyle = powerBarGradient;
  canvasContext.fillRect(powerMeterLocationX, powerMeterLocationY, catapult.launchingPower, 10);
  canvasContext.fillStyle = oldFillStyle;

  canvasContext.fillText("Ammo:", ammoMeterLocationX, midBarText);
  for (let i = 1; i <= catapult.ammoCount; i++) {
    drawCircle(canvasContext, ammoMeterLocationX + 35 + 10 * i, midBarText - 3, 3);
  }

  canvasContext.fillText(`Cash: ${localStorage.getItem("lootOS")}`, canvasWidth - 150, midBarText);

  canvasContext.font = oldFont;
};

const generateStandardCatapult = () => {
  return new Catapult(
    75,
    600,
    0,
    4,
    parseInt(localStorage.getItem("playerAmmoCount")),
    parseInt(localStorage.getItem("playerProjectileDamageModifier"))
  );
};

let playerCatapult = generateStandardCatapult();
let playerInput = new Input();

let battlefieldPrepared = false;
const prepareTargetPractice = () => {
  // Any time we're starting target practice, make
  // a fresh catapult.
  playerCatapult = generateStandardCatapult();
  // Reset the current count of on screen targets.
  onScreenTargets.length = 0;
  for (let i = 1; i <= randomInt(4, 6); i++) {
    // Destruct & rename
    const { x: randomX, y: randomY } = getRandomTargetLocation("Q1");
    let nextTarget = new Target(randomX, randomY, 20);
    nextTarget.value = 3;
    onScreenTargets.push(nextTarget);
  }
  let { x: brickX, y: brickY } = getRandomTargetLocation("Q1");

  //  constructor(x, y, r, destX, destY, speed)
  for (let i = 1; i <= randomInt(1, 2); i++) {
    const initialCoords = getRandomTargetLocation("Q2");
    const destCoords = getRandomTargetLocation("Q3");
    let nextMovingTarget = new MovingTarget(
      initialCoords.x,
      initialCoords.y,
      20,
      destCoords.x,
      destCoords.y,
      randomInt(1, 2)
    );
    nextMovingTarget.value = 4;
    onScreenTargets.push(nextMovingTarget);
  }

  // Randomize what kind of bricks we'll get!
  let brickKindChance = randomInt(1, 100);
  let brickKind;
  if (1 <= brickKindChance && brickKindChance < 33) {
    brickKind = "blank";
  } else if (33 <= brickKindChance && brickKindChance < 66) {
    brickKind = "jungle";
  } else if (66 <= brickKindChance && brickKindChance < 99) {
    brickKind = "purple-dark";
  } else {
    brickKind = "purple-bright";
  }

  // Randomize what kind of wall we'll make!
  let wallIsVertical = randomInt(1, 100) <= 50;
  for (let i = 0; i <= randomInt(1, 3); i++) {
    let nextBrick;
    if (wallIsVertical === true) {
      nextBrick = new Brick(brickX, brickY + i * 48, brickKind);
    } else {
      nextBrick = new Brick(brickX + i * 48, brickY, brickKind);
    }
    nextBrick.value = 1;
    onScreenTargets.push(nextBrick);
  }
  battlefieldPrepared = true;
};

// More generally,

const buildBattlefieldBase = () => {
  // Any time we're going to be entering the
  // battlefield, we should do these things.

  // Replace the global catapult with a new one.
  playerCatapult = generateStandardCatapult();
  // Reset the current count of on screen targets.
  onScreenTargets.length = 0;
};

// About building challenge maps intelligently
// Generally when constructing challenges, we need to be mindful of the
// amount of ammo a player has available to them. The total number of
// targets shouldn't exceed the amount of ammo a player has, even if they
// have smash-through ammo. It's not very fair to the player if they only
// have 4 ammo but there are 8 targets, eh?
// Challenges are also a little different from target practice.
// Targets are worth more than in target practice when we're in
// challenge mode, and walls are placed thematically. Probably there
// are also monkey pictures.

// The style of a jungle challenge is, generally, vertical walls that
// block out targets. There should be at least a target out front to
// give the player a bit of a freebie, but the rest of the challenge will
// consist of vertical play.
const buildJungleChallenge = () => {
  buildBattlefieldBase();
  // For a touch of challenge, let's try and start with an x position
  // in the middle of the canvas
  const availablePlayerAmmo = parseInt(localStorage.getItem("playerAmmoCount"));
  let firstTargetX = randomInt(canvasWidth / 2 - canvasWidth / 8, canvasWidth / 2 + canvasWidth / 8);
  let firstTargetY = randomInt(300, canvasHeight - 300);
  let firstTarget = new Target(firstTargetX, firstTargetY, 20);
  firstTarget.value = 10;
  onScreenTargets.push(firstTarget);
  let remainingTargets = availablePlayerAmmo - 1;
  // Put some bricks in behind the first target.
  let firstBrickX = firstTargetX + randomInt(50, 60);
  let firstBrickY = firstTargetY + randomInt(70, 120);
  for (let i = 0; i <= 3; i++) {
    let nextBrick = new Brick(firstBrickX, firstBrickY + i * 48, "jungle");
    nextBrick.value = 5;
    onScreenTargets.push(nextBrick);
  }
  // Let's do some moving targets, up and down, behind the brick wall.
  const movingTargetsX = firstBrickX + randomInt(50, 60);
  if (remainingTargets === 1) {
    let thisMovingTarget = new MovingTarget(movingTargetsX, statusBarHeight, 20, movingTargetsX, canvasHeight, 1);
    thisMovingTarget.value = 15;
    onScreenTargets.push(thisMovingTarget);
    return;
  } else {
    let firstMovingTarget = new MovingTarget(movingTargetsX, firstBrickY + 90, 20, movingTargetsX, statusBarHeight, 1);
    firstMovingTarget.value = 15;
    onScreenTargets.push(firstMovingTarget);
    let secondMovingTarget = new MovingTarget(movingTargetsX, firstBrickY + 110, 20, movingTargetsX, canvasHeight, 1);
    secondMovingTarget.value = 15;
    onScreenTargets.push(secondMovingTarget);
    remainingTargets -= 2;
  }
  // Bail if we're out of targets now.
  if (remainingTargets === 0) {
    return;
  }
  // Now for another wall.
  let secondBrickX = movingTargetsX + randomInt(50, 60);
  let secondBrickY = randomInt(statusBarHeight, statusBarHeight + 100);
  for (let i = 0; i <= 5; i++) {
    let nextBrick = new Brick(secondBrickX, secondBrickY + i * 48, "jungle");
    nextBrick.value = 5;
    onScreenTargets.push(nextBrick);
  }
  // and, add some targets behind it
  if (remainingTargets === 1) {
    let targetBeyondSecondWall = new Target(secondBrickX + randomInt(5, 10), 144 + randomInt(0, 30), 20);
    targetBeyondSecondWall.value = 20;
    onScreenTargets.push(targetBeyondSecondWall);
    return;
  } else {
    let firstTargetBeyondSecondWall = new Target(
      secondBrickX + 50 + randomInt(5, 10),
      secondBrickY + 144 - randomInt(20, 40),
      20
    );
    firstTargetBeyondSecondWall.value = 20;
    onScreenTargets.push(firstTargetBeyondSecondWall);

    let secondTargetBeyondSecondWall = new Target(
      secondBrickX + 50 + randomInt(5, 10),
      secondBrickY + 144 + randomInt(40, 80),
      20
    );
    firstTargetBeyondSecondWall.value = 20;
    onScreenTargets.push(secondTargetBeyondSecondWall);

    remainingTargets -= 2;
  }
  if (remainingTargets === 0) {
    return;
  }
  for (let i = 1; i <= remainingTargets; i++) {
    const { x, y } = getRandomTargetLocation(`Q${randomInt(1, 4)}`);
    let randomTarget = new Target(x, y, 20);
    randomTarget.value = 15;
    onScreenTargets.push(randomTarget);
  }
  return;
};

const prepareChallenge = (challengeType) => {
  switch (challengeType) {
    case "jungleChallenge":
      buildJungleChallenge();
      break;
    default:
      throw new Error(`${challengeType} is not a valid challenge type.`);
  }
  battlefieldPrepared = true;
};

let battleFieldItems = new Array();

const drawBattleField = (canvasContext, catapult) => {
  battleFieldItems.length = 0;
  updateGlobalEnvironmentFromInput(playerInput);
  updateCatapultFromInput(playerInput, playerCatapult);

  let battlefieldMainMenuButton = new MainMenuLink(canvasWidth - 110, canvasHeight - 30);
  battlefieldMainMenuButton.extraClickActions = () => {
    battlefieldPrepared = false;
  };
  battleFieldItems.push(battlefieldMainMenuButton);

  drawStatusBar(canvasContext, catapult);

  catapult.draw(canvasContext);

  onScreenTargets.map((target) => {
    target.draw(canvasContext);
    if (target.adjustPosition !== undefined) {
      target.adjustPosition();
    }
  });

  onScreenProjectiles.map((projectile) => {
    projectile.adjustPosition();
    projectile.draw(canvasContext);
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
      shopClickHandler(clickCoordinates);
      break;
    case GameInterfaces.battlefield:
      battlefieldClickHandler(canvasContext, clickCoordinates);
      break;
    case GameInterfaces.targetPractice:
      targetPracticeClickHandler(canvasContext, clickCoordinates);
      break;
    case GameInterfaces.challenges:
      challengesMenuClickHandler(clickCoordinates);
      break;
    case GameInterfaces.challengeInit:
      battlefieldClickHandler(canvasContext, clickCoordinates);
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
    if (battlefieldPrepared === false) {
      prepareTargetPractice();
    }
    drawBattleField(canvasContext, playerCatapult);
  } else if (currentInterface === GameInterfaces.shop) {
    drawShop(canvasContext);
  } else if (currentInterface === GameInterfaces.challenges) {
    drawChallengesMenu(canvasContext);
  } else if (currentInterface === GameInterfaces.challengeInit) {
    if (battlefieldPrepared === false) {
      prepareChallenge(activeChallenge);
    }
    drawBattleField(canvasContext, playerCatapult);
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
