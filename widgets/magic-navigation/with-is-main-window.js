import React from 'react';
import withWindowNumber from './with-window-number.js';

const withIsMainWindow = (Component) => {
  return withWindowNumber(({windowNumber, ...props}) => (
    <Component isMainWindow={windowNumber === 0} {...props} />
  ));
};

export default withIsMainWindow;
