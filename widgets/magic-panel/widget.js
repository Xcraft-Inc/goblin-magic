import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import MagicButton from '../magic-button/widget.js';
import MagicDiv from '../magic-div/widget.js';
import Icon from '@mdi/react';
import {mdiClose} from '@mdi/js';

class MagicPanel extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.state = {
      hidden: true,
    };
    this.togglePanel = this.togglePanel.bind(this);
  }

  componentDidMount() {
    // Mousetrap.bind('ctrl+space', this.togglePanel);
  }

  togglePanel() {
    this.setState({hidden: !this.state.hidden});
  }

  render() {
    const classState = this.state.hidden ? 'hidden' : 'show';
    return (
      <>
        <div className={this.styles.classNames.action}>
          <MagicButton onClick={this.togglePanel}>
            Menu{' '}
            <span className={this.styles.classNames.shortcut}>
              (ctrl+space)
            </span>
          </MagicButton>
        </div>
        <MagicDiv className={this.styles.classNames[classState]}>
          <div
            className={
              classState === 'hidden'
                ? this.styles.classNames.hiddenContent
                : this.styles.classNames.content
            }
          >
            <div
              className={this.styles.classNames.closeButton}
              onClick={this.togglePanel}
            >
              <Icon path={mdiClose} />
            </div>
            {this.props.children}
          </div>
        </MagicDiv>
      </>
    );
  }
}

/******************************************************************************/

export default MagicPanel;
