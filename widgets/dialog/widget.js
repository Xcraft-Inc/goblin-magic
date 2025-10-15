import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import {createPortal} from 'react-dom';

export default class Dialog extends Widget {
  constructor() {
    super(...arguments);

    /** @type {React.RefObject<HTMLDialogElement>} */
    this.dialog = React.createRef();
  }

  componentDidMount() {
    this.updateToggleListener();
    this.update();
  }

  componentDidUpdate() {
    this.updateToggleListener();
    this.update();
  }

  componentWillUnmount() {
    this.removeToggleListener();
  }

  updateToggleListener() {
    // Using the `onToggle` prop on the <dialog> component does not work.
    // So we register the 'toggle' event manually.
    if (this.props.onToggle) {
      this.addToggleListener();
    } else {
      this.removeToggleListener();
    }
  }

  addToggleListener() {
    this.dialog.current?.addEventListener('toggle', this.props.onToggle);
  }

  removeToggleListener() {
    this.dialog.current?.removeEventListener('toggle', this.props.onToggle);
  }

  close = () => {
    this.dialog.current?.close();
  };

  handleClose = (event) => {
    this.props.onClose?.(event);
    event.stopPropagation();
  };

  handlePointerDown = (event) => {
    this.props.onPointerDown?.(event);
    if (event.target === this.dialog.current) {
      this.closeEnabled = true;
    } else {
      this.closeEnabled = false;
    }
  };

  handlePointerUp = (event) => {
    this.props.onPointerUp?.(event);
    if (this.closeEnabled && event.target === this.dialog.current) {
      this.dialog.current.close();
    }
    this.closeEnabled = false;
  };

  update() {
    if (this.props.open) {
      if (!this.dialog.current?.open) {
        if (this.props.modal) {
          this.dialog.current?.showModal();
        } else {
          this.dialog.current?.show();
        }
      }
    } else {
      this.dialog.current?.close();
    }
  }

  render() {
    const {open, modal, portal = false, onToggle, ...props} = this.props;
    const dialog = (
      <dialog
        {...props}
        ref={this.dialog}
        onClose={this.handleClose}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      />
    );

    if (portal) {
      return createPortal(dialog, document.getElementById('root'));
    }
    return dialog;
  }
}
