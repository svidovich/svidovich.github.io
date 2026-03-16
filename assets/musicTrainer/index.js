/**
 * Score Follower — a lightweight, self-hosted MusicXML score player for
 * learners. Renders MusicXML via Verovio WASM, plays back via
 * soundfont-player + Web Audio API, and highlights notes in real time.
 *
 * Architecture overview:
 *   1. Verovio converts MusicXML → SVG (for display) and produces a
 *      "timemap" JSON array that maps timestamps to note element IDs.
 *   2. soundfont-player loads piano samples and exposes a .play() method
 *      that schedules Web Audio nodes at precise AudioContext times.
 *   3. Playback is timemap-driven: we iterate the timemap, look up each
 *      note's MIDI pitch via Verovio, and schedule it with soundfont-player.
 *   4. A requestAnimationFrame loop highlights the currently-playing notes
 *      by adding a CSS class to Verovio's SVG <g> elements.
 *   5. Scores can be loaded from the pre-populated directory (fetched from
 *      scores/) or uploaded by the user via a file input.
 *
 * External dependencies (vendored in lib/):
 *   - verovio-toolkit-wasm.js  — Verovio WASM build
 *   - soundfont-player.min.js  — soundfont-player library
 *
 * Audio samples (vendored in soundfonts/):
 *   - acoustic_grand_piano-ogg.js  — MusyngKite piano soundfont
 */
