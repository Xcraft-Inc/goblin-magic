import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import MagicAction from '../magic-action/widget.js';
import * as styles from './styles.js';

class MagicBoxOld extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    return (
      <div className={this.styles.classNames.main}>
        {this.props.closable ? (
          <div className={this.styles.classNames.close}>
            <MagicAction onClick={this.props.onClose} text="fermer" />
          </div>
        ) : null}
        <div className={this.styles.classNames.content}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

/******************************************************************************/

export default MagicBoxOld;
