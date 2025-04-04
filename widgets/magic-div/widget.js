import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';

export default class MagicDiv extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', ...props} = this.props;
    return (
      <div
        className={this.styles.classNames.div + ' ' + className}
        {...props}
      />
    );
  }
}
