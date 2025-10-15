import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import Dialog from '../dialog/widget.js';

export default class MenuDialog extends Widget {
  constructor() {
    super(...arguments);
    /** @type {React.RefObject<Dialog>} */
    this.dialog = React.createRef();
    this.closeEnabled = false;
  }

  get dialogElement() {
    return this.dialog.current.dialog.current;
  }

  close = () => {
    this.dialog.current?.close();
  };

  handlePointerDown = (event) => {
    this.props.onPointerDown?.(event);
    if (event.target === this.dialogElement) {
      this.closeEnabled = true;
    } else {
      this.closeEnabled = false;
    }
  };

  handlePointerUp = (event) => {
    this.props.onPointerUp?.(event);
    if (this.closeEnabled && event.target === this.dialogElement) {
      this.dialog.current.close();
    }
    this.closeEnabled = false;
  };

  render() {
    const {onCancel, ...props} = this.props;
    return (
      <Dialog
        closedby="any"
        // Even with closedby="any", the dialog is not closed by clicking on the backdrop.
        // So we add custom pointerDown and pointerUp handlers.
        {...props}
        ref={this.dialog}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      />
    );
  }
}
