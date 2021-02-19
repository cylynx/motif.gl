import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import ResultAccordion from '../Components/ResultAccordion';
import { SearchOptions } from '../../../../redux/graph';
import useSearchOption from '../hooks/useSearchOption';

const px8 = 'scale300';
const px16 = 'scale600';
const ItemResults = () => {
  const { searchOptions } = useSearchOption();
  const { results } = searchOptions as SearchOptions;

  const isResultEmpty: boolean = useMemo(() => {
    return results.length > 0;
  }, [results]);

  return (
    isResultEmpty && (
      <Block
        marginTop={px16}
        backgroundColor='backgroundTertiary'
        paddingTop={px16}
        paddingRight={px8}
        paddingLeft={px8}
        paddingBottom={px8}
      >
        <Block
          color='primary300'
          marginBottom={px8}
          display='flex'
          paddingLeft={px8}
          justifyContent='flex-start'
        >
          <LabelXSmall color='contentSecondary'>
            Found {results.length} Node{results.length === 1 ? '' : 's'}
          </LabelXSmall>
        </Block>
        <ResultAccordion results={results} expanded />
      </Block>
    )
  );
};

export default ItemResults;
