import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c.js';

class TabLayout extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {children, className = '', ...props} = this.props;
    return (
      <div
        {...props}
        className={this.styles.classNames.tabLayout + ' ' + className}
      >
        {children}
      </div>
    );
  }
}

class TabLayoutTabs extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  handleTabClick = (value, event) => {
    this.props.onTabClick?.(value, event);
  };

  handleDragStart = (event, tabId) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', tabId);
  };

  #applySideClass = (el, side) => {
    if (!el) {
      return;
    }
    if (side === 'left') {
      el.classList.add('drop-left');
      el.classList.remove('drop-right');
    } else {
      el.classList.add('drop-right');
      el.classList.remove('drop-left');
    }
  };

  #dropClasses = (el) => {
    if (el) {
      el.classList.remove('drop-left');
      el.classList.remove('drop-right');
    }
  };

  #getSideFromEvent = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const midX = rect.left + rect.width / 2;
    return event.clientX < midX ? 'left' : 'right';
  };

  handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';

    const side = this.#getSideFromEvent(event);
    if (side) {
      this.#applySideClass(event.currentTarget, side);
    } else {
      this.#dropClasses(event.currentTarget);
    }
  };

  handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const leaveToOutside = !event.currentTarget.contains(event.relatedTarget);
    if (leaveToOutside) {
      this.#dropClasses(event.currentTarget);
    }
  };

  handleDrop = (event, targetTabId) => {
    event.preventDefault();

    const el = event.currentTarget;
    const side = this.#getSideFromEvent(event);
    this.#dropClasses(el);

    const draggedTabId = event.dataTransfer.getData('text/plain');
    if (draggedTabId && targetTabId) {
      this.props.onTabDrop?.(draggedTabId, targetTabId, side, event);
    }
  };

  handleDragEnd = (event) => {
    this.#dropClasses(event?.currentTarget);
  };

  render() {
    const {currentTab, onTabClick, onTabDrop, ...props} = this.props;
    const className = this.props.className || '';
    return (
      <div {...props} className={this.styles.classNames.tabs + ' ' + className}>
        {React.Children.map(this.props.children, (child) => {
          if (!child) {
            return child;
          }
          const value = child.props.value;
          return React.cloneElement(child, {
            'onClick': (event) =>
              (child.props.onClick || this.handleTabClick)(value, event),
            'data-active': currentTab === value,
            'draggable': true,
            'onDragStart': (e) => this.handleDragStart(e, value),
            'onDragEnter': this.handleDragEnter,
            'onDragOver': this.handleDragOver,
            'onDragLeave': this.handleDragLeave,
            'onDrop': (e) => this.handleDrop(e, value),
            'onDragEnd': this.handleDragEnd,
          });
        })}
      </div>
    );
  }
}

TabLayout.Tabs = withC(TabLayoutTabs);

export default TabLayout;
