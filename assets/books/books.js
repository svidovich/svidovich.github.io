import { randomInt } from "../cards/utilities.js";
import { CrvenkapaBook } from "./data/crvenkapa.js";
import { BOOKS } from "./data/index.js";

const maxFromStringArray = (stringArray) => {
  let max;
  for (let i = 0; i < stringArray.length; i++) {
    const asInt = parseInt(stringArray[i]);
    if (isNaN(parseInt(max))) {
      max = asInt;
    } else if (asInt > max) {
      max = asInt;
    }
  }
  return max;
};

const preRenderPageFromSentences = (pagesObject) => {
  /*
  What even. OK so...
  Books can be of arbitrary length, and so can sentences.
  Also, people's browsers can be on all kinds of dumbass screens.
  They can get whatever size they want. They get paid, you know?
  They have money. So that means that I cannot choose how many
  sentences fit on a given page. So that means that I need to
  be able to fit a dynamic number of sentences to a dynamic number
  of pages. Fine.
  So what we're gonna do --
  shut up --
  we're gonna pre-render all of the pages, and index them, that way
  we know how many sentences fit on the page when the user loads it.
  If they change the size of the page, they're fucking up. I can't
  be responsible for that.
  But, we'll pre-compute the pages based on the browser window.
  So.
  */

  const ws = document.getElementById("workspacediv");
  // clear the workspace before we get a-rendering.
  while (ws.firstChild) {
    ws.removeChild(ws.lastChild);
  }
  const wsRect = ws.getBoundingClientRect();
  const pagesAndSentences = {
    pages: pagesObject.pages ? pagesObject.pages : {},
    sentences: pagesObject.sentences ? pagesObject.sentences : {},
  };

  let lastSentence;
  for (const entry of Object.entries(pagesAndSentences.sentences)) {
    const [strIdx, sentence] = entry;
    const idx = parseInt(strIdx);
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

    const rpRect = rp.getBoundingClientRect();
    // If our paragraph's bottom extends beyond the end of our div:
    if (rpRect.bottom >= wsRect.bottom) {
      // First, dump everything.
      while (ws.firstChild) {
        ws.removeChild(ws.lastChild);
      }

      // thisPage will contain all of the sentences that actually fit
      // on this particular page...
      const thispage = Object.values(pagesAndSentences.sentences).slice(0, idx);
      // ... remainder will contain all of the sentences that didn't.
      const remainder = Object.values(pagesAndSentences.sentences).slice(idx);
      // Get all of the pages we already have,
      const extantPages = pagesAndSentences.pages;

      let nextPageIndex;
      // If we don't have _any pages_,
      if (Object.keys(extantPages).length === 0) {
        // This will be our first page.
        nextPageIndex = 0;
      } else {
        // Otherwise, this will be the page after the last one.
        nextPageIndex = Math.max(...Object.keys(extantPages).map((e) => parseInt(e))) + 1;
      }

      const nextArg = {
        pages: extantPages,
        sentences: remainder,
      };
      nextArg.pages[nextPageIndex] = thispage;
      // Recurse.
      return preRenderPageFromSentences(nextArg);
    }
  }
  // OK, we have run out of elements, but we have not reached the
  // end of the div. So first, clear out the div --
  while (ws.firstChild) {
    ws.removeChild(ws.lastChild);
  }
  // Now, let's add the current set of sentences as the last page.
  // These are uh, strings. Hm.
  let nextPageIndex;
  // If we don't have _any pages_,
  if (Object.keys(pagesAndSentences.pages).length === 0) {
    // This will be our first page.
    nextPageIndex = 0;
  } else {
    // Otherwise, this will be the page after the last one.
    nextPageIndex = Math.max(...Object.keys(pagesAndSentences.pages).map((e) => parseInt(e))) + 1;
  }
  const output = {
    pages: pagesAndSentences.pages,
    sentences: [],
  };
  // End of the line. We should have all of the pages,
  // and there shouldn't be any more sentences. Fill the last
  // index in pages with the last of the sentences.
  output.pages[nextPageIndex] = Object.values(pagesAndSentences.sentences);

  return output;
};

