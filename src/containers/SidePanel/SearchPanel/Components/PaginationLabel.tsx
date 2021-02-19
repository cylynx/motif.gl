import React, { FC } from 'react';
import { LabelXSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { EdgeNode } from '../../../../redux/graph';

export type PaginationLabelProps = {
  results: EdgeNode[];
};

const PaginationLabel: FC<PaginationLabelProps> = ({ results = [] }) => {
  return (
    <Block
      color='primary300'
      marginTop='scale600'
      marginBottom='scale300'
      display='flex'
      paddingLeft='scale300'
      justifyContent='flex-start'
    >
      <LabelXSmall color='contentSecondary'>
        Found {results.length} Node{results.length === 1 ? '' : 's'}
      </LabelXSmall>
    </Block>
  );
};

export default PaginationLabel;
