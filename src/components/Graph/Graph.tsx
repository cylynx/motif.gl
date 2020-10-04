/* eslint-disable import/no-extraneous-dependencies */
// @ts-nocheck
import React, { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Graphin from '@antv/graphin';
import { IG6GraphEvent } from '@antv/g6/lib/types';
import * as Prop from '../../types/Prop';
import activateRelations from './behaviors/activate-relations';
import { setClickedId, getUI, getGraph } from '../../redux';
import './graphin.css';
// import '@antv/graphin/dist/index.css';

const Graph = React.forwardRef<HTMLDivElement, Prop.Graph>((props, ref) => {
  const { setTooltip } = props;
  const dispatch = useDispatch();
  const clickedId = useSelector((state) => getUI(state).clickedId);
  const graphVisible = useSelector((state) => getGraph(state).graphVisible);
  const layout = useSelector((state) => getGraph(state).styleOptions.layout);

  useLayoutEffect(() => {
    const { graph } = ref.current;

    const onResetClick = () => {
      setClickedId(null);
      setTooltip(false);
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
        if (clickedId === node.id) {
          dispatch(setClickedId(null));
          setTooltip(false);
        } else {
          dispatch(setClickedId(node.id));
          setTooltip({
            x: canvasXY.x,
            y: canvasXY.y,
            selected: {
              type: 'node',
              obj: node,
            },
          });
        }
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
        if (clickedId === edge.id) {
          dispatch(setClickedId(null));
          setTooltip(false);
        } else {
          dispatch(setClickedId(edge.id));
          setTooltip({
            x: canvasXY.x,
            y: canvasXY.y,
            selected: {
              type: 'edge',
              obj: edge,
            },
          });
        }
      }
    };

    // Graph Behaviours
    graph.on('node:click', onNodeClick);
    graph.on('node:dragstart', onResetClick);
    graph.on('edge:click', onEdgeClick);
    graph.on('canvas:click', onResetClick);
    graph.on('canvas:drag', onResetClick);
    return () => {
      graph.off('node:click', onNodeClick);
      graph.off('node:dragstart', onResetClick);
      graph.on('edge:click', onEdgeClick);
      graph.off('canvas:click', onResetClick);
      graph.off('canvas:drag', onResetClick);
    };
  }, [clickedId, dispatch, setTooltip]);

  return (
    <Graphin
      data={graphVisible}
      layout={layout}
      ref={ref}
      options={{
        autoPolyEdge: true,
        modes: {
          default: [
            {
              type: 'brush-select',
              trigger: 'shift',
              includeEdges: true,
            },
          ],
        },
      }}
      register={{
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
