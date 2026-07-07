import React from 'react';
import Widget from 'goblin-laboratory/widgets/widget/index.js';
import DesktopIdContext from 'goblin-laboratory/widgets/with-desktop-id/context.js';

const withWindowNumber = (Component) => {
  const ConnectedComponent = Widget.connect((state, props) => {
    return {
      windowNumber: state
        .get('backend')
        .get('magicNavigation@main')
        .get('windowIds')
        .indexOf(props.desktopId),
    };
  })(Component);
  return (props) => (
    <DesktopIdContext.Consumer>
      {(desktopId) => <ConnectedComponent desktopId={desktopId} {...props} />}
    </DesktopIdContext.Consumer>
  );
};

export default withWindowNumber;
