import React, { FC } from 'react';
import { Block } from 'baseui/block';
import { useSelector } from 'react-redux';
import NodeInfoAccordion from '../Components/NodeInfoAccordion';
import { Node, EdgeInformation, GraphSelectors } from '../../../../redux/graph';
import EdgeInfoAccordion from '../Components/EdgeInfoAccordion';

const ItemResults: FC = () => {
  const { nodes, edges } = useSelector((state) =>
    GraphSelectors.getPaginateItems(state),
  );

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
      $style={{ overflowY: 'auto' }}
    >
      {edges.map((edgeInfo: EdgeInformation) => (
        <Block marginBottom='scale500' key={edgeInfo.edge.id}>
          <EdgeInfoAccordion results={edgeInfo} expanded={false} />
        </Block>
      ))}
      {nodes.map((node: Node) => (
        <Block marginBottom='scale500' key={node.id}>
          <NodeInfoAccordion results={node} expanded={false} />
        </Block>
      ))}
    </Block>
  );
};

export default ItemResults;
