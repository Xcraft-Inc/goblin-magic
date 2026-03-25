import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import Icon from '@mdi/react';

class InlineIcon extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', ...props} = this.props;
    return (
      <span className={this.styles.classNames.inlineIcon + ' ' + className}>
        <Icon {...props} className={this.styles.classNames.icon} />
      </span>
    );
  }
}

export default InlineIcon;
