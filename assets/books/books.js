import { isMobile } from "../cards/os.js";
import { BOOKS } from "./data/index.js";

const DOWNLOAD_ICON_DEFAULT_FILTER = `grayscale(100%)`;

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

/*
Turn the input array into an object mapped by the index of the item in the array.
*/
const beMapArray = (array) => {
  let output = new Object();
  for (const [index, item] of array.entries()) {
    output[index] = item;
  }

  return output;
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
    const rt = document.createTextNode(sentence.latin);
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
      console.log(thispage);
      // Get all of the pages we already have,
      const extantPages = pagesAndSentences.pages;

      let nextPageIndex;
      // If we don't have _any pages_,
      if (Object.keys(extantPages).length === 0) {
        // This will be our first page.
        nextPageIndex = 0;
      } else {
        // Otherwise, this will be the page after the last one.
        nextPageIndex =
          Math.max(...Object.keys(extantPages).map((e) => parseInt(e))) + 1;
      }
      console.log("pages:");
      console.log(extantPages);
      console.log("remainder:");
      console.log(remainder);
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
    nextPageIndex =
      Math.max(
        ...Object.keys(pagesAndSentences.pages).map((e) => parseInt(e))
      ) + 1;
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
    const rt = document.createTextNode(sentence.latin);
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

let globalCurrentBook;
let globalCurrentPage;
let globalPages;

const addButtonEventListeners = () => {
  // The way this page is set up is that the workspace is in an iframe
  // on the main page, while the buttons for turning the page are on
  // the main page itself. To get at those elements, we need to summon
  // up the 'document' object of the main page.
  const pageButtonNext =
    window.parent.document.getElementById("pagebuttonnext");
  const pageButtonPrevious =
    window.parent.document.getElementById("pagebuttonprevious");

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
  const pageNumberControl =
    window.parent.document.getElementById("pagenumbercontrol");
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

const downloadIconsInactive = () => {
  const storyDownloadIconImage =
    window.parent.document.getElementById("storydownload");
  // Checks whether the download icons are in an active state
  // or not by eyeballing their style. They come in pairs like
  // salt and pepper. We don't change one without the other.
  return [storyDownloadIconImage].every((icon) => {
    return icon.style.filter === DOWNLOAD_ICON_DEFAULT_FILTER;
  });
};

const toggleDownloadIconStyles = () => {
  const iconReadyCursor = `pointer`;
  const storyDownloadIconImage =
    window.parent.document.getElementById("storydownload");
  // Download icon active? Make it grayscale and unpointy.
  // Inactive? Make it colorful and pointy.
  // NOTE -- we use an array here in case we need more in the future.
  [storyDownloadIconImage].forEach((icon) => {
    if (icon.style.filter === DOWNLOAD_ICON_DEFAULT_FILTER) {
      icon.style.filter = null;
      icon.style.cursor = iconReadyCursor;
    } else {
      icon.style.filter = DOWNLOAD_ICON_DEFAULT_FILTER;
      icon.style.cursor = null;
    }
  });
};

const prepareBookDownloadOptions = (book) => {
  const downloadImagesDiv = window.parent.document.getElementById("downloads");
  const storyDownloadIconImage =
    window.parent.document.getElementById("storydownload");

  // Remove the grayscale from the download icon image.
  // Prepare a link for the image that is clickable, that allow
  // the user to download the story.
  if (downloadIconsInactive()) {
    toggleDownloadIconStyles();
  }
  const storyLinkId = "storydownloadlink";

  // This is state handling. If we're clicking between lessons,
  // the download links will already exist. We need to find them
  // and clear them, then ready up the new links. Otherwise, we
  // just make fresh links.
  const latentStoryLink = document.getElementById(storyLinkId);
  if (latentStoryLink !== null) {
    // Do some DOM manip
    // <div><a><img/></a><div> -> <div><img/><a></a></div> -> <div><img/></div>
    downloadImagesDiv.appendChild(storyDownloadIconImage);
    downloadImagesDiv.removeChild(latentStoryLink);
  }

  const storyLink = window.document.createElement("a");

  storyLink.id = storyLinkId;
  // For a brief moment our image leaves the div.
  storyLink.appendChild(storyDownloadIconImage);

  // We put our image back into the div as a child of the link here.
  downloadImagesDiv.appendChild(storyLink);

  // Add the content as text to the href in a blobby link.
  // Here we use application/octet-stream instead of
  // application/json so that we force a download dialog
  let bookTextFormat = "";
  bookTextFormat += `${book.title} (${book.titleEnglish}): from ${book.parentText}\n\n\n`;
  if (book.description) {
    bookTextFormat += `Description:\n${book.description}\n\n\n`;
  }
  if (book.isPoem === true) {
    // TODO lots more fun stuff to do with formatting, here
    bookTextFormat += `Serbian version:\n`;
    Object.values(book.sentences).forEach((sentence) => {
      bookTextFormat += `${sentence.latin}\n`;
    });
    bookTextFormat += "\n\n";
    bookTextFormat += `English version:\n`;
    Object.values(book.sentences).forEach((sentence) => {
      bookTextFormat += `${sentence.english}\n`;
    });
  } else {
    // TODO Need to figure out how I wanna do paragraphs.
    bookTextFormat += `Serbian version:\n`;
    Object.values(book.sentences).forEach((sentence) => {
      bookTextFormat += `${sentence.latin} `;
    });
    bookTextFormat += "\n\n\n";
    bookTextFormat += `English version:\n`;
    Object.values(book.sentences).forEach((sentence) => {
      bookTextFormat += `${sentence.english} `;
    });
  }
  storyLink.href = window.URL.createObjectURL(
    new Blob([bookTextFormat], { type: "application/octet-stream" })
  );
  // This lets us name the file.
  storyLink.download = `${book.titleUnfriendly}.txt`;
};

const setPageInputValueFromGlobal = () => {
  const pageNumberControl =
    window.parent.document.getElementById("pagenumbercontrol");
  pageNumberControl.setAttribute("value", `${globalCurrentPage}`);
};

const setPageCountTextFromGlobal = () => {
  const lastPage = maxFromStringArray(Object.keys(globalPages));
  const pageCountText = window.parent.document.getElementById(
    "controlpagecounttext"
  );
  pageCountText.textContent = lastPage;
};

const fillSideBarWithBooks = () => {
  const sideBar = window.parent.document.getElementById("bookssidebar");
  const bookCase = sideBar.contentWindow.document.getElementById("bookcase");

  for (const [index, book] of BOOKS.entries()) {
    const bookLink = document.createElement("div");
    const bookTitle = document.createTextNode(`${index + 1}. ${book.title}`);
    bookLink.classList.add("book");
    let bookHover = `"${book.titleEnglish}": ${book.description}`;
    if (book.region) {
      bookHover += ` From ${book.region}.`;
    }
    bookLink.title = bookHover;
    bookLink.appendChild(bookTitle);
    bookLink.addEventListener("click", () => {
      globalCurrentBook = book;
      prepareBookDownloadOptions(book);
      const preRenderArg = { pages: {}, sentences: book.sentences };
      globalPages = preRenderPageFromSentences(preRenderArg).pages;
      globalCurrentPage = 0;
      setPageCountTextFromGlobal();
      setPageInputValueFromGlobal();
      renderPage(globalPages[globalCurrentPage]);
    });
    bookCase.appendChild(bookLink);
  }
};

const renderWelcomeMessage = () => {
  const ws = document.getElementById("workspacediv");
  // Clear the workspace before we render
  while (ws.firstChild) {
    ws.removeChild(ws.lastChild);
  }
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("welcometext");
  const message = document.createTextNode(
    "Choose a book from the sidebar to get started!"
  );
  messageDiv.appendChild(message);
  ws.appendChild(messageDiv);
};

const renderGetLostMessage = () => {
  const ws = document.getElementById("workspacediv");
  while (ws.firstChild) {
    ws.removeChild(ws.lastChild);
  }
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("welcometext");
  const message = document.createTextNode(
    "Sorry, this is not a mobile app. Get lost."
  );
  messageDiv.appendChild(message);
  messageDiv.appendChild(document.createElement("br"));

  const homeLink = document.createElement("a");
  homeLink.href = "../../index.html";
  homeLink.target = "_top";
  const linkText = document.createTextNode("OK...");
  homeLink.appendChild(linkText);
  messageDiv.style.fontSize = "48px";

  messageDiv.appendChild(homeLink);
  ws.appendChild(messageDiv);
};

const main = () => {
  if (!isMobile()) {
    addButtonEventListeners();
    addPageNumberEventListener();
    fillSideBarWithBooks();
    renderWelcomeMessage();
  } else {
    renderGetLostMessage();
  }
};

main();
