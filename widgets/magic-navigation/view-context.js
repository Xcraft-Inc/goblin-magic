import React from 'react';

const {createContext} = require('react');

const ViewContext = createContext();

export default ViewContext;

export function withView(Component) {
  return (props) => (
    <ViewContext.Consumer>
      {(view) => <Component view={view} {...props} />}
    </ViewContext.Consumer>
  );
}
