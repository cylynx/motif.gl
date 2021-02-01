import React, { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useStyletron } from 'baseui';
import Graphin, {
  GraphinContextType,
  IG6GraphEvent,
  Behaviors,
} from '@antv/graphin';
import { GraphinData } from '@antv/graphin/lib/typings/type';
import { interactionStates } from '../../constants/graph-shapes';
import { GraphSelectors, Layout } from '../../redux/graph';
import { TooltipProps } from './Tooltip';
import './graphin.css';
import {
  defaultNodeStateStyle,
  defaultNode,
  defaultEdge,
  defaultEdgeStateStyle,
  lightTheme,
} from '../../constants/graph-styles';
import SampleBehavior from './behaviors/SampleBehavior';

export type GraphProps = {
  setTooltip: (tooltip: TooltipProps | null) => void;
};

const Graph = React.forwardRef<Graphin, GraphProps>((props, ref) => {
  const { setTooltip } = props;
  const [, theme] = useStyletron();
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );

  const layout: Layout = useSelector(
    (state) => GraphSelectors.getStyleOptions(state).layout,
  );

  useLayoutEffect(() => {
    // Imperatively set the color by theme
    document.getElementById('graphin-container').style.backgroundColor =
      theme.colors.backgroundPrimary;

    // @ts-ignore
    const { graph }: GraphinContextType = ref.current;

    const onResetClick = (): void => {
      setTooltip(null);
    };

    const onNodeClick = (e: IG6GraphEvent): void => {
      const { item } = e;
      // Avoid inconsistent styling between highlight.light and selected by giving priority to selected
      graph.clearItemStates(item, interactionStates);
      graph.setItemState(item, 'selected', true);

      const node = item.get('model');
      const { clientX, clientY } = e;
      setTooltip({
        id: node.id,
        x: clientX,
        y: clientY,
        type: 'node',
      });

      // Ctrl event is for multiple select so don't display tooltip
      // if (!e.originalEvent.ctrlKey && !e.originalEvent.shiftKey) {
      //   const node = item.get('model');
      //   const { clientX, clientY } = e;
      //   setTooltip({
      //     id: node.id,
      //     x: clientX,
      //     y: clientY,
      //     type: 'node',
      //   });
      // }
    };

    const onEdgeClick = (e: IG6GraphEvent): void => {
      const { item } = e;
      // Avoid inconsistent styling between highlight.light and selected by giving priority to selected
      graph.clearItemStates(item, interactionStates);
      graph.setItemState(item, 'selected', true);

      const { clientX, clientY } = e;
      const edge = item.get('model');
      setTooltip({
        id: edge.id,
        x: clientX,
        y: clientY,
        type: 'edge',
      });

      // Ctrl event is for multiple select so don't display tooltip
      // if (!e.originalEvent.ctrlKey && !e.originalEvent.shiftKey) {
      //   const { clientX, clientY } = e;
      //   const edge = item.get('model');
      //   setTooltip({
      //     id: edge.id,
      //     x: clientX,
      //     y: clientY,
      //     type: 'edge',
      //   });
      // }
    };

    // Graph Behaviours
    graph.on('node:click', onNodeClick);
    graph.on('node:dragstart', onResetClick);
    graph.on('edge:click', onEdgeClick);
    graph.on('canvas:click', onResetClick);
    graph.on('canvas:dragstart', onResetClick);

    return (): void => {
      graph.off('node:click', onNodeClick);
      graph.off('node:mouseleave', onResetClick);
      graph.off('edge:click', onEdgeClick);
      graph.off('canvas:click', onResetClick);
      graph.off('canvas:dragstart', onResetClick);
    };
  }, [setTooltip]);

  const { DragCanvas } = Behaviors;

  return (
    <Graphin
      data={graphVisible as GraphinData}
      ref={ref}
      layout={layout}
      // @ts-ignore
      defaultNode={defaultNode}
      // @ts-ignore
      defaultEdge={defaultEdge}
      // nodeStateStyles={defaultNodeStateStyle}
      // edgeStateStyles={defaultEdgeStateStyle}
    >
      <DragCanvas shouldBegin={() => true} />
    </Graphin>
  );
});

export default Graph;
