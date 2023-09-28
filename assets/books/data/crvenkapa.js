import { sentenceFromObject, bookFromArray } from "./book.js";

export const CrvenkapaBook = bookFromArray(
  [
    {
      latin: "Bila jednom jedna devojčica, ljupka i mila, koja je živela s mamom u kućici pored šume.",
      english: "There was a young girl, lovely and sweet, who lived with her mother in a house next to the forest.",
    },
    {
      latin: "Zvali su je Crvenkapa, jer je stalno nosila crvenu kapicu koju joj je isplela baka.",
      english:
        "They called her Red-cap, because she constantly wore a little red cap which her grandmother knitted for her.",
    },
    { latin: "Crvenkapa je bila neobično i poslušno dete.", english: "Red-cap was no always an obedient child." },
    {
      latin: "Jednoga dana, majka je poslala Crvenkapu da odnese ručak baki koja je bila bolesna.",
      english: "One day, mother sent red-cap to bring lunch to grandma who was sick.",
    },
    {
      latin: "Pred izlazak, na vratima, začula je mamin glas.",
      english: "Before exiting, at the door, she heard her mother's voice.",
    },
    {
      latin: "Mila moja devojčice, molim te, čuvaj se dok budeš prolazila kroz šumu.",
      english: "My dear little girl, please, watch yourself while you will pass through the forest.",
    },
    {
      latin: "Hodaj pažljivo i ne skreći sa glavne staze.",
      english: "Walk carefully and don't turn from the main path.",
    },
    {
      latin: "Čuvaj se zlog vuka, i nikome ne govori đe ideš.",
      english: "Watch out for the evil wolf, and tell no-one where you're going.",
    },
  ].map((obj) => {
    return sentenceFromObject(obj);
  })
);
