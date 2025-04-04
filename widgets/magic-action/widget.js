import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';
import withC from 'goblin-laboratory/widgets/connect-helpers/with-c.js';

class MagicActionNC extends Widget {
  constructor() {
    super(...arguments);
    this.styles = styles;
    this.doCmd = this.doCmd.bind(this);
  }

  doCmd() {
    let [serviceId, action] = this.props.cmd.split('.');
    this.doFor(serviceId, action, this.props.arguments || {});
  }

  togglePanel() {
    this.setState({hidden: !this.state.hidden});
  }

  render() {
    const {disabled} = this.props;

    const baseProps = {};
    if (!disabled) {
      baseProps.onClick = this.props.onClick || this.doCmd;
    }

    return (
      <div>
        <span className={this.styles.classNames.action} {...baseProps}>
          <span className={this.styles.classNames.text}>{this.props.text}</span>
        </span>
      </div>
    );
  }
}

/******************************************************************************/

const MagicAction = withC(MagicActionNC);

export default MagicAction;
