import React, { ForwardedRef } from 'react';
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
import PositionGraph from './customBehaviors/PositionGraph';

export type GraphProps = {
  setTooltip: (tooltip: Partial<TooltipProps>) => void;
};

const Graph = React.forwardRef<Graphin, GraphProps>(
  ({ setTooltip }, ref: ForwardedRef<Graphin>) => {
    const graphVisible = useSelector((state) =>
      GraphSelectors.getGraphVisible(state),
    );

    const layout: Layout = useSelector(
      (state) => GraphSelectors.getStyleOptions(state).layout,
    );

    const { ClickSelect, LassoSelect, BrushSelect, FontPaint } = Behaviors;

    return (
      <Graphin
        data={graphVisible as GraphinData}
        ref={ref}
        layout={layout}
        defaultNode={defaultNode}
        defaultEdge={defaultEdge}
        nodeStateStyles={nodeStateStyles}
        edgeStateStyles={edgeStateStyles}
        theme={lightTheme}
      >
        <PositionGraph />
        <DisplayTooltips setTooltip={setTooltip} />
        <ActivateNodeRelations />
        <ActivateEdgeRelations />
        <LassoSelect trigger='alt' includeEdges />
        <ClickSelect disabled />
        <BrushSelect trigger='shift' includeEdges />
        <DisplaySelectedProperty />
        <FontPaint />
      </Graphin>
    );
  },
);

export default Graph;
