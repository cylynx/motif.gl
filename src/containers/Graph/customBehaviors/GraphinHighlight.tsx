import { useContext, useLayoutEffect } from 'react';
import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@antv/graphin';

const GraphinHighlight = (): null => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;

  const onNodeClick = (_: IG6GraphEvent) => {};

  const onEdgeClick = (_: IG6GraphEvent) => {};

  useLayoutEffect(() => {
    graph.on('node:mouseenter', (event: IG6GraphEvent) => {
      console.log(event);
    });

    graph.on('node:click', onNodeClick);
    graph.on('edge:click', onEdgeClick);
  }, []);
  return null;
};

export default GraphinHighlight;
