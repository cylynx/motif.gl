/* eslint-disable react/jsx-props-no-spreading */
// @ts-nocheck
import React from 'react';

const GraphRefContext = React.createContext(null);

export const withGraphRef = (Component) => (props) => (
  <GraphRefContext.Consumer>
    {(ref) => <Component {...props} graphRef={ref} />}
  </GraphRefContext.Consumer>
);

export default GraphRefContext;
