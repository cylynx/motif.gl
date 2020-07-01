import React, { useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@antv/graphin/dist/index.css';

import Graphin from '@antv/graphin';
import { setClickedId, getGraphInit, getGraph } from '../redux';

const InvestigateGraph = props => {
  const { setMenu } = props;
  const dispatch = useDispatch();
  const clickedId = useSelector(state => getGraphInit(state).clickedId);
  const graphVisible = useSelector(state => getGraph(state).graphVisible);
  const layout = useSelector(state => getGraph(state).defaultOptions.layout);

  const graphRef = useRef(null);

  useLayoutEffect(() => {
    const { graph } = graphRef.current;
    const clearAllStats = () => {
      graph.setAutoPaint(false);
      graph.getNodes().forEach(node => {
        graph.clearItemStates(node);
      });
      graph.getEdges().forEach(edge => {
        graph.clearItemStates(edge);
      });
      graph.paint();
      graph.setAutoPaint(true);
    };

    const onNodeHover = e => {
      const { item } = e;
      graph.setAutoPaint(false);
      graph.getNodes().forEach(node => {
        graph.clearItemStates(node);
        graph.setItemState(node, 'highlight.dark', true);
      });
      graph.setItemState(item, 'highlight.dark', false);
      graph.setItemState(item, 'highlight.light', true);
      graph.getEdges().forEach(edge => {
        if (edge.getSource() === item) {
          graph.setItemState(edge.getTarget(), 'highlight.dark', false);
          graph.setItemState(edge.getTarget(), 'highlight.light', true);
          graph.setItemState(edge, 'highlight.light', true);
          edge.toFront();
        } else if (edge.getTarget() === item) {
          graph.setItemState(edge.getSource(), 'highlight.dark', false);
          graph.setItemState(edge.getSource(), 'highlight.light', true);
          graph.setItemState(edge, 'highlight.light', true);
          edge.toFront();
        } else {
          graph.setItemState(edge, 'highlight.light', false);
        }
      });
      graph.paint();
      graph.setAutoPaint(true);
    };

    const onResetClick = () => {
      setClickedId(null);
      setMenu(false);
    };
    const onNodeClick = e => {
      const { id } = e.item.get('model');
      if (clickedId === id) {
        dispatch(setClickedId(null));
        setMenu(false);
      } else {
        dispatch(setClickedId(id));
        setMenu({
          x: e.canvasX,
          y: e.canvasY,
          node: id,
        });
      }
    };

    // Graph Behaviours
    graph.on('node:click', onNodeClick);
    graph.on('node:dragstart', onResetClick);
    graph.on('canvas:click', onResetClick);
    graph.on('node:mouseenter', onNodeHover);
    graph.on('node:mouseleave', clearAllStats);
    graph.on('canvas:drag', onResetClick);
    return () => {
      graph.off('node:click', onNodeClick);
      graph.off('node:dragstart', onResetClick);
      graph.off('canvas:click', onResetClick);
      graph.off('node:mouseenter', onNodeHover);
      graph.off('node:mouseleave', clearAllStats);
      graph.off('canvas:drag', onResetClick);
    };
  }, [clickedId, dispatch, setMenu]);

  return (
    <Graphin
      data={graphVisible}
      layout={layout}
      ref={graphRef}
      options={{
        autoPolyEdge: true,
      }}
    />
  );
};

export default InvestigateGraph;
