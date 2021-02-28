import React, { FC, useContext, MouseEvent } from 'react';
import { Block, BlockOverrides } from 'baseui/block';
import { useSelector } from 'react-redux';
import { Theme } from 'baseui/theme';
import { INode, IEdge } from '@antv/g6';
import { GraphSelectors } from '../../../../../redux/graph';
import GraphRefContext from '../../../../Graph/context';
import useGraphBehaviors from '../../../../Graph/hooks/useGraphBehaviors';
import NodeResults from './NodeResults';
import EdgeResults from './EdgeResults';

const itemBlockOverrides: BlockOverrides = {
  Block: {
    style: ({ $theme }: { $theme: Theme }) => ({
      ':hover': {
        outline: `${$theme.colors.primaryA} solid ${$theme.sizing.scale0}`,
      },
    }),
  },
};

const ItemResults: FC = () => {
  const { nodes, edges } = useSelector((state) =>
    GraphSelectors.getPaginateItems(state),
  );

  const { graph } = useContext(GraphRefContext);
  const {
    centerCanvas,
    clearNodeHoverState,
    centerItem,
    clearEdgeHoverState,
  } = useGraphBehaviors(graph);

  const onNodeMouseEnter = (
    event: MouseEvent<HTMLDivElement>,
    nodeId: string,
  ) => {
    event.stopPropagation();
    const node = graph.findById(nodeId) as INode;
    graph.setAutoPaint(false);

    graph.setItemState(node, 'hover', true);
    centerCanvas();
    centerItem(node);
    graph.paint();
    graph.setAutoPaint(true);
  };

  const onEdgeMouseEnter = (
    event: MouseEvent<HTMLDivElement>,
    edgeId: string,
  ) => {
    event.stopPropagation();
    const edge = graph.findById(edgeId) as IEdge;
    const sourceNode = edge.getSource();
    const targetNode = edge.getTarget();

    graph.setAutoPaint(false);

    graph.setItemState(edge, 'hover', true);
    graph.setItemState(sourceNode, 'hover', true);
    graph.setItemState(targetNode, 'hover', true);
    centerCanvas();
    centerItem(edge);
    graph.paint();
    graph.setAutoPaint(true);
  };

  const onMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    graph.setAutoPaint(false);
    clearNodeHoverState();
    clearEdgeHoverState();
    graph.paint();
    graph.setAutoPaint(true);
  };

  return (
    <Block
      paddingBottom='scale300'
      paddingLeft='scale550'
      paddingRight='scale550'
      paddingTop='scale300'
      marginTop='scale500'
      position='absolute'
      top={0}
      bottom='35px'
      right={0}
      left={0}
      width='auto'
      $style={{ overflowY: 'auto', scrollbarWidth: 'thin' }}
    >
      <EdgeResults
        edges={edges}
        overrides={itemBlockOverrides}
        onMouseEnter={onEdgeMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      <NodeResults
        nodes={nodes}
        overrides={itemBlockOverrides}
        onMouseEnter={onNodeMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </Block>
  );
};

export default ItemResults;