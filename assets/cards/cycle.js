class Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

export class Cycle {
  // NOTE: This cycle is a piece of garbage. It is read-only after construction
  // right now because I didn't want to deal with any complex logic. Use at your
  // own risk, or improve it.
  constructor(nodes) {
    for (const [index, node] of nodes.entries()) {
      const inserted = this.insert(node);
      if (index === nodes.length - 1) {
        inserted.next = this.head;
      }
    }
    this.current = this.head;
  }

  insert(newNode) {
    if (this.head === undefined) {
      this.head = new Node(newNode, undefined);
      return;
    }
    let currentNode = this.head;
    while (true) {
      if (currentNode.next === undefined) {
        const insertedNode = new Node(newNode, undefined);
        currentNode.next = insertedNode;
        return insertedNode;
      } else {
        currentNode = currentNode.next;
      }
    }
  }
  get next() {
    // NOTE This implicitly modifies the cycle's
    // state. This should probably be a method
    // instead of a property to make that more
    // obvious to consumers of its API
    this.current = this.current.next;
    return this.current;
  }
}
