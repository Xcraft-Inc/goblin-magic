import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import ListenerStack from '../listener-stack/listener-stack.js';

const listenerStack = new ListenerStack();

export default class Popover extends Widget {
  constructor() {
    super(...arguments);

    /** @type {React.RefObject<HTMLElement>} */
    this.popover = React.createRef();
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
    // Using the `onToggle` prop on the component does not work.
    // So we register the 'toggle' event manually.
    if (this.props.onToggle) {
      this.addToggleListener();
    } else {
      this.removeToggleListener();
    }
  }

  addToggleListener() {
    this.popover.current?.addEventListener('toggle', this.props.onToggle);
  }

  removeToggleListener() {
    this.popover.current?.removeEventListener('toggle', this.props.onToggle);
  }

  update() {
    const {open, source, style} = this.props;
    if (open) {
      let options;
      if (source) {
        options = {source};
      }
      if (style?.positionAnchor) {
        const anchorName = style?.positionAnchor;
        const source = document.querySelector(
          `[data-anchor-name="${anchorName}"`
        );
        if (source) {
          options = {source};
        }
      }
      this.popover.current?.showPopover(source ? {source} : undefined);
      // Do action only on the latest opened popover
      listenerStack.push('keydown', this.handleKeyDown);
    } else {
      listenerStack.pop('keydown', this.handleKeyDown);
      this.popover.current?.hidePopover();
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleKeyDown = (event) => {
    if (event.defaultPrevented) {
      return;
    }
    if (event.key === 'Escape') {
      this.popover.current?.hidePopover();
    }
  };

  render() {
    const {
      Component = 'div',
      popover = 'manual',
      source,
      open,
      onToggle,
      ...props
    } = this.props;
    return <Component {...props} ref={this.popover} popover={popover} />;
  }
}
