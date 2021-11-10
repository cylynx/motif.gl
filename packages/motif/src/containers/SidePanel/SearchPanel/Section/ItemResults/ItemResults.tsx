import React, { FC, useContext, MouseEvent } from 'react';
import { Block, BlockOverrides } from 'baseui/block';
import { useSelector } from 'react-redux';
import { Theme } from 'baseui/theme';
import { INode, IEdge } from '@antv/g6';
import { RootState } from '../../../../../redux';
import { GraphSelectors } from '../../../../../redux/graph';
import { GraphRefContext } from '../../../../Graph/context';
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
  const { nodes, edges } = useSelector((state: RootState) =>
    GraphSelectors.getPaginateItems(state),
  );

  const { graph } = useContext(GraphRefContext);
  const { clearNodeHoverState, centerNode, centerEdge, clearEdgeHoverState } =
    useGraphBehaviors(graph);

  const onNodeMouseEnter = (
    event: MouseEvent<HTMLDivElement>,
    nodeId: string,
  ) => {
    event.stopPropagation();
    const node = graph.findById(nodeId) as unknown as INode;
    if (node === null) {
      return;
    }

    const nodeID: string = node.getID();
    graph.setAutoPaint(false);
    graph.setItemState(nodeID, 'hover', true);
    centerNode(node);
    graph.paint();
    graph.setAutoPaint(true);
  };

  const onEdgeMouseEnter = (
    event: MouseEvent<HTMLDivElement>,
    edgeId: string,
  ) => {
    event.stopPropagation();
    const edge = graph.findById(edgeId) as unknown as IEdge;
    if (!edge) {
      return;
    }

    const sourceNode = edge.getSource();
    const targetNode = edge.getTarget();

    const edgeID: string = edge.getID();
    const edgeSourceID: string = sourceNode.getID();
    const edgeTargetID: string = targetNode.getID();

    graph.setAutoPaint(false);
    graph.setItemState(edgeID, 'hover', true);
    graph.setItemState(edgeSourceID, 'hover', true);
    graph.setItemState(edgeTargetID, 'hover', true);
    centerEdge(edge);
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
      paddingLeft='scale100'
      paddingRight='scale100'
      paddingTop='scale300'
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
