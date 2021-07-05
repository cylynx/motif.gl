import {
  GraphinContext,
  GraphinContextType,
  IG6GraphEvent,
} from '@cylynx/graphin';
import { useContext, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GraphSelectors, GraphSlices } from '../../../redux/graph';

const DragGraph = () => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;
  const dispatch = useDispatch();
  const layout = useSelector(
    (state) => GraphSelectors.getStyleOptions(state).layout,
  );

  const onDragEnd = (_: IG6GraphEvent): void => {
    if (layout.type === 'preset') {
      return;
    }

    dispatch(GraphSlices.changeLayout({ layout: { id: 'preset' } }));
  };

  useLayoutEffect(() => {
    graph.on('dragleave', onDragEnd);

    return (): void => {
      graph.off('dragleave', onDragEnd);
    };
  });

  return null;
};

export default DragGraph;
