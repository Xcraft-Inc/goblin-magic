const nonInteractiveTags = [
  'ARTICLE',
  'ASIDE',
  'BODY',
  'DIV',
  'FOOTER',
  'HEADER',
  'HGROUP',
  'HTML',
  'MAIN',
  'NAV',
  'SECTION',
];

const interactiveRoles = [
  'button',
  'checkbox',
  'grid',
  'input',
  'menu',
  'option',
  'radio',
  'slider',
  'spinbutton',
  'switch',
  'table',
  'tree',
  'treegrid',
  'widget',
  // More roles could be added
  // see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles
];

/**
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function hasInteractiveRole(element) {
  return element.role
    ?.split(' ')
    .some((role) => interactiveRoles.includes(role));
}

/**
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export default function isFlatElement(element) {
  return (
    nonInteractiveTags.includes(element.tagName) && !hasInteractiveRole(element)
  );
}
