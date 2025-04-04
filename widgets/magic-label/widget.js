import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';

class MagicLabel extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const className = this.props.className || '';
    return (
      <label
        {...this.props}
        className={this.styles.classNames.label + ' ' + className}
      >
        {this.props.children}
      </label>
    );
  }
}

export default MagicLabel;
