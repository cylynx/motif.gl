import { useContext, useLayoutEffect } from 'react';
import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@antv/graphin';

const ActivateEdgeRelations = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;

  useLayoutEffect(() => {
    graph.on('node:mouseenter', (event: IG6GraphEvent) => {
      console.log(event);
    });
  }, []);
  return null;
};

export default ActivateEdgeRelations;
