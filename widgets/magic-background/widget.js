import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget';
import * as styles from './styles.js';

/******************************************************************************/
class MagicBackground extends Widget {
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

export default Widget.connect((state, props) => {
  const userUid = state.get('backend.yeti.userId');
  const userId = `user@${userUid}`;
  const userState = state.get('backend').get(userId);
  if (!userState) {
    return {useBackgroundColor: false};
  }
  const useBackgroundColor = userState.get('useBackgroundColor', false);
  const backgroundColor = userState.get('backgroundColor', '#15203c');
  return {useBackgroundColor, backgroundColor};
})(MagicBackground);
