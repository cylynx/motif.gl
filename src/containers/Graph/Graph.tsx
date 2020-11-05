/* eslint-disable import/no-extraneous-dependencies */
// @ts-nocheck
import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyletron } from 'baseui';
import Graphin from '@antv/graphin';
import { IG6GraphEvent } from '@antv/g6/lib/types';
import activateRelations from './behaviors/activate-relations';
// import RegisterCircleNode from './shape/CircleNode';
import { getGraph } from '../../redux';
import { Tooltip } from './Tooltip';
import './graphin.css';
// import '@antv/graphin/dist/index.css';

export type GraphProps = {
  setTooltip: (tooltip: Tooltip | null) => void;
};

const Graph = React.forwardRef<HTMLDivElement, GraphProps>((props, ref) => {
  const { setTooltip } = props;
  const dispatch = useDispatch();
  const [, theme] = useStyletron();
  const graphVisible = useSelector((state) => getGraph(state).graphVisible);
  const layout = useSelector((state) => getGraph(state).styleOptions.layout);

  useLayoutEffect(() => {
    // Imperatively set the color by theme
    document.getElementById('graphin-container').style.backgroundColor =
      theme.colors.backgroundPrimary;

    const { graph } = ref.current;

    const onResetClick = () => {
      setTooltip(null);
    };

    const onNodeClick = (e: IG6GraphEvent) => {
      const { item } = e;
      // Avoid inconsistent styling between highlight.light and selected by giving priority to selected
      graph.clearItemStates(item);
      graph.setItemState(item, 'selected', true);
      // Alt event is for multiple select so don't display tooltip
      if (!e.originalEvent.altKey) {
        const { centerX, centerY } = item.getBBox();
        const canvasXY = graph.getCanvasByPoint(centerX, centerY);
        const node = item.get('model');
        setTooltip({
          id: node.id,
          x: canvasXY.x,
          y: canvasXY.y,
          type: 'node',
        });
      }
    };

    const onEdgeClick = (e: IG6GraphEvent) => {
      const { item } = e;
      // Avoid inconsistent styling between highlight.light and selected by giving priority to selected
      graph.clearItemStates(item);
      graph.setItemState(item, 'selected', true);
      // Alt event is for multiple select so don't display tooltip
      if (!e.originalEvent.altKey) {
        const { centerX, centerY } = item.getBBox();
        const canvasXY = graph.getCanvasByPoint(centerX, centerY);
        const edge = item.get('model');
        setTooltip({
          id: edge.id,
          x: canvasXY.x,
          y: canvasXY.y,
          type: 'edge',
        });
      }
    };

    // Graph Behaviours
    graph.on('node:click', onNodeClick);
    graph.on('node:dragstart', onResetClick);
    graph.on('edge:click', onEdgeClick);
    graph.on('canvas:click', onResetClick);
    graph.on('canvas:dragstart', onResetClick);
    return () => {
      graph.off('node:click', onNodeClick);
      graph.off('node:mouseleave', onResetClick);
      graph.off('edge:click', onEdgeClick);
      graph.off('canvas:click', onResetClick);
      graph.off('canvas:dragstart', onResetClick);
    };
  }, [dispatch, setTooltip]);

  return (
    <Graphin
      data={graphVisible}
      layout={null}
      ref={ref}
      options={{
        isZoomOptimize: () => true,
        keyShapeZoom: 0.6,
        defaultNode: {
          nodeSize: 10,
          size: 20,
          defaultStyle: {
            primaryColor: 'blue',
          },
        },
        autoPolyEdge: true,
        modes: {
          default: [
            {
              type: 'brush-select',
              trigger: 'shift',
              includeEdges: true,
            },
            {
              type: 'drag-canvas',
              enableOptimize: true,
            },
          ],
        },
      }}
      register={{
        // nodeShape: (G6) => [
        //   {
        //     name: 'CircleNode',
        //     register: () => {
        //       RegisterCircleNode(G6);
        //     },
        //   },
        // ],
        behavior: (G6) => [
          {
            name: 'activate-relations',
            mode: 'default',
            options: {},
            register: () => {
              G6.registerBehavior('activate-relations', activateRelations);
            },
          },
        ],
      }}
    />
  );
});

export default Graph;