const renderPage = (sentenceArray) => {
  const ws = document.getElementById("workspacediv");
  // Clear the workspace before we render
  while (ws.firstChild) {
    ws.removeChild(ws.lastChild);
  }
  for (const [idx, sentence] of sentenceArray.entries()) {
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
    // Make matched sentences glow when you scroll over one of them!
    [lp, rp].forEach((paragraph) => {
      // When we mouseover, if the color isn't toggled, flash to
      // the highlight color.
      paragraph.addEventListener("mouseover", () => {
        if (!lp.classList.contains("colortoggled")) {
          lp.style.color = "darkslateblue";
          rp.style.color = "darkslateblue";
        }
      });
      // When we leave, if the color isn't toggled, return to normal
      paragraph.addEventListener("mouseleave", () => {
        if (!lp.classList.contains("colortoggled")) {
          lp.style.color = "black";
          rp.style.color = "black";
        }
      });
      // When we click...
      paragraph.addEventListener("click", () => {
        // If the color isn't currently toggled, we should
        // set it to the highlight color, then set it to toggle.
        if (!lp.classList.contains("colortoggled")) {
          lp.style.color = "darkslateblue";
          rp.style.color = "darkslateblue";
          lp.classList.add("colortoggled");
          rp.classList.add("colortoggled");
        } else {
          // If our color is toggled, and our current color is the
          // highlight color, we should return to normal, and we should
          // remove the toggle.
          if (lp.style.color === "darkslateblue") {
            lp.style.color = "black";
            rp.style.color = "black";
            lp.classList.remove("colortoggled");
            rp.classList.remove("colortoggled");
            // Otherwise, toggle the highlight color. Is this state necessary...?
          } else {
            lp.style.color = "darkslateblue";
            rp.style.color = "darkslateblue";
            lp.classList.add("colortoggled");
            rp.classList.add("colortoggled");
          }
        }
      });
    });
  }
};

let globalCurrentPage;
let globalPages;

const addButtonEventListeners = () => {
  // The way this page is set up is that the workspace is in an iframe
  // on the main page, while the buttons for turning the page are on
  // the main page itself. To get at those elements, we need to summon
  // up the 'document' object of the main page.
  const pageButtonNext = window.parent.document.getElementById("pagebuttonnext");
  const pageButtonPrevious = window.parent.document.getElementById("pagebuttonprevious");

  pageButtonNext.addEventListener("click", () => {
    const nextIdx = globalCurrentPage + 1;
    if (globalPages[nextIdx]) {
      globalCurrentPage = nextIdx;
      renderPage(globalPages[globalCurrentPage]);
      setPageInputValueFromGlobal();
    }
  });
  pageButtonPrevious.addEventListener("click", () => {
    const nextIdx = globalCurrentPage - 1;
    if (globalPages[nextIdx]) {
      globalCurrentPage = nextIdx;
      renderPage(globalPages[globalCurrentPage]);
      setPageInputValueFromGlobal();
    }
  });
};

const addPageNumberEventListener = () => {
  const pageNumberControl = window.parent.document.getElementById("pagenumbercontrol");
  pageNumberControl.addEventListener("input", () => {
    const inputValue = parseInt(pageNumberControl.value);
    if (!isNaN(inputValue)) {
      const lastPage = maxFromStringArray(Object.keys(globalPages));
      if (inputValue <= lastPage) {
        globalCurrentPage = inputValue;
        renderPage(globalPages[globalCurrentPage]);
      }
    }
  });
};

const setPageInputValueFromGlobal = () => {
  const pageNumberControl = window.parent.document.getElementById("pagenumbercontrol");
  pageNumberControl.setAttribute("value", `${globalCurrentPage}`);
};

const setPageCountTextFromGlobal = () => {
  const lastPage = maxFromStringArray(Object.keys(globalPages));
  const pageCountText = window.parent.document.getElementById("controlpagecounttext");
  pageCountText.textContent = lastPage;
};

const fillSideBarWithBooks = () => {
  const sideBar = window.parent.document.getElementById("bookssidebar");
  const bookCase = sideBar.contentWindow.document.getElementById("bookcase");

  BOOKS.forEach((book) => {
    const bookLink = document.createElement("div");
    const bookTitle = document.createTextNode(book.title);
    bookLink.classList.add("book");
    bookLink.title = book.description;
    bookLink.appendChild(bookTitle);
    bookLink.addEventListener("click", () => {
      const preRenderArg = { pages: {}, sentences: book.sentences };
      globalPages = preRenderPageFromSentences(preRenderArg).pages;
      globalCurrentPage = 0;
      setPageCountTextFromGlobal();
      setPageInputValueFromGlobal();
      renderPage(globalPages[globalCurrentPage]);
    });
    bookCase.appendChild(bookLink);
  });
};

const renderWelcomeMessage = () => {
  const ws = document.getElementById("workspacediv");
  // Clear the workspace before we render
  while (ws.firstChild) {
    ws.removeChild(ws.lastChild);
  }
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("welcometext");
  const message = document.createTextNode("Choose a book from the sidebar to get started!");
  messageDiv.appendChild(message);
  ws.appendChild(messageDiv);
};

const main = () => {
  // const firstArg = { pages: {}, sentences: CrvenkapaBook.sentences };
  // globalPages = preRenderPageFromSentences(firstArg).pages;
  // setPageCountTextFromGlobal();

  // globalCurrentPage = 0;
  // renderPage(globalPages[globalCurrentPage]);
  addButtonEventListeners();
  addPageNumberEventListener();
  fillSideBarWithBooks();
  renderWelcomeMessage();
};

main();
