import React from 'react';
import {createPortal} from 'react-dom';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import Dialog from '../dialog/widget.js';
import MagicBackground from '../magic-background/widget.js';
import MagicDiv from '../magic-div/widget.js';

export default class MagicZen extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
  }

  render() {
    if (!this.props.active) {
      return this.props.children;
    }

    const {className = ''} = this.props;

    return createPortal(
      <Dialog
        className={this.styles.classNames.zenDialog}
        modal={true}
        open
        onClose={this.props.onClose}
      >
        <MagicBackground id={'yeti'}>
          <div className={this.styles.classNames.notice}>
            Appuyez sur <span className={this.styles.classNames.key}>ESC</span>{' '}
            pour quitter le mode zen
          </div>
          <MagicDiv className={this.styles.classNames.zen + ' ' + className}>
            {this.props.children}
          </MagicDiv>
        </MagicBackground>
      </Dialog>,
      document.getElementById('root')
    );
  }
}
