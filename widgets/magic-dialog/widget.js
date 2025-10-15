import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import Movable from '../movable/widget.js';
import isEmptyAreaElement from '../element-helpers/is-empty-area-element.js';
import CancelableDialog from '../cancelable-dialog/widget.js';

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
    /** @type {React.RefObject<CancelableDialog>} */
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
    const dialog = this.dialog.current?.dialogElement;
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

  render() {
    const {className = '', ...props} = this.props;
    return (
      <Movable>
        {(moveableProps) => (
          <CancelableDialog
            {...props}
            {...moveableProps}
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
