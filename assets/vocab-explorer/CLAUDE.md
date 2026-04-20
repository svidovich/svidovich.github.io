# Serbian Vocabulary Explorer

3D vocabulary learning app. Walk through rooms in first person, look at objects to see their Serbian/English names, then take a timed quiz. Built for svidovich.github.io (GitHub Pages). Linked from the site's root index.html.

## Stack

Vanilla JS ES modules. No build step, no bundler. Served as static files.

three.js r184 (local, not CDN):
- `lib/three.module.min.js` + `lib/three.core.min.js` -- core library
- `lib/GLTFLoader.js` -- model loader (from three.js examples/jsm/loaders/)
- `utils/BufferGeometryUtils.js`, `utils/SkeletonUtils.js` -- GLTFLoader dependencies

All three.js addon files had their `from 'three'` import rewritten to relative paths. If you update three.js, you must re-patch these imports. Details in the "three.js vendoring" section below.

## File layout

```
vocab-explorer/
  index.html          -- entry point, single <script type="module" src="main.js">
  style.css            -- menu, HUD, crosshair, quiz overlay, settings panel
  main.js              -- app init, game loop, raycasting/gaze, HUD, timer, room lifecycle
  player.js            -- WASD + mouse look via Pointer Lock API
  room.js              -- builds scene (walls/floor/ceiling/lights) + loads vocab objects
  quiz.js              -- multiple choice quiz (serbian -> english), auto-advance on correct
  vocabulary.js        -- room data + latinToCyrillic() converter
  settings.js          -- difficulty + alphabet config, localStorage persistence
  scores.js            -- per-room score/completion tracking, localStorage persistence
  lib/                 -- three.js r184 (vendored, import-patched)
  utils/               -- three.js addon utilities (vendored, import-patched)
  models/<room>/<id>.glb -- 3D models, loaded at runtime by GLTFLoader
  credits/models       -- model attribution file
```

## Architecture

`main.js` is the orchestrator. On room start it calls `room.build()` (async, returns Promise) which loads GLB models in parallel and falls back to colored BoxGeometry if a model fails or isn't specified. Player controls use the Pointer Lock API; timer doesn't start until first lock is acquired. R key skips to quiz early.

Raycasting for gaze detection uses `recursive: true` + parent-chain traversal (`findVocabIdUp`) so it works on both simple box meshes and multi-mesh GLB scenes. See "Raycasting pipeline" section for details.

Quiz picks 10 random items (or fewer if room has <10 objects), deduplicating on the `english` field and excluding items with `quizExclude: true`. Correct answers auto-advance after 400ms. Wrong answers pause and show the correct choice; user clicks Next. Quiz is timed; perfect scores record best time.

### Pause system

ESC releases pointer lock, which triggers `onPauseCheck()`. This freezes the timer, hides the label bubble, and shows a pause overlay with Resume/Quit buttons. Resume re-requests pointer lock and restores timer state.

### Inventory system

Players can pick up small objects (F key), store them in 5 inventory slots (keys 1-5), equip them (renders on camera as a held item), and place them on horizontal surfaces. Large objects (`large: true`) show a "Too big!" flash instead. Inventory thumbnails are generated via a single offscreen WebGLRenderer to avoid WebGL context limits. Equipped items are added as camera children (`scene.add(camera)` is required for this). Placed items use surface normal checking (`normal.y >= 0.7`) for horizontal-only placement.

### Emissive highlight system

When `settings.highlight === "on"`, seen objects get a green emissive tint that fades from full to zero over `EMISSIVE_FADE_SECONDS` (1s). The currently gazed object stays at full emissive. Each item tracks its own `emissiveLevel` (0-1), updated per frame via linear interpolation.

### Menu bubbles

Decorative CSS-animated bubbles float upward on the main menu with RGB color cycling (HSL hue rotation). Spawned every 400ms into `#menu-bubbles`, each with random size/speed/position/hue offset. Cleaned up on room entry, restarted on menu return.

## three.js vendoring

three.js is vendored locally, not loaded from CDN. This matters because the npm/CDN builds use bare module specifiers (`from 'three'`) which browsers can't resolve without an import map or bundler. We rewrite them to relative paths instead.

`three.module.min.js` is the main entry point. It internally imports from `three.core.min.js` -- both files must be present in `lib/` or you get a MIME type error on load. This is not obvious; the error message says the module was "blocked due to disallowed MIME type" rather than "file not found."

Patched files and what was changed:
- `lib/GLTFLoader.js` line 68: `} from 'three';` -> `} from './three.module.min.js';`
- `utils/BufferGeometryUtils.js`: `} from 'three';` -> `} from '../lib/three.module.min.js';`
- `utils/SkeletonUtils.js`: `} from 'three';` -> `} from '../lib/three.module.min.js';`

GLTFLoader also imports from `../utils/BufferGeometryUtils.js` and `../utils/SkeletonUtils.js` (relative to its location in `lib/`). These paths resolve correctly to our `utils/` directory without patching.

