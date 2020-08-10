import React from 'react';
import { Cell } from 'baseui/layout-grid';
import FlushedGrid from './FlushedGrid';

type TriGridProps = {
  startComponent: React.ReactNode;
  midComponent?: React.ReactNode;
  endComponent?: React.ReactNode;
  span: number[];
};

const TriGrid = ({
  startComponent,
  midComponent,
  endComponent,
  span,
}: TriGridProps) => {
  if (startComponent && midComponent && endComponent && span.length === 3) {
    return (
      <FlushedGrid>
        <Cell span={span[0]}>{startComponent}</Cell>
        <Cell span={span[1]}>{midComponent}</Cell>
        <Cell span={span[2]}>{endComponent}</Cell>
      </FlushedGrid>
    );
  }
  if (startComponent && midComponent && span.length === 2) {
    return (
      <FlushedGrid>
        <Cell span={span[0]}>{startComponent}</Cell>
        <Cell span={span[1]}>{midComponent}</Cell>
      </FlushedGrid>
    );
  }
  return (
    <FlushedGrid>
      <Cell span={span}>{startComponent}</Cell>
    </FlushedGrid>
  );
};

export default TriGrid;
