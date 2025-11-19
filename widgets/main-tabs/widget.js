import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import TabLayout from '../tab-layout/widget.js';

class MainTabs extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', ...props} = this.props;
    return (
      <TabLayout.Tabs
        {...props}
        className={this.styles.classNames.mainTabs + ' ' + className}
        dragGroup="main-tabs"
      ></TabLayout.Tabs>
    );
  }
}

export default MainTabs;
