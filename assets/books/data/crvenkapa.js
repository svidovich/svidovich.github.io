import { Book, Sentence } from "./book.js";

const CrvenkapaSentences = [
  new Sentence(
    "Bila jednom jedna devojčica, ljupka i mila, koja je živela s mamom u kućici pored šume.",
    "There was a young girl, lovely and sweet, who lived with her mother in a house next to the forest."
  ),
  new Sentence(
    "Zvali su je Crvenkapa, jer je stalno nosila crvenu kapicu koju joj je isplela baka.",
    "They called her Red-cap, because she constantly wore a little red cap which her grandmother knitted for her."
  ),
  new Sentence("Crvenkapa je bila neobično i poslušno dete.", "Red-cap was no always an obedient child."),
  new Sentence(
    "Jednoga dana, majka je poslala Crvenkapu da odnese ručak baki koja je bila bolesna.",
    "One day, mother sent red-cap to bring lunch to grandma who was sick."
  ),
  new Sentence(
    "Pred izlazak, na vratima, začula je mamin glas.",
    "Before exiting, at the door, she heard her mother's voice."
  ),
  new Sentence(
    "Mila moja devojčice, molim te, čuvaj se dok budeš prolazila kroz šumu.",
    "My dear little girl, please, watch yourself while you will pass through the forest."
  ),
  new Sentence("Hodaj pažljivo i ne skreći sa glavne staze.", "Walk carefully and don't turn from the main path."),
  new Sentence(
    "Čuvaj se zlog vuka, i nikome ne govori đe ideš.",
    "Watch out for the evil wolf, and tell no-one where you're going."
  ),
];

export const CrvenkapaBook = new Book(CrvenkapaSentences);
