import React, { useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Graphin, { G6Event, Node, Edge } from '@antv/graphin';
import * as Prop from '../../types/Prop';
import '@antv/graphin/dist/index.css';
import { setClickedId, getUI, getGraph } from '../../redux';

const InvestigateGraph: React.FC<Prop.InvestigateGraph> = (props) => {
  const { setMenu } = props;
  const dispatch = useDispatch();
  const clickedId = useSelector((state) => getUI(state).clickedId);
  const graphVisible = useSelector((state) => getGraph(state).graphVisible);
  const layout = useSelector((state) => getGraph(state).styleOptions.layout);

  const graphRef = useRef(null);

  useLayoutEffect(() => {
    const { graph } = graphRef.current;
    const clearAllStats = () => {
      graph.setAutoPaint(false);
      graph.getNodes().forEach((node: Node) => {
        graph.clearItemStates(node);
      });
      graph.getEdges().forEach((edge: Edge) => {
        graph.clearItemStates(edge);
      });
      graph.paint();
      graph.setAutoPaint(true);
    };

    const onNodeHover = (e: G6Event) => {
      const { item } = e;
      graph.setAutoPaint(false);
      graph.getNodes().forEach((node: Node) => {
        graph.clearItemStates(node);
        graph.setItemState(node, 'highlight.dark', true);
      });
      graph.setItemState(item, 'highlight.dark', false);
      graph.setItemState(item, 'highlight.light', true);
      graph.getEdges().forEach((edge: Edge) => {
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
    const onNodeClick = (e) => {
      const node = e.item.get('model');
      if (clickedId === node.id) {
        dispatch(setClickedId(null));
        setMenu(false);
      } else {
        dispatch(setClickedId(node.id));
        setMenu({
          x: e.canvasX,
          y: e.canvasY,
          node,
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
