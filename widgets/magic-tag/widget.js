import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c.js';

let MagicTag = class extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {disabled, onClick, className = '', children, ...props} = this.props;
    return (
      <span
        {...props}
        disabled={disabled}
        className={this.styles.classNames.tag + ' ' + className}
        onClick={!disabled ? onClick : undefined}
        data-has-click={Boolean(onClick)}
      >
        {children}
      </span>
    );
  }
};

/******************************************************************************/

MagicTag = withC(MagicTag);

export default MagicTag;
