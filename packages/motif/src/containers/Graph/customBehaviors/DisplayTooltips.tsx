import {
  GraphinContext,
  IG6GraphEvent,
  GraphinContextType,
} from '@cylynx/graphin';
import { INode, IEdge } from '@antv/g6';
import { useContext, useLayoutEffect } from 'react';
import { TooltipProps } from '../../Tooltip/Tooltip';

export type DisplayTooltipProps = {
  setTooltip: (tooltip: Partial<TooltipProps>) => void;
};

const DisplayTooltip = ({ setTooltip }: DisplayTooltipProps): any => {
  const { graph } = useContext(GraphinContext) as GraphinContextType;

  const onMouseLeave = (): void => {
    setTooltip(null);
  };

  /**
   * Prevent display tooltip when dragging nodes.
   * @see https://github.com/cylynx/motif.gl/issues/141
   */
  const onNodeDragStart = (): void => {
    setTooltip(null);
  };

  const onNodeHover = (e: IG6GraphEvent): void => {
    const item = e.item as INode;

    const node = item.get('model');
    const point = graph.getPointByClient(e.clientX, e.clientY);
    const { x, y } = graph.getCanvasByPoint(point.x, point.y);
    setTooltip({
      id: node.id,
      x,
      y,
      type: 'node',
    });
  };

  const onEdgeHover = (e: IG6GraphEvent): void => {
    const item = e.item as IEdge;

    const edge = item.get('model');
    const point = graph.getPointByClient(e.clientX, e.clientY);
    const { x, y } = graph.getCanvasByPoint(point.x, point.y);
    setTooltip({
      id: edge.id,
      x,
      y,
      type: 'edge',
    });
  };

  useLayoutEffect(() => {
    graph.on('node:mouseenter', onNodeHover);
    graph.on('node:mouseleave', onMouseLeave);
    graph.on('node:dragstart', onNodeDragStart);
    graph.on('edge:mouseenter', onEdgeHover);
    graph.on('edge:mouseleave', onMouseLeave);

    return (): void => {
      graph.off('node:mouseenter', onNodeHover);
      graph.off('node:mouseleave', onMouseLeave);
      graph.off('node:dragstart', onNodeDragStart);
      graph.off('edge:mouseenter', onEdgeHover);
      graph.off('edge:mouseleave', onMouseLeave);
    };
  }, [setTooltip]);

  return null;
};

export default DisplayTooltip;
