import React from 'react';
import ViewContext from './view-context.js';

const withParentId = (Component) => (props) => (
  <ViewContext.Consumer>
    {(view) => <Component parentId={view.get('serviceId')} {...props} />}
  </ViewContext.Consumer>
);

export default withParentId;
