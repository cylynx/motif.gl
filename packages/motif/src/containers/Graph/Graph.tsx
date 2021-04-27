import React from 'react';
import { useSelector } from 'react-redux';
import Graphin, { Behaviors, GraphinData } from '@cylynx/graphin';
import { GraphSelectors, Layout } from '../../redux/graph';
import { TooltipProps } from '../Tooltip/Tooltip';
import {
  defaultNode,
  defaultEdge,
  nodeStateStyles,
  edgeStateStyles,
  lightTheme,
} from '../../constants/graph-styles';
import './styles/graphin.css';

import DisplayTooltips from './customBehaviors/DisplayTooltips';
import ActivateEdgeRelations from './customBehaviors/ActivateEdgeRelations';
import ActivateNodeRelations from './customBehaviors/ActivateNodeRelations';
import DisplaySelectedProperty from './customBehaviors/DisplaySelectedProperty';

export type GraphProps = {
  setTooltip: (tooltip: Partial<TooltipProps>) => void;
};

const Graph = React.forwardRef<Graphin, GraphProps>(({ setTooltip }, ref) => {
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );

  const layout: Layout = useSelector(
    (state) => GraphSelectors.getStyleOptions(state).layout,
  );

  const {
    DragCanvas,
    ClickSelect,
    LassoSelect,
    BrushSelect,
    FontPaint,
  } = Behaviors;

  return (
    <Graphin
      data={graphVisible as GraphinData}
      ref={ref}
      layout={layout}
      // @ts-ignore
      defaultNode={defaultNode}
      // @ts-ignore
      defaultEdge={defaultEdge}
      nodeStateStyles={nodeStateStyles}
      edgeStateStyles={edgeStateStyles}
      theme={lightTheme}
    >
      <DragCanvas shouldBegin={() => true} />
      <DisplayTooltips setTooltip={setTooltip} />
      <ActivateNodeRelations />
      <ActivateEdgeRelations />
      <LassoSelect trigger='alt' includeEdges />
      <ClickSelect trigger='shift' />
      <BrushSelect trigger='shift' includeEdges />
      <DisplaySelectedProperty />
      <FontPaint />
    </Graphin>
  );
});

export default Graph;
