import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';

let elements = [];

function isLastElement(element) {
  if (elements.length === 0) {
    return false;
  }
  return elements[elements.length - 1] === element;
}

class DialogButtons extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;

    /** @type {React.RefObject<HTMLDivElement>} */
    this.element = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    elements.push(this.element);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    elements = elements.filter((element) => element !== this.element);
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyDown = (event) => {
    // Do action only on the latest mounted DialogButtons element
    if (!isLastElement(this.element)) {
      return;
    }
    if (event.key === 'Enter' && event.target.tagName !== 'BUTTON') {
      const elements = this.element.current.getElementsByClassName('main');
      if (elements.length > 0) {
        const mainButton = elements[0];
        mainButton.click();
      }
    }
  };

  render() {
    const {className = '', mainButtonPosition, ...props} = this.props;
    const reverse =
      mainButtonPosition === 'left' ||
      navigator.userAgent.toLowerCase().includes('windows');
    return (
      <div
        {...props}
        className={this.styles.classNames.dialogButtons + ' ' + className}
        data-reverse={reverse}
        tabIndex={-1}
        ref={this.element}
      >
        {this.props.children}
      </div>
    );
  }
}

DialogButtons.Spacing = class DialogButtonsSpacing extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', ...props} = this.props;
    return (
      <div
        {...props}
        className={
          this.styles.classNames.dialogButtonsSpacing + ' ' + className
        }
      >
        {this.props.children}
      </div>
    );
  }
};

export default DialogButtons;