document.addEventListener("DOMContentLoaded", () => {
  // ═══════════════════════════════════════════════════════════════════
  // Score Directory
  //
  // Each section has a title, a display state ("open" or "closed"),
  // and an array of songs. Each song has a title and a filename
  // pointing to a .mxl file in the scores/ directory. This structure
  // mirrors the serviceManual app's directory format.
  // ═══════════════════════════════════════════════════════════════════
  const directory = [
    {
      title: "Divine Liturgy",
      display: "open",
      songs: [
        {
          title: "The Beatitudes",
          filename: "the_beatitudes.mxl",
        },
        {
          title: "We Praise Thee",
          filename: "we_praise_thee.mxl",
        },
      ],
    },
  ];

  // ═══════════════════════════════════════════════════════════════════
  // DOM References
  // ═══════════════════════════════════════════════════════════════════

  // Header controls
  const fileInput = document.getElementById("fileInput");
  const fileLabel = document.getElementById("fileLabel");
  const fileName = document.getElementById("fileName");

  // Transport controls
  const btnSkipStart = document.getElementById("btnSkipStart");
  const btnPlay = document.getElementById("btnPlay");
  const btnStop = document.getElementById("btnStop");
  const btnSkipEnd = document.getElementById("btnSkipEnd");
  const playLabel = document.getElementById("playLabel");
  const playIcon = document.getElementById("playIcon");

  // Tempo controls
  const tempoSlider = document.getElementById("tempoSlider");
  const tempoValue = document.getElementById("tempoValue");

  // Score display
  const notation = document.getElementById("notation");
  const statusEl = document.getElementById("status");
  const progressBar = document.getElementById("progressBar");
  const progressWrap = document.getElementById("progressWrap");
  const scoreContainer = document.getElementById("score-container");

  // Sidebar
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");
  const songList = document.getElementById("song-list");

  // Metadata header (above the notation card)
  const scoreMeta = document.getElementById("score-meta");
  const metaTitle = document.getElementById("metaTitle");
  const metaComposer = document.getElementById("metaComposer");
  const metaArranger = document.getElementById("metaArranger");

  // ═══════════════════════════════════════════════════════════════════
  // Application State
  // ═══════════════════════════════════════════════════════════════════
  let tk = null; // Verovio toolkit instance (created after WASM loads)
  let piano = null; // Soundfont instrument instance
  let audioCtx = null; // Web Audio AudioContext
  let timemap = null; // Verovio timemap: array of { tstamp, on[], off[] }
  let isPlaying = false; // True while audio is actively playing
  let isPaused = false; // True when paused mid-playback (can resume)
  let playbackStart = 0; // AudioContext.currentTime when playback began
  let pauseOffset = 0; // Seconds into the piece where we paused
  let tempoFactor = 1.0; // Tempo multiplier (1.0 = 100%, 0.5 = half speed)
  let scheduledNodes = []; // Web Audio nodes scheduled for playback (for cancellation)
  let animFrameId = null; // requestAnimationFrame ID for the highlight loop
  let totalDuration = 0; // Total piece duration in seconds (from timemap)
  let scoreLoaded = false; // True once any score has been successfully loaded
  let selectedOffset = null; // When a note is clicked, its timestamp in seconds

  // ═══════════════════════════════════════════════════════════════════
  // Status Display
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Updates the status indicator in the header.
   * @param {string} msg - Text to display.
   * @param {string} [type=""] - CSS modifier class: "loading", "error",
   *   or "ready". Controls the text color via style.css.
   */
  function setStatus(msg, type = "") {
    statusEl.textContent = msg;
    statusEl.className = "status " + type;
  }

  // ═══════════════════════════════════════════════════════════════════
  // Verovio Initialization
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Initializes the Verovio WASM toolkit. The verovio global is created
   * by the <script> tag loading verovio-toolkit-wasm.js, but the WASM
   * module loads asynchronously. We wait for onRuntimeInitialized before
   * creating the toolkit instance.
   * @returns {Promise<void>} Resolves when the toolkit is ready.
   */
  function initVerovio() {
    return new Promise((resolve, reject) => {
      if (typeof verovio === "undefined") {
        reject(
          new Error(
            "Verovio not loaded. Make sure lib/verovio-toolkit-wasm.js is present.",
          ),
        );
        return;
      }
      verovio.module.onRuntimeInitialized = () => {
        tk = new verovio.toolkit();
        resolve();
      };
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // Audio Initialization
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Creates the Web Audio AudioContext and loads the piano soundfont.
   * Must be called from a user gesture (click/keypress) to comply with
   * browser autoplay policies. Idempotent — returns immediately if
   * already initialized.
   *
   * Attempts to load piano samples from the self-hosted soundfonts/
   * directory first. If that fails (e.g., files not yet downloaded),
   * falls back to the Gleitz CDN.
   */
  async function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    if (typeof Soundfont !== "undefined") {
      setStatus("Loading piano samples…", "loading");
      try {
        piano = await Soundfont.instrument(audioCtx, "acoustic_grand_piano", {
          soundfont: "MusyngKite",
          nameToUrl: (name) => {
            return "soundfonts/" + name + "-ogg.js";
          },
          format: "ogg",
        });
        setStatus("Piano loaded", "ready");
      } catch (e) {
        console.warn("Local soundfont not found, trying CDN fallback…", e);
        try {
          piano = await Soundfont.instrument(audioCtx, "acoustic_grand_piano", {
            soundfont: "MusyngKite",
          });
          setStatus("Piano loaded (CDN)", "ready");
        } catch (e2) {
          console.error("Could not load piano:", e2);
          setStatus(
            "No piano sound available — playback will be silent",
            "error",
          );
        }
      }
    } else {
      setStatus("soundfont-player not loaded — no audio", "error");
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // Score Loading
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Loads a MusicXML score into Verovio, renders it to SVG, builds the
   * timemap for playback scheduling, and extracts metadata (title,
   * composer, arranger) for display.
   *
   * The Verovio page width is calculated from the notation container's
   * pixel width, converted to Verovio's internal units by dividing by
   * the scale factor. This ensures the rendered SVG fills the container
   * regardless of the chosen notation scale.
   *
   * Formula: pageWidth = pixelWidth * 100 / scale
   *   - At scale=45, a 1100px container → pageWidth ≈ 2444 Verovio units
   *   - Verovio renders SVG at: 2444 * 45/100 = 1100px (fills container)
   *
   * @param {string|ArrayBuffer} data - The score data. For .musicxml/.xml
   *   files this is a string; for .mxl (compressed) files, an ArrayBuffer.
   * @param {boolean} isCompressed - True for .mxl files (ZIP-compressed
   *   MusicXML), false for plain .musicxml/.xml text.
   */
  async function loadScore(data, isCompressed) {
    if (!tk) {
      setStatus("Verovio not ready yet", "error");
      return;
    }

    setStatus("Rendering score…", "loading");

    const scale = 45;
    const pixelWidth = Math.min(notation.clientWidth - 48, 1100);
    const pageWidth = (pixelWidth * 100) / scale;

    tk.setOptions({
      pageWidth: pageWidth,
      adjustPageHeight: true, // Let pages be as tall as needed
      scale: scale,
      spacingSystem: 8, // Vertical space between systems
      spacingStaff: 6, // Vertical space between staves
      header: "none", // Suppress Verovio's built-in title rendering
      footer: "none", // Suppress Verovio's built-in footer
      breaks: "auto", // Let Verovio compute system breaks (ignores MuseScore's encoded breaks)
      inputFrom: "musicxml",
      midiTempoAdjustment: 1.0,
    });

    // Load the score data into Verovio
    if (isCompressed) {
      tk.loadZipDataBuffer(data);
    } else {
      tk.loadData(data);
    }

    // Render all pages into one scrollable container. Verovio paginates
    // internally, but we concatenate all page SVGs into a single div.
    const pageCount = tk.getPageCount();
    let svgHtml = "";
    for (let i = 1; i <= pageCount; i++) {
      svgHtml += tk.renderToSVG(i);
    }
    notation.innerHTML = svgHtml;
    scoreLoaded = true;

    // Build the timemap — an array of objects like:
    //   { tstamp: 1500, on: ["note-001", "note-002"], off: ["note-000"] }
    // Each entry marks a moment where notes start or stop. We use this
    // to schedule audio playback and to drive note highlighting.
    timemap = tk.renderToTimemap({
      includeMeasures: true,
      includeRests: false,
    });

    // Total duration = timestamp of the last timemap entry (in seconds)
    if (timemap && timemap.length > 0) {
      const last = timemap[timemap.length - 1];
      totalDuration = (last.tstamp || 0) / 1000;
    }

    // Extract title/composer/arranger from the MEI representation
    extractMetadata();

    // Enable transport controls
    btnSkipStart.disabled = false;
    btnPlay.disabled = false;
    btnStop.disabled = false;
    btnSkipEnd.disabled = false;
    setStatus(
      "Ready — " + pageCount + " page" + (pageCount > 1 ? "s" : ""),
      "ready",
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // Metadata Extraction
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Extracts title, composer, and arranger from the loaded score by
   * converting it to MEI XML and parsing the <meiHead> section.
   *
   * This approach works uniformly for both .musicxml and .mxl inputs
   * because Verovio converts everything to MEI internally. The MEI
   * namespace is "http://www.music-encoding.org/ns/mei".
   *
   * Populates the #score-meta header above the notation card. Fields
   * that are empty in the source are hidden.
   */
  function extractMetadata() {
    try {
      const meiStr = tk.getMEI();
      const doc = new DOMParser().parseFromString(meiStr, "application/xml");
      const ns = "http://www.music-encoding.org/ns/mei";

      const title = doc
        .getElementsByTagNameNS(ns, "title")[0]
        ?.textContent?.trim();
      const persNames = doc.getElementsByTagNameNS(ns, "persName");

      let composer = "";
      let arranger = "";
      for (const el of persNames) {
        const role = el.getAttribute("role");
        if (role === "composer") composer = el.textContent.trim();
        if (role === "arranger") arranger = el.textContent.trim();
      }

      if (title || composer || arranger) {
        metaTitle.textContent = title || "";
        metaComposer.textContent = composer || "";
        metaArranger.textContent = arranger ? "Arr. " + arranger : "";
        metaTitle.hidden = !title;
        metaComposer.hidden = !composer;
        metaArranger.hidden = !arranger;
        scoreMeta.hidden = false;
      } else {
        scoreMeta.hidden = true;
      }
    } catch (e) {
      console.warn("Could not extract metadata:", e);
      scoreMeta.hidden = true;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // MIDI Utilities
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Converts a MIDI note number (0–127) to a note name string that
   * soundfont-player understands (e.g., "C4", "Db3", "Ab5").
   *
   * Uses flat accidentals (Db, Eb, Gb, Ab, Bb) rather than sharps,
   * which is the convention expected by soundfont-player's .play().
   *
   * @param {number} midi - MIDI note number (e.g., 60 = middle C).
   * @returns {string} Note name with octave (e.g., "C4").
   */
  function midiToNoteName(midi) {
    const names = [
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B",
    ];
    const oct = Math.floor(midi / 12) - 1;
    const note = names[midi % 12];
    return note + oct;
  }

  // ═══════════════════════════════════════════════════════════════════
  // Playback Engine
  //
  // Playback is driven entirely by the timemap. For each timemap entry
  // that has an `on` array (notes starting), we:
  //   1. Look up each note's MIDI pitch via tk.getMIDIValuesForElement()
  //   2. Convert the MIDI pitch to a note name
  //   3. Schedule the note with soundfont-player at the correct
  //      AudioContext time
  //
  // The tempo factor scales all timestamps. If tempoFactor = 0.5,
  // everything plays at half speed (timestamps are divided by 0.5,
  // making them twice as far apart in real time).
  //
  // playbackStart is set so that:
  //   playbackStart = audioCtx.currentTime - fromOffset / tempoFactor
  // This means "elapsed time" can always be computed as:
  //   elapsed = (audioCtx.currentTime - playbackStart) * tempoFactor
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Begins (or resumes) audio playback from the given offset.
   *
   * Iterates the entire timemap and schedules all notes whose timestamp
   * is >= fromOffset. Each note is scheduled at a precise future
   * AudioContext time so the Web Audio API handles timing (no
   * setTimeout jitter).
   *
   * Also starts the requestAnimationFrame highlight loop.
   *
   * @param {number} [fromOffset=0] - Seconds into the piece to start from.
   */
  function startPlayback(fromOffset = 0) {
    if (!timemap || timemap.length === 0 || !piano) return;

    // Resume audio context if suspended (browser autoplay policy)
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    isPlaying = true;
    isPaused = false;
    pauseOffset = fromOffset;
    playbackStart = audioCtx.currentTime - fromOffset / tempoFactor;
    clearSelection();
    scheduledNodes = [];

    // Schedule all notes from the timemap
    for (const entry of timemap) {
      if (!entry.on || entry.on.length === 0) continue;

      const entryTimeSec = (entry.tstamp || 0) / 1000;
      if (entryTimeSec < fromOffset) continue;

      // Note duration: time until the next timemap entry, or 0.5s as a
      // fallback for the very last entry. Multiplied by 0.95 to leave a
      // small gap between consecutive notes for articulation.
      const nextEntry = timemap[timemap.indexOf(entry) + 1];
      const durationSec = nextEntry
        ? (nextEntry.tstamp || 0) / 1000 - entryTimeSec
        : 0.5;

      const scheduledTime = playbackStart + entryTimeSec / tempoFactor;

      for (const noteId of entry.on) {
        const midiInfo = tk.getMIDIValuesForElement(noteId);
        if (midiInfo && midiInfo.pitch !== undefined) {
          const noteName = midiToNoteName(midiInfo.pitch);
          const velocity = (midiInfo.velocity || 90) / 127;
          const node = piano.play(noteName, scheduledTime, {
            duration: (durationSec / tempoFactor) * 0.95,
            gain: velocity,
          });
          if (node) scheduledNodes.push(node);
        }
      }
    }

    // Update transport UI to show "Pause" state
    btnPlay.classList.add("playing");
    playIcon.setAttribute("points", "6,4 10,4 10,20 6,20"); // pause icon
    playLabel.textContent = "Pause";
    progressWrap.classList.add("playing");

    // Start the real-time highlight loop
    updateHighlights();
  }

  /**
   * Stops playback completely and resets to the beginning. Cancels all
   * scheduled Web Audio nodes, clears note highlights, and resets the
   * progress bar.
   */
  function stopPlayback() {
    isPlaying = false;
    isPaused = false;
    pauseOffset = 0;

    // Cancel all scheduled notes by calling .stop() on each Web Audio node
    for (const node of scheduledNodes) {
      try {
        if (node && node.stop) node.stop();
      } catch (e) {}
    }
    scheduledNodes = [];

    clearHighlights();

    // Reset transport UI to show "Play" state
    btnPlay.classList.remove("playing");
    playIcon.setAttribute("points", "5,3 19,12 5,21");
    playLabel.textContent = "Play";
    progressBar.style.width = "0%";
    progressWrap.classList.remove("playing");

    if (animFrameId) cancelAnimationFrame(animFrameId);
  }

  /**
   * Pauses playback at the current position. Records the elapsed time
   * so that pressing Play will resume from where we left off (unless
   * the user selects a different note first).
   *
   * Unlike stopPlayback(), this preserves pauseOffset and sets isPaused
   * so the Play button knows to resume rather than restart.
   */
  function pausePlayback() {
    const elapsed = (audioCtx.currentTime - playbackStart) * tempoFactor;
    pauseOffset = elapsed;
    isPaused = true;
    isPlaying = false;

    for (const node of scheduledNodes) {
      try {
        if (node && node.stop) node.stop();
      } catch (e) {}
    }
    scheduledNodes = [];

    btnPlay.classList.remove("playing");
    playIcon.setAttribute("points", "5,3 19,12 5,21");
    playLabel.textContent = "Play";
    progressWrap.classList.remove("playing");

    if (animFrameId) cancelAnimationFrame(animFrameId);
  }

  // ═══════════════════════════════════════════════════════════════════
  // Note Selection & Highlighting
  //
  // Two visual states for notes:
  //   - "selected" (purple, var(--accent)): user clicked a note to set
  //     a play-from point. Cleared when playback starts.
  //   - "playing" (red, var(--playing)): note is currently sounding
  //     during playback. Updated every animation frame.
  //
  // Both work by toggling CSS classes on Verovio's SVG <g class="note">
  // elements, which are styled in style.css.
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Removes the "selected" CSS class from all notes and resets the
   * selectedOffset state variable.
   */
  function clearSelection() {
    const selected = notation.querySelectorAll("g.note.selected");
    for (const el of selected) el.classList.remove("selected");
    selectedOffset = null;
  }

  /**
   * Removes the "playing" CSS class from all notes. Called at the start
   * of each highlight frame and when playback stops.
   */
  function clearHighlights() {
    const playing = notation.querySelectorAll("g.note.playing");
    for (const el of playing) el.classList.remove("playing");
  }

  /**
   * The main highlight loop, driven by requestAnimationFrame. On each
   * frame:
   *   1. Computes elapsed time from AudioContext
   *   2. Updates the progress bar
   *   3. Checks if playback has ended
   *   4. Finds the current timemap entry (binary-ish search from the end)
   *   5. Highlights the active notes by adding the "playing" CSS class
   *   6. Auto-scrolls the score container to keep active notes visible
   *
   * The elapsed time calculation uses AudioContext.currentTime for
   * sample-accurate timing, scaled by tempoFactor.
   */
  function updateHighlights() {
    if (!isPlaying) return;

    const elapsed = (audioCtx.currentTime - playbackStart) * tempoFactor;
    const elapsedMs = elapsed * 1000;

    // Update progress bar
    if (totalDuration > 0) {
      const pct = Math.min((elapsed / totalDuration) * 100, 100);
      progressBar.style.width = pct + "%";
    }

    // End playback 0.5s after the last timemap entry (grace period for
    // the final note to ring out)
    if (elapsed >= totalDuration + 0.5) {
      stopPlayback();
      return;
    }

    clearHighlights();

    // Walk the timemap backwards to find the most recent entry at or
    // before the current elapsed time. This gives us the note IDs that
    // should be highlighted right now.
    let currentNotes = [];
    for (let i = timemap.length - 1; i >= 0; i--) {
      const entry = timemap[i];
      if ((entry.tstamp || 0) <= elapsedMs) {
        if (entry.on) currentNotes = entry.on;
        break;
      }
    }

    // Highlight active notes and find the first one for scroll targeting
    let firstNoteEl = null;
    for (const noteId of currentNotes) {
      const el = document.getElementById(noteId);
      if (el) {
        el.classList.add("playing");
        if (!firstNoteEl) firstNoteEl = el;
      }
    }

    // Auto-scroll: keep the active note in the upper portion of the
    // visible area. Scrolls smoothly when the note is near the top or
    // bottom edges of the container.
    if (firstNoteEl) {
      const rect = firstNoteEl.getBoundingClientRect();
      const containerRect = scoreContainer.getBoundingClientRect();
      const margin = containerRect.height * 0.35;

      if (
        rect.top < containerRect.top + 60 ||
        rect.bottom > containerRect.bottom - margin
      ) {
        const scrollTarget =
          scoreContainer.scrollTop + rect.top - containerRect.top - margin;
        scoreContainer.scrollTo({ top: scrollTarget, behavior: "smooth" });
      }
    }

    animFrameId = requestAnimationFrame(updateHighlights);
  }

  // ═══════════════════════════════════════════════════════════════════
  // Sidebar
  //
  // The sidebar displays a navigable list of pre-loaded scores,
  // organized into collapsible sections. Mirrors the structure and
  // interaction patterns of the serviceManual app.
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Builds the sidebar song list from the directory data structure.
   * Creates a collapsible section header + songs container for each
   * section. Songs within each section are clickable and load the
   * corresponding .mxl file.
   */
  function buildSongList() {
    directory.forEach((section, si) => {
      // Section header (e.g., "Divine Liturgy")
      const header = document.createElement("li");
      header.textContent = section.title;
      header.className = "section-title";

      // Container for the songs within this section
      const songsContainer = document.createElement("li");
      songsContainer.className = "section-songs";

      // Respect the initial display state from the directory config
      if (section.display === "closed") {
        header.classList.add("collapsed");
        songsContainer.classList.add("collapsed");
      }

      const songUl = document.createElement("ul");

      // Toggle section collapse on header click
      header.addEventListener("click", () => {
        header.classList.toggle("collapsed");
        songsContainer.classList.toggle("collapsed");
      });

      // Create a clickable list item for each song
      section.songs.forEach((song, songIdx) => {
        const li = document.createElement("li");
        li.textContent = song.title;
        li.dataset.section = si;
        li.dataset.song = songIdx;
        li.addEventListener("click", () => loadFromDirectory(si, songIdx));
        songUl.appendChild(li);
      });

      songsContainer.appendChild(songUl);
      songList.appendChild(header);
      songList.appendChild(songsContainer);
    });
  }

  /**
   * Fetches a score from the scores/ directory and loads it into
   * Verovio. Uses the Cache API (when available) to cache fetched .mxl
   * files for faster subsequent loads and offline support.
   *
   * Updates the sidebar's active highlight, the file name display in
   * the header, and closes the sidebar on mobile after loading.
   *
   * @param {number} sectionIndex - 0-based index into the directory array.
   * @param {number} songIndex - 0-based index into the section's songs array.
   */
  async function loadFromDirectory(sectionIndex, songIndex) {
    const song = directory[sectionIndex].songs[songIndex];

    // Update sidebar: highlight the active song
    songList.querySelectorAll("li[data-section]").forEach((li) => {
      li.classList.toggle(
        "active",
        Number(li.dataset.section) === sectionIndex &&
          Number(li.dataset.song) === songIndex,
      );
    });

    // Update the header file name display
    fileName.textContent = song.title;
    fileLabel.classList.add("has-file");

    // Ensure audio is initialized (requires user gesture)
    await initAudio();

    if (isPlaying) stopPlayback();

    setStatus("Loading " + song.title + "…", "loading");
    try {
      // Fetch the .mxl file, using the Cache API when available.
      // The cache key is the URL path (e.g., "scores/we_praise_thee.mxl").
      // On first load, the response is stored in the cache. Subsequent
      // loads serve from cache, avoiding network requests.
      const url = "scores/" + song.filename;
      let data;
      if (typeof caches !== "undefined") {
        const cache = await caches.open("score-follower-scores");
        const cached = await cache.match(url);
        if (cached) {
          data = await cached.arrayBuffer();
        } else {
          const response = await fetch(url);
          await cache.put(url, response.clone());
          data = await response.arrayBuffer();
        }
      } else {
        data = await fetch(url).then((r) => r.arrayBuffer());
      }

      await loadScore(data, true);
    } catch (e) {
      console.error("Failed to load score:", e);
      setStatus("Failed to load " + song.title, "error");
    }

    // Auto-close sidebar on narrow screens
    if (window.innerWidth < 768) {
      sidebar.classList.add("collapsed");
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // Event Handlers
  // ═══════════════════════════════════════════════════════════════════

  // ── Sidebar toggle ──
  // The hamburger button in the header opens/closes the sidebar overlay.
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });

  // Clicking the score area closes the sidebar (same UX as serviceManual)
  scoreContainer.addEventListener("click", () => {
    sidebar.classList.add("collapsed");
  });

  // ── File upload ──
  // Users can still load their own .musicxml/.xml/.mxl files via the
  // header's "Open Score" button, independently of the sidebar directory.
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    fileName.textContent = file.name;
    fileLabel.classList.add("has-file");

    await initAudio();

    if (isPlaying) stopPlayback();

    // Determine if the file is a compressed .mxl (ZIP) or plain XML
    const isCompressed = file.name.toLowerCase().endsWith(".mxl");

    if (isCompressed) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        loadScore(ev.target.result, true);
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        loadScore(ev.target.result, false);
      };
      reader.readAsText(file);
    }
  });

  // ── Play / Pause toggle ──
  // Priority order when pressing Play:
  //   1. If playing → pause
  //   2. If a note is selected → play from that note's timestamp
  //   3. If paused → resume from pause position
  //   4. Otherwise → play from the beginning
  btnPlay.addEventListener("click", async () => {
    await initAudio();

    if (isPlaying) {
      pausePlayback();
    } else if (selectedOffset !== null) {
      isPaused = false;
      startPlayback(selectedOffset);
    } else if (isPaused) {
      startPlayback(pauseOffset);
    } else {
      startPlayback(0);
    }
  });

  // ── Stop ──
  // Stops playback and resets to the beginning.
  btnStop.addEventListener("click", () => {
    stopPlayback();
  });

  // ── Skip to start ──
  // Resets everything to the beginning without starting playback.
  btnSkipStart.addEventListener("click", () => {
    if (isPlaying) stopPlayback();
    clearSelection();
    isPaused = false;
    pauseOffset = 0;
    progressBar.style.width = "0%";
  });

  // ── Skip to end ──
  // Jumps the progress bar to 100% and sets the selected offset to the
  // last timemap entry, so pressing Play would start from the end.
  btnSkipEnd.addEventListener("click", () => {
    if (isPlaying) stopPlayback();
    clearSelection();
    isPaused = false;
    pauseOffset = 0;
    if (totalDuration > 0) {
      progressBar.style.width = "100%";
      const lastEntry = timemap[timemap.length - 1];
      if (lastEntry) {
        selectedOffset = (lastEntry.tstamp || 0) / 1000;
      }
    }
  });

  // ── Tempo slider ──
  // Adjusts the tempo multiplier (25%–200%). If currently playing,
  // restarts playback from the current position at the new tempo.
  tempoSlider.addEventListener("input", (e) => {
    tempoFactor = parseInt(e.target.value) / 100;
    tempoValue.textContent = e.target.value + "%";

    if (isPlaying) {
      const elapsed = (audioCtx.currentTime - playbackStart) * tempoFactor;
      stopPlayback();
      startPlayback(elapsed);
    }
  });

  // ── Click-to-select ──
  // Clicking a note in the score selects it as a play-from point.
  // The note is highlighted in purple (var(--accent)). Pressing Play
  // will start playback from that note's timestamp.
  //
  // Walks up the DOM from the click target to find the enclosing
  // <g class="note"> SVG element (Verovio wraps each note in one),
  // then looks up the note's ID in the timemap to find its timestamp.
  notation.addEventListener("click", (e) => {
    if (!scoreLoaded || !timemap) return;

    let target = e.target;
    while (target && target !== notation) {
      if (target.classList && target.classList.contains("note")) {
        const noteId = target.getAttribute("id");
        if (noteId) {
          for (const entry of timemap) {
            if (entry.on && entry.on.includes(noteId)) {
              clearSelection();
              clearHighlights();
              target.classList.add("selected");
              selectedOffset = (entry.tstamp || 0) / 1000;

              if (isPlaying) {
                stopPlayback();
              }
              return;
            }
          }
        }
        break;
      }
      target = target.parentElement;
    }
  });

  // ── Keyboard shortcuts ──
  // Space: toggle play/pause (when a score is loaded)
  // Escape: stop playback
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && scoreLoaded) {
      e.preventDefault();
      btnPlay.click();
    }
    if (e.code === "Escape" && isPlaying) {
      stopPlayback();
    }
  });

  // ── Window resize ──
  // When the window is resized, re-render the score at the new width.
  // Debounced to 300ms to avoid excessive re-renders during drag-resize.
  // Preserves the current playback position but stops active playback
  // (the timemap must be rebuilt after re-rendering).
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (scoreLoaded && tk) {
        if (isPlaying) stopPlayback();

        const scale = 45;
        const pixelWidth = Math.min(notation.clientWidth - 48, 1100);
        const pageWidth = (pixelWidth * 100) / scale;
        tk.setOptions({ pageWidth: pageWidth });
        tk.redoLayout();

        const pageCount = tk.getPageCount();
        let svgHtml = "";
        for (let i = 1; i <= pageCount; i++) {
          svgHtml += tk.renderToSVG(i);
        }
        notation.innerHTML = svgHtml;

        // Rebuild timemap after re-render (note IDs may have changed)
        timemap = tk.renderToTimemap({
          includeMeasures: true,
          includeRests: false,
        });
        if (timemap && timemap.length > 0) {
          totalDuration = (timemap[timemap.length - 1].tstamp || 0) / 1000;
        }
      }
    }, 300);
  });

  // ═══════════════════════════════════════════════════════════════════
  // Initialization
  // ═══════════════════════════════════════════════════════════════════

  // Build the sidebar from the directory data
  buildSongList();

  // Initialize Verovio WASM (async — the toolkit becomes available
  // when the WASM module finishes loading)
  initVerovio()
    .then(() => setStatus("Ready — open a score", "ready"))
    .catch((err) => {
      console.error(err);
      setStatus("Verovio failed to load", "error");
    });
});
