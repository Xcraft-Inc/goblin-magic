import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import Dialog from '../dialog/widget.js';
import ListenerStack from '../listener-stack/listener-stack.js';

const listenerStack = new ListenerStack();

/**
 * Dialog with custom event handling.
 *
 * When an html dialog with closedby="any" or closedby="closerequest" is closed using ESC,
 * it's not always possible to cancel the 'cancel' event. See https://issues.chromium.org/issues/351867704.
 * This component provides a dialog where the 'cancel' event can be canceled.
 */
export default class CancelableDialog extends Widget {
  constructor() {
    super(...arguments);
    /** @type {React.RefObject<Dialog>} */
    this.dialog = React.createRef();
    this.closeEnabled = false;
  }

  get dialogElement() {
    return this.dialog.current.dialog.current;
  }

  componentDidMount() {
    this.updateEscHandler();
  }

  componentDidUpdate() {
    this.updateEscHandler();
  }

  componentWillUnmount() {
    this.removeEscHandler();
  }

  updateEscHandler() {
    if (this.props.open) {
      this.addEscHandler();
    } else {
      this.removeEscHandler();
    }
  }

  addEscHandler() {
    // Do action only on the latest opened dialog
    listenerStack.push('keydown', this.handleKeyDown);
  }

  removeEscHandler() {
    listenerStack.pop('keydown', this.handleKeyDown);
  }

  close = () => {
    this.dialog.current?.close();
  };

  cancel = (reason) => {
    const event = new CustomEvent('cancel', {
      detail: {reason},
      cancelable: true,
    });
    this.props.onCancel?.(event);
    if (!event.defaultPrevented) {
      this.dialog.current.close();
    }
  };

  handlePointerDown = (event) => {
    this.props.onPointerDown?.(event);
    if (event.target === this.dialogElement) {
      this.closeEnabled = true;
    } else {
      this.closeEnabled = false;
    }
  };

  /**
   * @param {PointerEvent} event
   */
  handlePointerUp = (event) => {
    this.props.onPointerUp?.(event);
    if (this.closeEnabled && event.target === this.dialogElement) {
      this.cancel('outside-click');
      event.stopPropagation();
    }
    this.closeEnabled = false;
  };

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyDown = (event) => {
    if (event.defaultPrevented) {
      return;
    }
    if (event.key === 'Escape') {
      this.cancel('escape-key');
    }
  };

  render() {
    const {onCancel, ...props} = this.props;
    return (
      <Dialog
        closedby="none"
        {...props}
        ref={this.dialog}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      />
    );
  }
}
