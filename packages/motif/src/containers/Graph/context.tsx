import React from 'react';
import Graphin from '@cylynx/graphin';
import { TLoadFormat } from '../../redux/graph';

export type ExplorerContextProps = {
  onSaveCloud?: (exportData: TLoadFormat) => void;
};

/*  const graphContext = useContext(GraphRefContext); */
const GraphRefContext = React.createContext<Graphin>(null);
const ExplorerContext = React.createContext<ExplorerContextProps>(null);
export { GraphRefContext, ExplorerContext };
