import React, { FC } from 'react';
import { Block } from 'baseui/block';
import NodeInfoAccordion from '../Components/NodeInfoAccordion';
import { Node, EdgeInformation } from '../../../../redux/graph';
import EdgeInfoAccordion from '../Components/EdgeInfoAccordion';

const px8 = 'scale300';

export type ItemResultsProps = {
  nodes: Node[];
  edges: EdgeInformation[];
};

const ItemResults: FC<ItemResultsProps> = ({ nodes, edges }) => {
  return (
    <Block
      marginTop={px8}
      paddingBottom={px8}
      paddingLeft={px8}
      paddingRight={px8}
      position='absolute'
      top='28px'
      bottom='28px'
      right={0}
      left={0}
      width='auto'
      $style={{ overflowY: 'auto' }}
    >
      {nodes.map((node: Node) => (
        <Block marginBottom='scale500' key={node.id}>
          <NodeInfoAccordion results={node} expanded={false} />
        </Block>
      ))}
      {edges.map((edgeInfo: EdgeInformation) => (
        <Block marginBottom='scale500' key={edgeInfo.edge.id}>
          <EdgeInfoAccordion results={edgeInfo} expanded={false} />
        </Block>
      ))}
    </Block>
  );
};

export default ItemResults;
