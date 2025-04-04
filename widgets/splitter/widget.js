import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import SplitterLayout from 'react-splitter-layout';
import 'react-splitter-layout/lib/index.css';
import * as styles from './styles.js';

class Splitter extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {
      primaryMinSize,
      secondaryMinSize,
      secondaryInitialSize,
      percentage,
      vertical,
      children,
      className = '',
    } = this.props;
    return (
      <SplitterLayout
        customClassName={this.styles.classNames.splitter + ' ' + className}
        primaryMinSize={primaryMinSize}
        secondaryMinSize={secondaryMinSize}
        secondaryInitialSize={secondaryInitialSize}
        percentage={percentage}
        vertical={vertical}
      >
        {children}
      </SplitterLayout>
    );
  }
}

/******************************************************************************/

export default Splitter;
