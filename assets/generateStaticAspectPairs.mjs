#!/usr/bin/js
// "This is the most ghetto shit I've ever seen." -Tupac
// This is a static generator for the aspect pairs lookup so I can have the table statically
// defined from the data and milk that sweet, sweet SSO.
// Run it with node. Should 'just work'!
// You might run: ./generateStaticAspectPairs.mjs 2&> aspectPairsGlossary.html
import aspectPairData from "./aspectpairsdata.mjs";

const templateTop = `
<html>
  <head>
    <link rel="stylesheet" type="text/css" href="books/books.css" />
    <title>Aspect Pairs Lookup: BCMS ... by Sam Vidovich</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta content="utf-8" http-equiv="encoding" />
    <meta
      name="description"
      content="Aspect pair lookup table for Bosnian, Croatian, Macedonian, and Serbian."
    />
    <meta
      property="og:title"
      name="title"
      content="BCMS Aspect Pairs Lookup Table"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Arvo&display=swap"
      rel="stylesheet"
    />
    <link rel="icon" href="../media/favicon.png" />
    <link rel="stylesheet" type="text/css" href="../style.css" />
  </head>
  <body>
  <a href="../index.html"><<< Home</a>
  <h3>
    BCMS Aspect Pair Lookup Table
  </h3>
  <p>
  Finding a chart of the aspect pairs in this language is going to give me a coronary. Here's one for you!
  </p>
  <div>
    <input placeholder="Search for an aspect pair ..." type="search" id="aspect-lookup-box">
  </div>
  <br/>
  <table id="aspect-pairs-table" style="text-align: center">
    <tr id="aspect-pairs-header-row">
      <th>
       English
      </th>
      <th>
       Imperfect
      </th>
      <th>
       Imperfect Conjugation
      </th>
      <th>
       Perfect
      </th>
      <th>
       Perfect Conjugation
      </th>
    </tr>
`;

const templateBottom = `
  </table>
  </body>
  <script src="./aspectPairsGlossary.js" type="module"></script>
</html>
`;

const main = () => {
  let tableBodyTpl = ``;
  aspectPairData.forEach((pairData) => {
    const tplForPair = `<tr class="aspectpairsrow">
        <td>
         ${pairData.english_infinitive_pf}
        </td>
        <td>
         ${pairData.imperfect}
        </td>
        <td>
         ${pairData.impf_conjugation_hint}
        </td>
        <td>
         ${pairData.perfect}
        </td>
        <td>
         ${pairData.pf_conjugation_hint}
        </td>
      </tr>`;
    tableBodyTpl += tplForPair;
  });
  console.log(templateTop);
  console.log(tableBodyTpl);
  console.log(templateBottom);
};

main();