To upgrade three.js:
1. Download the new release's `build/` directory. Copy `three.module.min.js` and `three.core.min.js` into `lib/`.
2. Download `examples/jsm/loaders/GLTFLoader.js` into `lib/`.
3. Download `examples/jsm/utils/BufferGeometryUtils.js` and `SkeletonUtils.js` into `utils/`.
4. Re-apply the `from 'three'` -> relative path patches listed above.
5. Check if GLTFLoader has gained any new `../utils/` or `../libs/` imports and vendor those too.

## Coordinate system and room geometry

Room size is configurable per room via `size: { x, y, z }` in vocabulary.js (defaults: 10x3.5x10). Wall/floor/ceiling colors are also configurable via `wallColor`, `floorColor`, `ceilingColor` hex strings. Origin (0,0,0) is at floor center.

```
        Z- (back wall, z = -5)
        |
        |
X- -----+------ X+
(left    |    right
 wall    |    wall
 x=-5)   |    x=+5)
        |
        Z+ (front wall, z = +5)

Y is up. Floor at y=0, ceiling at y=3.5.
```

Walls are PlaneGeometry placed at the room edges (x=+/-5, z=+/-5), centered vertically at y=1.75.

Player spawns at (0, 1.7, 3) -- near the front wall, facing Z- (into the room). Player height is fixed at 1.7 (eye level). Movement is clamped to +/-4.8 on X and Z (slightly inside walls).

For placing objects:
- Floor-standing items: set position.y = 0 (the model's origin should be at its base, or adjust y to compensate).
- Wall-mounted items: z near -4.5 for back wall, x near +/-4.9 for side walls, etc.
- Tabletop items: position.y should match table surface height (currently ~1.05 based on table at y=0.5 with h=0.1).

## Raycasting pipeline

This is the most complex part of the codebase. It handles gaze detection for both simple box meshes and multi-mesh GLB models.

1. Every frame, `checkGaze()` fires a ray from screen center (Vector2(0,0)) through the camera.
2. `raycaster.intersectObjects(meshList, true)` -- the `true` is critical. It means recursive: the ray tests against child meshes inside Groups, not just the top-level object. Without this, GLB models (which are Group > Mesh hierarchies) would be invisible to the raycast.
3. `raycaster.far = 6` limits detection range so you can't label objects across the room.
4. On hit, we read `hits[0].object.userData.vocabId`. For simple boxes, this is set directly on the mesh. For GLB child meshes, it was set during loading via `group.traverse()` in room.js.
5. Fallback: if the hit mesh somehow doesn't have vocabId (shouldn't happen, but defensive), `findVocabIdUp()` walks the `.parent` chain until it finds a node with vocabId set. The Group-level node always has it.
6. The vocabId is matched against the `interactables` array to find the vocabulary item.

When an item is first seen, `markSeen()` sets its `emissiveLevel` to 1 (if highlights are on). The emissive system then fades it over time. See "Emissive highlight system" above.

## Pointer lock lifecycle

The Pointer Lock API controls mouse capture for first-person look. The lifecycle is:

1. Room loads. Timer is paused (`timerRunning = false`). Instructions shown.
2. User clicks canvas -> `requestPointerLock()` called.
3. Browser grants lock -> `pointerlockchange` fires -> `onFirstLock()` starts the timer, resets clock delta (prevents a huge first-frame dt from the time spent on menu), hides instructions. This listener removes itself and installs `onPauseCheck` instead.
4. During gameplay, player.js tracks lock state via its own `pointerlockchange` listener. Movement and mouse look only work while locked.
5. User presses Escape -> browser releases lock -> `onPauseCheck()` freezes timer, shows pause overlay with Resume/Quit options.
6. User presses R while timer is running -> `onGameKey` fires, timer set to 0, `endExploration()` called.
7. Timer hits 0 (naturally or via R) -> `endExploration()` calls `document.exitPointerLock()`, hides label bubble, starts quiz.
8. Quiz runs in DOM overlay (no pointer lock needed). Quiz is timed via `performance.now()`.
9. Quiz ends -> `cleanup()` removes all event listeners including the `pointerlockchange` and `keydown` handlers.

Key bindings in `onGameKey`: R (quiz), F (interact/pickup/place), Digit1-5 (equip inventory slots).

## localStorage keys and schemas

Two keys, both JSON:

**`vocabExplorerSettings`**
```json
{
  "difficulty": "easy",     // "study"|"easy"|"medium"|"hard"|"impossible"
  "alphabet": "cyrillic",   // "cyrillic"|"latin"
  "highlight": "on"         // "on"|"off"
}
```
Defaults (if key is missing or corrupt): `{ difficulty: "easy", alphabet: "cyrillic", highlight: "on" }`. Settings are read fresh at room start via `loadSettings()`, so changes take effect on next room entry without reload.

