/**
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export default function elementHasDirectText(element) {
  return [...element.childNodes].some(
    (node) => node instanceof Text && node.textContent.trim() !== ''
  );
}
