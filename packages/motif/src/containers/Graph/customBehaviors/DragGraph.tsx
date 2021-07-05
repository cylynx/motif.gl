import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@cylynx/graphin';
import { useContext, useLayoutEffect } from 'react';

import useLayout from '../../../redux/graph/hooks/useLayout';

const DragGraph = () => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  const { layout, changeGraphLayout } = useLayout();

  const onDragEnd = (_: IG6GraphEvent): void => {
    if (layout.type === 'preset') {
      return;
    }

    const params = {
      layout: { id: 'preset' },
    };
    changeGraphLayout(params);
  };

  useLayoutEffect(() => {
    graph.on('node:dragleave', onDragEnd);

    return (): void => {
      graph.off('node:dragleave', onDragEnd);
    };
  });

  return null;
};

export default DragGraph;
