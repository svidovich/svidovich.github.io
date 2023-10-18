import { sentenceFromObject, bookFromArray } from "./book.js";

export const CrvenkapaBook = bookFromArray(
  "Crvenkapa",
  "Red Riding Hood",
  null,
  "The story of a girl who learns her lesson about listening to her elders and talking to strangers.",
  [
    {
      latin:
        "Bila jednom jedna devojčica, ljupka i mila, koja je živela s mamom u kućici pored šume.",
      english:
        "There was a young girl, lovely and sweet, who lived with her mother in a house next to the forest.",
    },
    {
      latin:
        "Zvali su je Crvenkapa, jer je stalno nosila crvenu kapicu koju joj je isplela baka.",
      english:
        "They called her red riding hood, because she constantly wore a little red cap which her grandmother knitted for her.",
    },
    {
      latin: "Crvenkapa je bila neobično i poslušno dete.",
      english: "red riding hood was not always an obedient child.",
    },
    {
      latin:
        "Jednoga dana, majka je poslala Crvenkapu da odnese ručak baki koja je bila bolesna.",
      english:
        "One day, mother sent red riding hood to bring lunch to grandma who was sick.",
    },
    {
      latin: "Pred izlazak, na vratima, začula je mamin glas.",
      english: "Before exiting, at the door, she heard her mother's voice.",
    },
    {
      latin:
        "Mila moja devojčice, molim te, čuvaj se dok budeš prolazila kroz šumu.",
      english:
        "My dear little girl, please, watch yourself while you will pass through the forest.",
    },
    {
      latin: "Hodaj pažljivo i ne skreći sa glavne staze.",
      english: "Walk carefully and don't turn from the main path.",
    },
    {
      latin: "Čuvaj se zlog vuka, i nikome ne govori đe ideš.",
      english:
        "Watch out for the evil wolf, and tell no-one where you're going.",
    },
    {
      latin: "Extra 1",
      english: "Extra 1",
    },
    {
      latin: "Extra 2",
      english: "Extra 2",
    },
    {
      latin: "Extra 3",
      english: "Extra 3",
    },
    {
      latin: "Extra 4",
      english: "Extra 4",
    },
    {
      latin: "Extra 5",
      english: "Extra 5",
    },
    {
      latin: "Extra 6",
      english: "Extra 6",
    },
    {
      latin: "Extra 7",
      english: "Extra 7",
    },
    {
      latin: "Extra 8",
      english: "Extra 8",
    },
    {
      latin: "Extra 9",
      english: "Extra 9",
    },
    {
      latin: "Extra 10",
      english: "Extra 10",
    },
    {
      latin: "Extra 11",
      english: "Extra 11",
    },
    {
      latin: "Extra 12",
      english: "Extra 12",
    },
    {
      latin: "Extra 13",
      english: "Extra 13",
    },
    {
      latin: "Extra 14",
      english: "Extra 14",
    },
    {
      latin: "Extra 15",
      english: "Extra 15",
    },
    {
      latin: "Extra 16",
      english: "Extra 16",
    },
  ].map((obj) => {
    return sentenceFromObject(obj);
  })
);
