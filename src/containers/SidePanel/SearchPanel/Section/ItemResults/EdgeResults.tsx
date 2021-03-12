import { Block, BlockOverrides } from 'baseui/block';
import React, { MouseEvent } from 'react';
import { EdgeInformation } from '../../../../../redux/graph';
import EdgeInfoAccordion from '../../Components/EdgeInfoAccordion';

type EdgeResultsProps = {
  edges: EdgeInformation[];
  overrides: BlockOverrides;
  onMouseEnter: (event: MouseEvent<HTMLDivElement>, edgeId: string) => void;
  onMouseLeave: (event: MouseEvent<HTMLDivElement>) => void;
};

const EdgeResults = ({
  edges,
  overrides,
  onMouseEnter,
  onMouseLeave,
}: EdgeResultsProps) => {
  return edges.map((edgeInfo: EdgeInformation) => (
    <div
      key={edgeInfo.edge.id}
      onMouseLeave={onMouseLeave}
      onMouseEnter={(event) => onMouseEnter(event, edgeInfo.edge.id)}
    >
      <Block marginBottom='scale550' overrides={overrides}>
        <EdgeInfoAccordion results={edgeInfo} expanded={false} />
      </Block>
    </div>
  ));
};

export default EdgeResults;
