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
    >
      {nodes.map((node: Node) => {
        return <NodeInfoAccordion key={node.id} results={node} expanded />;
      })}
      {edges.map((edgeInfo: EdgeInformation) => {
        return (
          <EdgeInfoAccordion
            key={edgeInfo.edge.id}
            results={edgeInfo}
            expanded={false}
          />
        );
      })}
    </Block>
  );
};

export default ItemResults;
