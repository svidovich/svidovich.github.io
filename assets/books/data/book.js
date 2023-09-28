export class Sentence {
  constructor(jugoslavian, english) {
    // Save the Jugo sentence variant and its word order
    this.jugoslavian = jugoslavian;
    this.jugoslavianOrder = new Object();
    this.jugoslavian.split(" ").forEach((word, index) => {
      this.jugoslavianOrder[index] = word;
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
  constructor(sentences) {
    // sentences: [Sentence]
    this.sentences = new Object();
    sentences.forEach((sentence, index) => {
      this.sentences[index] = sentence;
    });
  }
}

export const sentenceFromObject = (obj) => {
  return new Sentence(obj.latin, obj.english);
};

export const bookFromArray = (sentenceArray) => {
  return new Book(sentenceArray);
};
