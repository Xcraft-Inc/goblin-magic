import elementHasDirectText from './element-has-direct-text.js';
import isFlatElement from './is-flat-element.js';

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} [stopAtElement]
 * @returns {boolean}
 */
export default function isEmptyAreaElement(element, stopAtElement) {
  for (let e = element; e && e !== stopAtElement; e = e.parentElement) {
    if (!isFlatElement(e) || elementHasDirectText(e)) {
      // console.log(e);
      return false;
    }
  }
  return true;
}
