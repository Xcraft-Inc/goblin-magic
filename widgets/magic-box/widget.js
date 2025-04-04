import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import MagicDiv from '../magic-div/widget.js';
import MagicScroll from '../magic-scroll/widget.js';

class MagicBox extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    const {className = '', children, ...props} = this.props;
    return (
      <MagicDiv
        {...props}
        className={this.styles.classNames.magicBox + ' ' + className}
      >
        <MagicScroll>{children}</MagicScroll>
      </MagicDiv>
    );
  }
}

/******************************************************************************/

export default MagicBox;
