import React from 'react';
import { useSelector } from 'react-redux';
import Graphin, { Behaviors } from '@antv/graphin';
import { GraphinData } from '@antv/graphin/lib/typings/type';
import { GraphSelectors, Layout } from '../../redux/graph';
import { TooltipProps } from './Tooltip';
import { defaultNode, defaultEdge } from '../../constants/graph-styles';
import './graphin.css';

import ActivateRelations from './behaviors/ActivateRelations';
import GraphinHighlight from './behaviors/GraphinHighlight';
import DisplayTooltips from './behaviors/DisplayTooltips';

ActivateRelations(Graphin);
GraphinHighlight(Graphin);

export type GraphProps = {
  setTooltip: (tooltip: TooltipProps) => void;
};

const Graph = React.forwardRef<Graphin, GraphProps>((props, ref) => {
  const { setTooltip } = props;
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );

  const layout: Layout = useSelector(
    (state) => GraphSelectors.getStyleOptions(state).layout,
  );

  const { DragCanvas, ZoomCanvas, DragNode } = Behaviors;

  return (
    <Graphin
      data={graphVisible as GraphinData}
      ref={ref}
      layout={layout}
      // @ts-ignore
      defaultNode={defaultNode}
      // @ts-ignore
      defaultEdge={defaultEdge}
      modes={{ default: ['activate-relations', 'graphin-highlight'] }}
      // nodeStateStyles={defaultNodeStateStyle}
      // edgeStateStyles={defaultEdgeStateStyle}
    >
      <DragCanvas shouldBegin={() => true} />
      <ZoomCanvas />
      <DragNode />
      <DisplayTooltips setTooltip={setTooltip} />
    </Graphin>
  );
});

export default Graph;