**`vocabExplorerScores`**
```json
{
  "kitchen": {
    "bestTime": 12.3,    // best quiz completion time in seconds (lower is better), null if no perfect score yet
    "total": 10,         // number of quiz questions (always 10 or object count if <10)
    "completions": 3     // number of perfect-score completions
  }
}
```
Keyed by room id (matches VOCABULARY keys). Updated after each quiz via `recordScore()`. `bestTime` and `completions` only update on perfect scores (`score === total`). Legacy data may have `undefined` instead of `null` for `bestTime` -- `formatBestTime()` handles this with `!bestTime || isNaN()` checks.

## GLB model gotchas

Models downloaded from free3d, Sketchfab, etc. vary wildly:
- **Scale**: The fridge needed scale: 0.0015. Another model might need 1.0 or 100.0. There's no standard. Always start with scale: 1.0, check how it looks, adjust.
- **Origin placement**: Some models have their origin at the base (good -- set position.y = 0 for floor objects). Others have origin at center (set position.y = half the model height). Others have origin somewhere random. Adjust position.y or fix in Blender.
- **Orientation**: Models may face any direction. Use the rotation field (in degrees) to fix. rotation.y is the most common one to adjust.
- **Materials**: GLB models bring their own materials. The "seen" emissive tint works by setting `material.emissive` on each child mesh. This works on MeshStandardMaterial and MeshPhysicalMaterial (which GLBs typically use). If a model uses an unusual material type that lacks emissive, the tint will silently fail for that mesh.
- **Nested structure**: GLTFLoader returns `gltf.scene` which is a Group. Inside may be more Groups, Meshes, Bones, etc. `traverse()` handles this. The vocabId is set on the top-level Group AND on every child Mesh.
- **File size**: Keep individual GLBs under ~1MB for reasonable load times on GitHub Pages. Low-poly models are preferred.

## Vocabulary data format

All Serbian words stored in Latin script in vocabulary.js. Cyrillic is generated at runtime by `latinToCyrillic()` (same character map as the flashcard app in `assets/cards/vocabulary.js`). The user's alphabet preference (Settings) controls which script is displayed in labels and quiz prompts.

Object schema in vocabulary.js:
```js
{
  id: "fridge",              // unique within room, used for raycasting + scoring
  english: "refrigerator",
  serbian: "frižider",       // ALWAYS Latin script
  model: "models/kitchen/fridge.glb",  // optional, omit for fallback box
  position: { x: -4, y: 0, z: -4.5 },
  rotation: { x: 0, y: 0, z: 0 },     // degrees, optional, applied to loaded model
  scale: 0.0015,                        // uniform, optional, default 1.0
  size: { w: 1.2, h: 2.4, d: 0.8 },   // fallback box dimensions
  color: 0xcccccc,                      // fallback box color
}
```

Room schema:
```js
kitchen: {
  name: { latin: "Kuhinja", cyrillic: "...", english: "Kitchen" },
  objects: [ ... ]
}
```

## Adding a new object

1. Find/download a 3D model. Convert to GLB in Blender (File > Import > whatever, File > Export > glTF 2.0 (.glb)).
2. Drop it in `models/<room>/<id>.glb`.
3. Add an entry to the room's objects array in vocabulary.js.
4. Tune position/rotation/scale by reloading. Models come in at wildly different scales (the fridge needed scale: 0.0015). Set position.y to 0 for floor-standing objects since the floor is at y=0.

## Adding a new room

1. Add a new key to VOCABULARY in vocabulary.js with `name` and `objects`.
2. Add a `<button class="room-btn" data-room="newroom">` to index.html inside `#room-list`.
3. Create `models/<newroom>/` directory.
4. Room geometry (10x3.5x10 box with walls/floor/ceiling) is auto-generated by room.js. Player spawns at (0, 1.7, 3).

## Settings (localStorage)

- Difficulty: Easy (30s), Medium (20s), Hard (10s), Impossible (5s) -- controls exploration timer
- Alphabet: Cyrillic or Latin -- controls label display and quiz prompts

## Scores (localStorage)

Per-room: best score, total possible, completion count. Shown on menu buttons as "Best: X/Y | star x N".

## Known limitations / expansion ideas

- Room geometry is a fixed 10x10x3.5 box. Could vary per room or allow custom floor plans.
- No loading indicator while models load (build is awaited before tick starts, so there's a blank frame).
- Quiz always tests serbian->english. Could add english->serbian direction.
- No sound.
- Player has no collision with objects (just room boundary clamping).
- Could add a "free explore" mode with no timer.
- Could track which specific words the user gets wrong and weight them in future quizzes.
- The flashcard app has a much richer vocabulary dataset (assets/flashcarddata.js). Could pull words from there to auto-populate rooms by category.

## Dev server

Must serve via HTTP (ES modules don't work over file://):
```
cd assets/vocab-explorer && python3 -m http.server
```
Then open http://127.0.0.1:8000/ (not the repo root -- the server must run from vocab-explorer/ or paths break). Alternatively serve from repo root and navigate to /assets/vocab-explorer/.

## User preferences

- Explicit imports, no `import * as`. Every import names exactly what it uses.
- No build tools, no transpilation. Vanilla JS only.
- Models are committed to git directly (no LFS for now; total model size is small).
