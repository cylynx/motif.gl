import React, { FC } from 'react';
import { Block } from 'baseui/block';
import NodeInfoAccordion from '../Components/NodeInfoAccordion';
import { Node, EdgeInformation } from '../../../../redux/graph';
import EdgeInfoAccordion from '../Components/EdgeInfoAccordion';

const px8 = 'scale300';
const px16 = 'scale600';

export type ItemResultsProps = {
  nodes: Node[];
  edges: EdgeInformation[];
};

const ItemResults: FC<ItemResultsProps> = ({ nodes, edges }) => {
  return (
    <Block
      backgroundColor='backgroundTertiary'
      paddingTop={px16}
      paddingRight={px8}
      paddingLeft={px8}
      paddingBottom={px8}
      $style={{ maxHeight: '65vh', overflowY: 'auto' }}
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
