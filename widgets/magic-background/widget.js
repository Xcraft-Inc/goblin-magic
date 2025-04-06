import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';

/******************************************************************************/
export default class MagicBackground extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    return (
      <div className={this.styles.classNames.main}>
        {/* <div className={this.styles.classNames.proto}></div> */}
        {this.props.children}
      </div>
    );
  }
}
