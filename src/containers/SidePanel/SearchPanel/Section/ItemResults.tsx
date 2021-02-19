import React, { FC } from 'react';
import { Block } from 'baseui/block';
import ResultAccordion from '../Components/ResultAccordion';
import { EdgeNode } from '../../../../redux/graph';

const px8 = 'scale300';
const px16 = 'scale600';

export type ItemResultsProps = {
  results: EdgeNode[];
};

const ItemResults: FC<ItemResultsProps> = ({ results = [] }) => {
  return (
    <Block
      backgroundColor='backgroundTertiary'
      paddingTop={px16}
      paddingRight={px8}
      paddingLeft={px8}
      paddingBottom={px8}
    >
      <ResultAccordion results={results} expanded />
    </Block>
  );
};

export default ItemResults;
