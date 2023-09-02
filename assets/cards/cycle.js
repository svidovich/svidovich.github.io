class Node {
  constructor(value, next) {
    this.value = value;
    this.next = next;
  }
}

export class Cycle {
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
    this.current = this.current.next;
    return this.current;
  }
}
