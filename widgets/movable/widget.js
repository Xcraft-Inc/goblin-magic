import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget/index.js';
import isEmptyAreaElement from '../element-helpers/is-empty-area-element.js';

class Movable extends Widget {
  constructor() {
    super(...arguments);
    this.currentTranslate = {x: 0, y: 0};
    /** @type {HTMLElement | null} */
    this.element = null;
  }

  /**
   * @param {PointerEvent} event
   */
  handlePointerMove = (event) => {
    const elementRect = this.element.getBoundingClientRect();
    let x = event.clientX - this.pointerDiff.x - this.elementStart.x;
    let y = event.clientY - this.pointerDiff.y - this.elementStart.y;
    const maxX = window.innerWidth - elementRect.width - this.elementStart.x;
    if (x > maxX) {
      x = maxX;
    }
    const minX = -this.elementStart.x;
    if (x < minX) {
      x = minX;
    }
    const maxY = window.innerHeight - elementRect.height - this.elementStart.y;
    if (y > maxY) {
      y = maxY;
    }
    const minY = -this.elementStart.y;
    if (y < minY) {
      y = minY;
    }
    this.element.style.transform = `translate(${Math.round(x)}px, ${Math.round(
      y
    )}px)`;
    this.currentTranslate = {x, y};
  };

  /**
   * @param {PointerEvent} event
   */
  handlePointerDown = (event) => {
    this.element = event.currentTarget;
    if (
      this.element !== event.target &&
      this.element.contains(event.target) &&
      isEmptyAreaElement(event.target, this.element)
    ) {
      const elementRect = this.element.getBoundingClientRect();
      this.elementStart = {
        x: elementRect.x - this.currentTranslate.x,
        y: elementRect.y - this.currentTranslate.y,
      };
      this.pointerDiff = {
        x: event.clientX - elementRect.x,
        y: event.clientY - elementRect.y,
      };
      window.addEventListener('pointermove', this.handlePointerMove);
      window.addEventListener(
        'pointerup',
        () => {
          document.body.style.cursor = 'auto';
          window.removeEventListener('pointermove', this.handlePointerMove);
        },
        {once: true}
      );
      document.body.style.cursor = 'grabbing';
    }
  };

  render() {
    return this.props.children({
      onPointerDown: this.handlePointerDown,
    });
  }
}

export default Movable;
