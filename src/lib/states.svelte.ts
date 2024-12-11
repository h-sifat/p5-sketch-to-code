import { Commands, type Shapes } from "./interface";

export class ShapeStore {
  // @ts-ignore
  #shapes: Shapes[] = $state([]);
  // @ts-ignore
  #redoQueue: Shapes[] = $state([]);

  add(shape: Shapes) {
    this.#shapes.push(shape);
    if (this.#redoQueue.length) this.#redoQueue = [];
  }

  [Commands.UNDO]() {
    if (this.#shapes.length) {
      this.#redoQueue.push(this.#shapes.pop()!);
    }
  }

  [Commands.REDO]() {
    if (this.#redoQueue.length) this.#shapes.push(this.#redoQueue.pop()!);
  }

  get array(): Readonly<Shapes[]> {
    return this.#shapes;
  }
}
