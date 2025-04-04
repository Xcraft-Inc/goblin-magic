import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c';
import MagicInput from '../magic-input/widget.js';

class MagicInplaceInputNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', ...props} = this.props;
    return (
      <MagicInput
        {...props}
        className={this.styles.classNames.inplaceInput + ' ' + className}
      />
    );
  }
}

const MagicInplaceInput = withC(MagicInplaceInputNC, {value: 'onChange'});
MagicInplaceInput.displayName = 'MagicInplaceInput';
export default MagicInplaceInput;
