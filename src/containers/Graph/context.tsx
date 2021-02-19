import React from 'react';
import Graphin from '@antv/graphin';

/*  const graphContext = useContext(GraphRefContext); */
const GraphRefContext = React.createContext<Graphin>(null);

export default GraphRefContext;
