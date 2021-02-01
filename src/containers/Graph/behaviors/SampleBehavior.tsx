import { GraphinContext, IG6GraphEvent } from '@antv/graphin';
import { useContext, useLayoutEffect } from 'react';

const SampleBehavior = (): any => {
  const { graph } = useContext(GraphinContext);

  useLayoutEffect(() => {
    graph.on('node:click', (event: IG6GraphEvent) => {
      console.log(event);
    });
  }, []);

  return null;
};

export default SampleBehavior;
