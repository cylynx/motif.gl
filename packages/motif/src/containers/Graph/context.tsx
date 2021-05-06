import React from 'react';
import Graphin from '@cylynx/graphin';

/*  const graphContext = useContext(GraphRefContext); */
const GraphRefContext = React.createContext<Graphin>(null);

export default GraphRefContext;
