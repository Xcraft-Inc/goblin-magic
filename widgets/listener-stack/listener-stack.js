// @ts-check

export default class ListenerStack {
  /** @type {Map<string,Function[]>} */
  stacks = new Map();

  /**
   * @param {string} type
   * @returns {Function[]}
   */
  getStack(type) {
    let stack = this.stacks.get(type);
    if (!stack) {
      stack = [];
      this.stacks.set(type, stack);
    }
    return stack;
  }

  /**
   * @param {Event} event
   */
  handleEvent = (event) => {
    const stack = this.getStack(event.type);
    const last = stack.at(-1);
    if (!last) {
      throw new Error('Empty stack');
    }
    last(event);
  };

  /**
   * @template {keyof WindowEventMap} T
   * @param {T} type
   * @param {(event: WindowEventMap[T]) => any} listener
   */
  push(type, listener) {
    const stack = this.getStack(type);
    stack.push(listener);
    if (stack.length === 1) {
      window.addEventListener(type, this.handleEvent);
    }
  }

  /**
   * @template {keyof WindowEventMap} T
   * @param {T} type
   * @param {(event: WindowEventMap[T]) => any} listener
   */
  pop(type, listener) {
    const stack = this.getStack(type);
    const index = stack.indexOf(listener);
    if (index === -1) {
      // console.error(`Unknown listener for type ${type}`);
      return;
    }
    stack.splice(index, 1);
    if (stack.length === 0) {
      window.removeEventListener(type, this.handleEvent);
    }
  }
}
