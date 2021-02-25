import { Block, BlockOverrides } from 'baseui/block';
import React, { MouseEvent } from 'react';
import { Node } from '../../../../../redux/graph';
import NodeInfoAccordion from '../../Components/NodeInfoAccordion';

type NodeResultsProps = {
  nodes: Node[];
  overrides: BlockOverrides;
  onMouseEnter: (event: MouseEvent<HTMLDivElement>, nodeId: string) => void;
  onMouseLeave: (event: MouseEvent<HTMLDivElement>) => void;
};

const NodeResults = ({
  nodes,
  overrides,
  onMouseEnter,
  onMouseLeave,
}: NodeResultsProps) => {
  return (
    <Block>
      {nodes.map((node: Node) => (
        <div
          key={node.id}
          onMouseEnter={(event) => onMouseEnter(event, node.id)}
          onMouseLeave={onMouseLeave}
        >
          <Block marginBottom='scale550' overrides={overrides}>
            <NodeInfoAccordion results={node} expanded={false} />
          </Block>
        </div>
      ))}
    </Block>
  );
};

export default NodeResults;
