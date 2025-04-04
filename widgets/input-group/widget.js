import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';

class InputGroup extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', children, ...props} = this.props;
    return (
      <div
        {...props}
        className={this.styles.classNames.inputGroup + ' ' + className}
      >
        {children}
      </div>
    );
  }
}

export default InputGroup;
