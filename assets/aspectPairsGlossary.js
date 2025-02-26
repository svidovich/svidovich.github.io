const searchBox = document.getElementById("aspect-lookup-box");
const allAspectRows = document.getElementsByClassName("aspectpairsrow");

const aspectTable = document.getElementById("aspect-pairs-table");
const aspectHeaderRow = document.getElementById("aspect-pairs-header-row");
// For fast-replenish when search fails.
const aspectTableCopy = aspectTable.cloneNode(true);
aspectTableCopy.id = "tablecopy";

// A set of lookup tables, one for each column of the table on the page
const englishLookup = {};
const impfLookup = {};
const impfConjLookup = {};
const pfLookup = {};
const pfConjLookup = {};

// For ez iteration :)
const allLookupTables = [
  englishLookup,
  impfLookup,
  impfConjLookup,
  pfLookup,
  pfConjLookup,
];

const clearAspectPairsTable = () => {
  // Dump everything from the aspect pairs table.
  while (aspectTable.lastChild) {
    aspectTable.removeChild(aspectTable.firstChild);
  }
};

const addWordToLookup = (word, element, lookupTable) => {
  // Add a word to a given lookup table, mapped to its corresponding element.
  // Start at the level of the raw lookup table.
  let lastLookup = lookupTable;
  for (let i = 0; i < word.length; i++) {
    // For every character in the word,
    const charAtIdx = word[i];
    // If we haven't seen it in this level of the lookup,
    // we should add an object for it.
    if (!(charAtIdx in lastLookup)) {
      lastLookup[charAtIdx] = {};
    }
    if (i === word.length - 1) {
      // If this is the last letter, put the element at this index.
      // We've hit the very bottom.
      lastLookup[charAtIdx] = element;
      // Otherwise, we should store the current letter at this layer,
      // and continue.
    } else {
      lastLookup = lastLookup[charAtIdx];
    }
  }
};

// A recursive generator. Beware.
function* recurseLookupBranch(searchPrefix, branch) {
  // Given a branch of a lookup table along with a search prefix, recurse
  // all the way down all of the lookup table's branches, eventually coming
  // up with a suffix formed of all of the keys we saw along the way along
  // with the element at the very bottom of the branch.
  searchPrefix = searchPrefix || "";
  // You can't use forEach here because it becomes its own,
  // non-generator function. You need to use a for loop so
  // that we're still in a generative execution context.
  for (const [key, value] of Object.entries(branch)) {
    const nextSearchPrefix = searchPrefix + key;
    if (value instanceof Element) {
      yield [nextSearchPrefix, value];
    }
    // yield* here ensures that this recursive call will
    // yield values up the stack
    yield* recurseLookupBranch(nextSearchPrefix, value);
  }
}

const searchLookupTable = (lookupTable, term) => {
  // Search the targeted lookup table for the input term. If we find it, return an
  // array of objects of the form
  /*
    {
        resultText: <the full matched string>,
        resultElement: <the <tr> in the table that was matched>
    }
  */
  let lastLookup = lookupTable;
  let branch;
  for (let i = 0; i < term.length; i++) {
    const charAtIdx = term[i];
    branch = lastLookup[charAtIdx];
    // If we didn't manage to find a branch with this letter at this depth,
    // it means that we've got a term with no results. Return an empty array.
    if (branch === undefined) {
      return [];
    }
    lastLookup = branch;
  }

  // Now for the good part. We've reached the end, and whatever's in `branch`
  // is our set of search results. We should recurse them downward, getting an
  // array of maps that contain the text of the element along with the element
  // itself for rendering.
  const results = [];
  // If we get back an element, it means that we submitted the entire word for
  // matching and bottomed out the search tree. Just push it to the results.
  if (branch instanceof Element) {
    results.push({
      resultText: term,
      resultElement: branch,
    });
  } else {
    // Otherwise, we should recurse down the search tree and form up results based
    // on the suffixes that we construct along the way.
    for (const [suffix, element] of recurseLookupBranch(null, branch)) {
      results.push({
        resultText: term + suffix,
        resultElement: element,
      });
    }
  }

  return results;
};

const searchManyLookupTables = (lookupTables, term) => {
  // Search the array lookupTables of lookup tables for the input term,
  // returning the results from each in a flat, unified array.
  let results = [];
  lookupTables.forEach((table) => {
    results = [...results, ...searchLookupTable(table, term)];
  });
  return results;
};

// Sauce up all of the lookup tables with all of the words from the aspect table
// rows so that users can search through the page for the word they want.
Array.from(allAspectRows).forEach((row) => {
  const [english, imperfect, impfConj, perfect, pfConj] = Array.from(
    row.children
  );

  for (const [element, table] of [
    [english, englishLookup],
    [imperfect, impfLookup],
    [impfConj, impfConjLookup],
    [perfect, pfLookup],
    [pfConj, pfConjLookup],
  ]) {
    addWordToLookup(element.textContent.trim(), row, table);
  }
});

// The search box!
searchBox.addEventListener("input", (event_) => {
  const searchValue = searchBox.value;
  // If we don't have empty string, we have something to look for.
  if (searchBox.value !== "") {
    // Look in all of the tables for the term,
    const searchResults = searchManyLookupTables(allLookupTables, searchValue);
    // and form up a set so we can deduplicate results.
    const resultElements = new Set();
    // Put every matching <tr> into the set,
    searchResults.forEach((result) => {
      resultElements.add(result.resultElement);
    });
    // And then cast back to an array, so that we can iterate them.
    const resultElementsArray = [...resultElements];
    // Drop everything from the aspect pairs table,
    clearAspectPairsTable();
    // And after we add back the header,
    aspectTable.appendChild(aspectHeaderRow);
    // Put each of the matching <tr>s into the table.
    resultElementsArray.forEach((element) => {
      aspectTable.appendChild(element);
    });
  } else {
    // If we _do_ have an empty string search term, we should reset the table.
    // So clear it.
    clearAspectPairsTable();
    // Now -- clone each child of our clone. This avoids goofy cross-memory errors.
    // If we don't do it this way, and instead just use a replaceChildren call with
    // the children of our clone, our clearAspectPairsTable will accidentally pick
    // up references to our clone, and clear the clone out, rendering it useless.
    Array.from(aspectTableCopy.children).forEach((element) => {
      aspectTable.appendChild(element.cloneNode(true));
    });
  }
});
