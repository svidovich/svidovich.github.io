export class Sentence {
  constructor(latin, english) {
    // Save the Jugo sentence variant and its word order
    this.latin = latin;
    this.latinOrder = new Object();
    this.latin.split(" ").forEach((word, index) => {
      this.latinOrder[index] = word;
    });

    // Save the English sentence variant and its word order
    this.english = english;
    this.englishOrder = new Object();
    this.english.split(" ").forEach((word, index) => {
      this.englishOrder[index] = word;
    });
  }
}

export class Book {
  constructor(
    title,
    titleEnglish,
    region,
    description,
    parentText,
    isPoem,
    sentences
  ) {
    // sentences: [Sentence]
    this.title = title;
    this.titleEnglish = titleEnglish;
    this.region = region;
    this.description = description;
    this.parentText = parentText;
    this.isPoem = isPoem;
    this.sentences = new Object();
    sentences.forEach((sentence, index) => {
      this.sentences[index] = sentence;
    });
  }
}

export const sentenceFromObject = (obj) => {
  return new Sentence(obj.latin, obj.english);
};

export const bookFromArray = (
  title,
  titleEnglish,
  region,
  description,
  parentText,
  isPoem,
  sentenceArray
) => {
  return new Book(
    title,
    titleEnglish,
    region,
    description,
    parentText,
    isPoem,
    sentenceArray
  );
};
