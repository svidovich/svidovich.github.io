class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

export class Cycle {
  #head = null;
  #current = null;

  constructor(values = []) {
    if (!Array.isArray(values) || values.length === 0) {
      throw new Error("Cycle must be initialized with at least one value.");
    }

    let prevNode = null;
    for (const value of values) {
      const newNode = new Node(value);
      if (!this.#head) {
        this.#head = newNode;
      } else {
        prevNode.next = newNode;
      }
      prevNode = newNode;
    }

    // Close the cycle
    prevNode.next = this.#head;
    this.#current = this.#head;
  }

  next() {
    const value = this.#current.value;
    this.#current = this.#current.next;
    return value;
  }

  peek() {
    return this.#current.value;
  }

  reset() {
    this.#current = this.#head;
  }

  toArray(limit = 1000) {
    const result = [];
    let node = this.#head;
    let count = 0;

    do {
      result.push(node.value);
      node = node.next;
      count++;
    } while (node !== this.#head && count < limit);

    return result;
  }
}
