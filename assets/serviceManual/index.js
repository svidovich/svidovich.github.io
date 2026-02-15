import * as pdfjsLib from "./libs/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./libs/pdf.worker.min.mjs";

const LANG_SERB = "Serbian";
const LANG_ENG = "English";
const LANG_SLAVO = "Slavonic";
const LANG_ENG_SLAVO = "English & Slavonic";
const directory = {
  1: {
    title: "Common Litanies",
    files: [
      { filename: "01b_common_litanies.pdf", language: LANG_ENG },
      { filename: "01_common_litanies.pdf", language: LANG_ENG_SLAVO },
    ],
  },
  2: {
    title: "Blagoslovi Duše: Bless the Lord, O my Soul",
    files: [
      {
        filename: "02_blagoslovi_duse_bless_the_lord.pdf",
        language: LANG_SLAVO,
      },
    ],
  },
  3: {
    title: "Blaženi: The Beatitudes",
    files: [{ filename: "04_blazeni_beatitudes.pdf", language: LANG_ENG }],
  },
  4: {
    title: "Pridite: Come, Let us Worship",
    files: [
      { filename: "05_pridite_come_let_us_worship.pdf", language: LANG_ENG },
    ],
  },
  5: {
    title: "Theotokion",
    files: [{ filename: "xx_it_is_truly_meet.pdf", language: LANG_ENG }],
  },
  6: {
    title: "'Milost Mira', 'Dostojno Jest', 'Svjat Svat!'",
    files: [
      {
        filename: "xx_milost_mira_dostojno_svjat_svjat.pdf",
        language: LANG_ENG_SLAVO,
      },
    ],
  },
  7: {
    title: "'Vidjehom Svjet Istinij', 'Amin Da Ispolnjatsja'",
    files: [
      { filename: "xx_vidjehom_svjet_amin_da.pdf", language: LANG_SLAVO },
    ],
  },
};

/**
 * Application for browsing service manual PDFs in order during a church service.
 * Renders PDF pages to canvases via PDF.js, with a sidebar for song titles,
 * language selection, and sequential navigation.
 */
class ServiceManualApp {
  /**
   * @param {Object} directory - The directory object mapping 1-based indices to
   *   entries, each with a `title` string and a `files` array of
   *   `{ filename, language }` objects.
   */
  constructor(directory) {
    this.directory = directory;
    this.entries = Object.keys(directory)
      .map(Number)
      .sort((a, b) => a - b);
    this.currentIndex = 0;
    this.renderGeneration = 0;

    this.sidebarToggle = document.getElementById("sidebar-toggle");
    this.prevBtn = document.getElementById("prev-btn");
    this.nextBtn = document.getElementById("next-btn");
    this.currentTitle = document.getElementById("current-title");
    this.languageSelect = document.getElementById("language-select");
    this.sidebar = document.getElementById("sidebar");
    this.songList = document.getElementById("song-list");
    this.viewer = document.getElementById("viewer");

    this.init();
  }

  /**
   * Initializes the application by building the sidebar, binding event
   * handlers, and loading the first entry.
   */
  init() {
    this.buildSongList();
    this.bindEvents();
    this.loadEntry(this.entries[0]);
  }

  /**
   * Populates the sidebar with a list item for each directory entry,
   * displaying its number and title.
   */
  buildSongList() {
    for (const key of this.entries) {
      const li = document.createElement("li");
      li.textContent = `${key}. ${this.directory[key].title}`;
      li.dataset.key = key;
      li.addEventListener("click", () => this.loadEntry(key));
      this.songList.appendChild(li);
    }
  }

  /**
   * Binds click and change event listeners to the topbar controls:
   * sidebar toggle, prev/next buttons, and language dropdown.
   */
  bindEvents() {
    this.sidebarToggle.addEventListener("click", () => this.toggleSidebar());
    this.prevBtn.addEventListener("click", () => this.navigate(-1));
    this.nextBtn.addEventListener("click", () => this.navigate(1));
    this.languageSelect.addEventListener("change", () =>
      this.onLanguageChange(),
    );
  }

  /**
   * Toggles the sidebar's visibility by adding or removing the
   * `collapsed` CSS class.
   */
  toggleSidebar() {
    this.sidebar.classList.toggle("collapsed");
  }

  /**
   * Navigates to the next or previous entry in the directory.
   * @param {number} direction - The step direction: -1 for previous, +1 for next.
   */
  navigate(direction) {
    const newIndex = this.currentIndex + direction;
    if (newIndex >= 0 && newIndex < this.entries.length) {
      this.loadEntry(this.entries[newIndex]);
    }
  }

  /**
   * Loads a directory entry by its key. Updates the title, language dropdown,
   * active sidebar highlight, prev/next button states, and renders the
   * first available PDF for that entry.
   * @param {number} key - The 1-based directory key to load.
   */
  loadEntry(key) {
    this.currentIndex = this.entries.indexOf(key);
    const entry = this.directory[key];

    this.currentTitle.textContent = entry.title;

    this.languageSelect.innerHTML = "";
    for (const file of entry.files) {
      const option = document.createElement("option");
      option.value = file.filename;
      option.textContent = file.language;
      this.languageSelect.appendChild(option);
    }

    const items = this.songList.querySelectorAll("li");
    items.forEach((li) => {
      li.classList.toggle("active", Number(li.dataset.key) === key);
    });

    const activeLi = this.songList.querySelector("li.active");
    if (activeLi) {
      activeLi.scrollIntoView({ block: "nearest" });
    }

    this.renderPdf(entry.files[0].filename);

    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex === this.entries.length - 1;
  }

  /**
   * Handles a change in the language dropdown by rendering the PDF
   * corresponding to the newly selected option.
   */
  onLanguageChange() {
    this.renderPdf(this.languageSelect.value);
  }

  /**
   * Loads a PDF file via PDF.js and renders all of its pages as canvases
   * into the viewer container. Each page is scaled to fill the viewer width.
   * Uses a generation counter to discard results from stale loads.
   * @param {string} filename - The PDF filename within the documents/ folder.
   */
  async renderPdf(filename) {
    const generation = ++this.renderGeneration;
    this.viewer.innerHTML = "";
    this.viewer.scrollTop = 0;

    const pdf = await pdfjsLib.getDocument(`documents/${filename}`).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      if (generation !== this.renderGeneration) return;

      const page = await pdf.getPage(i);
      const maxWidth = Math.min(this.viewer.clientWidth - 16, 800);
      const scale = (maxWidth / page.getViewport({ scale: 1 }).width) *
        window.devicePixelRatio;
      const viewport = page.getViewport({ scale });

      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / window.devicePixelRatio}px`;
      canvas.style.height = `${viewport.height / window.devicePixelRatio}px`;

      this.viewer.appendChild(canvas);

      await page.render({
        canvasContext: canvas.getContext("2d"),
        viewport,
      }).promise;
    }

    if (generation !== this.renderGeneration) return;
    this.viewer.appendChild(this.createDownloadLink(filename));
  }

  /**
   * Creates an anchor element styled as a download link, pointing at
   * the given PDF file in the documents directory.
   * @param {string} filename - The PDF filename within the documents/ folder.
   * @returns {HTMLAnchorElement} The download link element.
   */
  createDownloadLink(filename) {
    const link = document.createElement("a");
    link.href = `documents/${filename}`;
    link.download = filename;
    link.textContent = "Download PDF";
    link.className = "download-link";
    return link;
  }
}

new ServiceManualApp(directory);
