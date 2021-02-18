import { useContext, useLayoutEffect } from 'react';
import { G6Event, INode } from '@antv/g6';
import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@antv/graphin';

const SelectedNodeInformation = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;

  useLayoutEffect(() => {
    const displayNodeInformation = (e: IG6GraphEvent) => {
      const item = e.item as INode;
      console.log(item);
    };

    graph.on(G6Event.NODESELECTCHANGE, displayNodeInformation);

    return (): void => {
      graph.off(G6Event.NODESELECTCHANGE, displayNodeInformation);
    };
  }, []);

  return null;
};

export default SelectedNodeInformation;
