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

  handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const enterFromOutside = !event.currentTarget.contains(event.relatedTarget);
    if (enterFromOutside) {
      event.currentTarget.classList.add('drop-hover');
    }
  };

  handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const leaveToOutside = !event.currentTarget.contains(event.relatedTarget);
    if (leaveToOutside) {
      event.currentTarget.classList.remove('drop-hover');
    }
  };

  handleDrop = (event, targetTabId) => {
    event.preventDefault();

    event.currentTarget.classList.remove('drop-hover');

    const draggedTabId = event.dataTransfer.getData('text/plain');
    if (!draggedTabId || !targetTabId) {
      return;
    }

    this.props.onTabDrop?.(draggedTabId, targetTabId, event);
  };

  handleDragEnd = () => {};

  render() {
    const {currentTab, onTabClick, ...props} = this.props;
    const className = this.props.className || '';
    return (
      <div {...props} className={this.styles.classNames.tabs + ' ' + className}>
        {React.Children.map(this.props.children, (child) => {
          if (!child) {
            return child;
          }
          const value = child.props.value;
          const onDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'move';
          };
          return React.cloneElement(child, {
            'onClick': (event) =>
              (child.props.onClick || this.handleTabClick)(value, event),
            'data-active': currentTab === value,
            'draggable': true,
            'onDragStart': (e) => this.handleDragStart(e, value),
            'onDragEnter': this.handleDragEnter,
            'onDragLeave': this.handleDragLeave,
            'onDragOver': onDragOver,
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
