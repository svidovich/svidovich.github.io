import * as pdfjsLib from "./libs/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc = "./libs/pdf.worker.min.mjs";

const LANG_SERB = "Serbian";
const LANG_ENG = "English";
const LANG_SLAVO = "Slavonic";
const LANG_ENG_SLAVO = "English & Slavonic";

const directory = [
  {
    title: "Divine Liturgy",
    display: "open",
    songs: [
      {
        title: "Common Litanies",
        files: [
          {
            filename: "01b_common_litanies.pdf",
            scoreTitle: "Common Litanies: English",
            language: LANG_ENG,
            musescore: "https://musescore.com/user/91550341/scores/32321195",
          },
          {
            filename: "01_common_litanies.pdf",
            scoreTitle: "Common Litanies: Bilingual",
            language: LANG_ENG_SLAVO,
            musescore: null,
          },
        ],
      },
      {
        title: "Bless the Lord, O my Soul",
        files: [
          {
            filename: "02_blagoslovi_duse_bless_the_lord.pdf",
            scoreTitle: "Blagoslovi Duše",
            language: LANG_SLAVO,
            musescore: "https://musescore.com/user/91550341/scores/32321234",
          },
        ],
      },
      {
        title: "Only-Begotten Son",
        files: [
          {
            filename: "03_jedinorodni_sine.pdf",
            scoreTitle: "Jedinorodni Sine",
            language: LANG_SLAVO,
            musescore: "https://musescore.com/user/91550341/scores/32337671",
          },
        ],
      },
      {
        title: "Blaženi: The Beatitudes",
        files: [
          {
            filename: "04_blazeni_beatitudes.pdf",
            scoreTitle: "Blaženi: The Beatitudes",
            language: LANG_ENG,
            musescore: "https://musescore.com/user/91550341/scores/29585978",
          },
        ],
      },
      {
        title: "Pridite: Come, Let us Worship",
        files: [
          {
            filename: "05_pridite_come_let_us_worship.pdf",
            scoreTitle: "Come, Let us Worship",
            language: LANG_ENG,
            musescore: "https://musescore.com/user/91550341/scores/29636744",
          },
        ],
      },
      {
        title: "St. George's Troparion",
        files: [
          {
            filename: "06_st_george_troparion.pdf",
            scoreTitle: "St. George's Troparion",
            language: LANG_ENG,
            musescore: "https://musescore.com/user/91550341/scores/32134505",
          },
        ],
      },
      {
        title: "Thrice-Holy Hymn",
        files: [
          {
            filename: "svjati_boze_regular.pdf",
            scoreTitle: "Svjati Bože (Usual)",
            language: LANG_SLAVO,
            musescore: "https://musescore.com/user/91550341/scores/32321183",
          },
          {
            filename: "svjati_boze_special.pdf",
            scoreTitle: "Svjati Bože (Special)",
            language: LANG_SLAVO,
            musescore: "https://musescore.com/user/91550341/scores/32337722",
          },
        ],
      },
      {
        title: "The Creed",
        files: [
          {
            filename: "the_creed_v0.3.pdf",
            scoreTitle: "The Creed",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
      {
        title: "'Milost Mira', 'Dostojno Jest', 'Svjat Svat!'",
        files: [
          {
            filename: "xx_milost_mira_dostojno_svjat_svjat.pdf",
            scoreTitle: "'Milost Mira', 'Dostojno Jest', 'Svjat Svat!'",
            language: LANG_ENG_SLAVO,
            musescore: "https://musescore.com/user/91550341/scores/32321348",
          },
        ],
      },
      {
        title: "We Praise Thee",
        files: [
          {
            filename: "we_praise_thee_mixed.pdf",
            scoreTitle: "We Praise Thee",
            language: LANG_ENG_SLAVO,
            musescore: "https://musescore.com/user/91550341/scores/32527565",
          },
        ],
      },
      {
        title: "Hymn to the Theotokos",
        files: [
          {
            filename: "xx_it_is_truly_meet.pdf",
            scoreTitle: "It is Truly Meet ( Balakirev )",
            language: LANG_ENG,
            musescore: "https://musescore.com/user/91550341/scores/23499880",
          },
          {
            filename: "xx_all_of_creation.pdf",
            scoreTitle: "All of Creation Rejoices, Tone 6",
            language: LANG_ENG,
            musescore: "https://musescore.com/user/91550341/scores/32337695",
          },
        ],
      },
      {
        title: "To Thee, Amen, Jedin Svjat",
        files: [
          {
            filename: "to_thee_amen_jedin_svjat.pdf",
            scoreTitle: "To Thee, Amen, Jedin Svjat",
            language: LANG_ENG,
            musescore: "https://musescore.com/user/91550341/scores/25645099",
          },
        ],
      },
      {
        title: "Communion Hymn",
        files: [
          {
            filename: "hvalite.v0.2.pdf",
            scoreTitle: "Hvalite",
            language: LANG_ENG,
            musescore: "https://musescore.com/user/91550341/scores/32525783",
          },
          {
            filename: "beneath_your_compassion_eng.pdf",
            scoreTitle: "Beneath Your Compassion",
            language: LANG_ENG,
            musescore: "https://musescore.com/user/91550341/scores/32525159",
          },
        ],
      },
      {
        title: "Prayer Before Communion",
        files: [
          {
            filename: "prayer_before_communion.pdf",
            scoreTitle: "Prayer Before Communion",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
      {
        title: "Blagosloven Grjadi",
        files: [
          {
            filename: "blagosloven_grjadi.pdf",
            scoreTitle: "Blagosloven Grjadi",
            language: LANG_SLAVO,
            musescore: "https://musescore.com/user/91550341/scores/32526983",
          },
        ],
      },
      {
        title: "Tijelo Hristovo",
        files: [
          {
            filename: "tijelo_hristovo.pdf",
            scoreTitle: "Tijelo Hristovo",
            language: LANG_SLAVO,
            musescore: "https://musescore.com/user/91550341/scores/32526713",
          },
        ],
      },
      {
        title: "Prayer After Communion",
        files: [
          {
            filename: "prayer_after_communion.pdf",
            scoreTitle: "Prayer After Communion",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
      {
        title: "'Vidjehom Svjet Istinij', 'Amin Da Ispolnjatsja'",
        files: [
          {
            filename: "xx_vidjehom_svjet_amin_da.pdf",
            scoreTitle: "'Vidjehom Svjet Istinij', 'Amin Da Ispolnjatsja'",
            language: LANG_SLAVO,
            musescore: "https://musescore.com/user/91550341/scores/32321369",
          },
        ],
      },
    ],
  },
  {
    title: "Troparia & Kontakia",
    display: "closed",
    songs: [
      {
        title: "Tone 1",
        files: [
          {
            filename: "troparia-kontakia/Resurrection-Trop-kont1.pdf",
            scoreTitle: "Troparion & Kontakion, Tone 1",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
      {
        title: "Tone 2",
        files: [
          {
            filename: "troparia-kontakia/Resurrection-Trop-kont2.pdf",
            scoreTitle: "Troparion & Kontakion, Tone 2",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
      {
        title: "Tone 3",
        files: [
          {
            filename: "troparia-kontakia/Resurrection-Trop-kont3.pdf",
            scoreTitle: "Troparion & Kontakion, Tone 3",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
      {
        title: "Tone 4",
        files: [
          {
            filename: "troparia-kontakia/Resurrection-Trop-kont4.pdf",
            scoreTitle: "Troparion & Kontakion, Tone 4",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
      {
        title: "Tone 5",
        files: [
          {
            filename: "troparia-kontakia/Resurrection-Trop-kont5.pdf",
            scoreTitle: "Troparion & Kontakion, Tone 5",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
      {
        title: "Tone 6",
        files: [
          {
            filename: "troparia-kontakia/Resurrection-Trop-kont6.pdf",
            scoreTitle: "Troparion & Kontakion, Tone 6",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
      {
        title: "Tone 7",
        files: [
          {
            filename: "troparia-kontakia/Resurrection-Trop-kont7.pdf",
            scoreTitle: "Troparion & Kontakion, Tone 7",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
      {
        title: "Tone 8",
        files: [
          {
            filename: "troparia-kontakia/Resurrection-Trop-kont8.pdf",
            scoreTitle: "Troparion & Kontakion, Tone 8",
            language: LANG_ENG,
            musescore: null,
          },
        ],
      },
    ],
  },
];

/**
 * Application for browsing service manual PDFs in order during a church service.
 * Renders PDF pages to canvases via PDF.js, with a sidebar organized into
 * sections. Navigation (prev/next) stays within the current section.
 */
class ServiceManualApp {
  /**
   * @param {Array} directory - Array of sections, each with a `title` string
   *   and a `songs` array of `{ title, files }` objects. Song numbers are
   *   1-based and reset within each section.
   */
  constructor(directory) {
    this.directory = directory;
    this.currentSectionIndex = 0;
    this.currentSongIndex = 0;
    this.renderGeneration = 0;

    this.pdfWorker = new pdfjsLib.PDFWorker();

    this.sidebarToggle = document.getElementById("sidebar-toggle");
    this.prevBtn = document.getElementById("prev-btn");
    this.nextBtn = document.getElementById("next-btn");
    this.currentTitle = document.getElementById("current-title");
    this.scoreSelect = document.getElementById("score-select");
    this.sidebar = document.getElementById("sidebar");
    this.songList = document.getElementById("song-list");
    this.viewer = document.getElementById("viewer");

    this.init();
  }

  /**
   * Initializes the application by building the sidebar, binding event
   * handlers, and loading the first song of the first non-empty section.
   */
  init() {
    this.buildSongList();
    this.bindEvents();
    const firstSection = this.directory.findIndex((s) => s.songs.length > 0);
    if (firstSection !== -1) this.loadEntry(firstSection, 0);
  }

  /**
   * Populates the sidebar with a collapsible section header followed by a
   * songs container for each section. Clicking the header toggles collapse.
   */
  buildSongList() {
    this.directory.forEach((section, si) => {
      const header = document.createElement("li");
      header.textContent = section.title;
      header.className = "section-title";

      const songsContainer = document.createElement("li");
      songsContainer.className = "section-songs";

      if (section.display === "closed") {
        header.classList.add("collapsed");
        songsContainer.classList.add("collapsed");
      }
      const songUl = document.createElement("ul");

      header.addEventListener("click", () => {
        header.classList.toggle("collapsed");
        songsContainer.classList.toggle("collapsed");
      });

      section.songs.forEach((song, songIdx) => {
        const li = document.createElement("li");
        li.textContent = `${songIdx + 1}. ${song.title}`;
        li.dataset.section = si;
        li.dataset.song = songIdx;
        li.addEventListener("click", () => this.loadEntry(si, songIdx));
        songUl.appendChild(li);
      });

      songsContainer.appendChild(songUl);
      this.songList.appendChild(header);
      this.songList.appendChild(songsContainer);
    });
  }

  /**
   * Binds click and change event listeners to the topbar controls:
   * sidebar toggle, prev/next buttons, and score dropdown.
   */
  bindEvents() {
    this.sidebarToggle.addEventListener("click", () => this.toggleSidebar());
    this.prevBtn.addEventListener("click", () => this.navigate(-1));
    this.nextBtn.addEventListener("click", () => this.navigate(1));
    this.scoreSelect.addEventListener("change", () => this.onScoreChange());
    this.viewer.addEventListener("click", () =>
      this.sidebar.classList.add("collapsed"),
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
   * Navigates to the next or previous song within the current section.
   * Does not cross section boundaries.
   * @param {number} direction - The step direction: -1 for previous, +1 for next.
   */
  navigate(direction) {
    const section = this.directory[this.currentSectionIndex];
    const newSongIndex = this.currentSongIndex + direction;
    if (newSongIndex >= 0 && newSongIndex < section.songs.length) {
      this.loadEntry(this.currentSectionIndex, newSongIndex);
    }
  }

  /**
   * Loads a song by section and song index. Updates the title, score dropdown,
   * active sidebar highlight, prev/next button states, and renders the first
   * available PDF for that song.
   * @param {number} sectionIndex - The 0-based index of the section.
   * @param {number} songIndex - The 0-based index of the song within the section.
   */
  loadEntry(sectionIndex, songIndex) {
    this.currentSectionIndex = sectionIndex;
    this.currentSongIndex = songIndex;
    const song = this.directory[sectionIndex].songs[songIndex];

    this.currentTitle.textContent = song.title;

    this.scoreSelect.innerHTML = "";
    for (const file of song.files) {
      const option = document.createElement("option");
      option.value = file.filename;
      option.textContent = file.scoreTitle;
      this.scoreSelect.appendChild(option);
    }

    this.songList.querySelectorAll("li[data-section]").forEach((li) => {
      li.classList.toggle(
        "active",
        Number(li.dataset.section) === sectionIndex &&
          Number(li.dataset.song) === songIndex,
      );
    });

    const activeLi = this.songList.querySelector("li.active");
    if (activeLi) {
      activeLi.scrollIntoView({ block: "nearest" });
    }

    this.renderPdf(song.files[0].filename, song.files[0].musescore);

    const section = this.directory[sectionIndex];
    this.prevBtn.disabled = this.currentSongIndex === 0;
    this.nextBtn.disabled = this.currentSongIndex === section.songs.length - 1;
  }

  /**
   * Handles a change in the score dropdown by rendering the PDF
   * corresponding to the newly selected option.
   */
  onScoreChange() {
    const filename = this.scoreSelect.value;
    const song =
      this.directory[this.currentSectionIndex].songs[this.currentSongIndex];
    const file = song.files.find((f) => f.filename === filename);
    this.renderPdf(filename, file?.musescore);
  }

  /**
   * Loads a PDF file via PDF.js and renders all of its pages as canvases
   * into the viewer container. Each page is scaled to fill the viewer width.
   * Uses a generation counter to discard results from stale loads.
   * @param {string} filename - The PDF filename within the documents/ folder.
   */
  async renderPdf(filename, musescore) {
    const generation = ++this.renderGeneration;
    this.viewer.innerHTML = "";
    this.viewer.scrollTop = 0;

    const url = `documents/${filename}`;
    let pdfData;
    if (typeof caches !== "undefined") {
      const cache = await caches.open("service-manual-pdfs");
      const cached = await cache.match(url);
      if (cached) {
        pdfData = await cached.arrayBuffer();
      } else {
        const response = await fetch(url);
        await cache.put(url, response.clone());
        pdfData = await response.arrayBuffer();
      }
    } else {
      pdfData = await fetch(url).then((r) => r.arrayBuffer());
    }

    const pdf = await pdfjsLib.getDocument({
      data: pdfData,
      worker: this.pdfWorker,
    }).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      if (generation !== this.renderGeneration) return;

      const page = await pdf.getPage(i);
      const maxWidth = Math.min(this.viewer.clientWidth - 16, 800);
      const scale =
        (maxWidth / page.getViewport({ scale: 1 }).width) *
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
    if (musescore) {
      this.viewer.appendChild(this.createMusescoreLink(musescore));
    }
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

  /**
   * Creates an anchor element linking to a MuseScore score page.
   * @param {string} url - The MuseScore URL.
   * @returns {HTMLAnchorElement} The MuseScore link element.
   */
  createMusescoreLink(url) {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "View on MuseScore";
    link.className = "download-link";
    return link;
  }
}

new ServiceManualApp(directory);
