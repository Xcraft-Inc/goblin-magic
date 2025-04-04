import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import Dialog from '../dialog/widget.js';
import Movable from '../movable/widget.js';
import isEmptyAreaElement from '../element-helpers/is-empty-area-element.js';

/**
 * @param {PointerEvent} event1
 * @param {PointerEvent} event2
 * @returns {number}
 */
function eventDistance(event1, event2) {
  return Math.sqrt(
    Math.pow(event2.clientX - event1.clientX, 2) +
      Math.pow(event2.clientY - event1.clientY, 2)
  );
}

class MagicDialog extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    /** @type {React.RefObject<Dialog>} */
    this.dialog = React.createRef();
  }

  componentDidMount() {
    this.updateOutsideClickHandler();
  }

  componentDidUpdate() {
    this.updateOutsideClickHandler();
  }

  componentWillUnmount() {
    this.removeOutsideClickHandler();
  }

  updateOutsideClickHandler() {
    if (!this.props.modal && this.props.onClose && this.props.open) {
      this.addOutsideClickHandler();
    } else {
      this.removeOutsideClickHandler();
    }
  }

  addOutsideClickHandler() {
    window.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointerup', this.handlePointerUp);
  }

  removeOutsideClickHandler() {
    window.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointerup', this.handlePointerUp);
  }

  handlePointerDown = (event) => {
    const {target} = event;
    const dialog = this.dialog.current?.dialog.current;
    if (dialog && !dialog.contains(target)) {
      if (isEmptyAreaElement(target)) {
        this.downEvent = event;
        return;
      }
    }
  };

  handlePointerUp = (event) => {
    if (this.downEvent) {
      const distance = eventDistance(event, this.downEvent);
      this.downEvent = null;
      if (distance < 8) {
        this.dialog.current.close();
      }
    }
  };

  handleKeyDown = (event) => {
    this.props.onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }
    if (event.key === 'Escape') {
      this.dialog.current.close();
      event.stopPropagation();
    }
  };

  render() {
    const {className = '', ...props} = this.props;
    return (
      <Movable>
        {(moveableProps) => (
          <Dialog
            {...props}
            {...moveableProps}
            onKeyDown={
              !this.props.modal && this.props.onClose
                ? this.handleKeyDown
                : undefined
            }
            ref={this.dialog}
            className={this.styles.classNames.dialog + ' ' + className}
            open={this.props.open}
            modal={this.props.modal}
            data-modal={this.props.modal || false}
            onClose={this.props.onClose}
          />
        )}
      </Movable>
    );
  }
}

export default MagicDialog;
