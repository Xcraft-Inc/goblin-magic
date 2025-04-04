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
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick(value, event) {
    this.props.onTabClick?.(value, event);
  }

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
          return React.cloneElement(child, {
            'onClick': (event) =>
              (child.props.onClick || this.handleTabClick)(value, event),
            'data-active': currentTab === value,
          });
        })}
      </div>
    );
  }
}

TabLayout.Tabs = withC(TabLayoutTabs);

export default TabLayout;
