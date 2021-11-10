import React, { ReactNode } from 'react';
import Graphin from '@cylynx/graphin';
import { TLoadFormat } from '../../redux/graph';

export type ExplorerContextProps = {
  onExportExternal?: (exportData: TLoadFormat) => void;
  customSidePanelHeader?: ReactNode;
};

/*  const graphContext = useContext(GraphRefContext); */
const GraphRefContext = React.createContext<Graphin>(null);
const ExplorerContext = React.createContext<ExplorerContextProps>(null);
export { GraphRefContext, ExplorerContext };
