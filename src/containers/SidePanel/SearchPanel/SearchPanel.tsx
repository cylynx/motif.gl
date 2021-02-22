import React, { useMemo } from 'react';

import { Block } from 'baseui/block';
import MainSection from './Section/MainSection';
import ItemResults from './Section/ItemResults';
import ItemPagination from './Components/ItemPagination';
import useSearchOption from './hooks/useSearchOption';
import { SearchOptions } from '../../../redux/graph';
import PropertyDisplaySelection from './Components/PropertyDisplaySelection';

const SearchPanel = () => {
  const { searchOptions } = useSearchOption();
  const { results } = searchOptions as SearchOptions;

  const isResultEmpty: boolean = useMemo(() => {
    return results.nodes.length === 0 && results.edges.length === 0;
  }, [results]);

  const nodeResultLength: number = useMemo(() => {
    return results.nodes.length;
  }, [results.nodes]);

  const edgeResultLength: number = useMemo(() => {
    return results.edges.length;
  }, [results.edges]);

  return (
    <Block>
      <MainSection />

      {isResultEmpty === false && (
        <Block marginTop='scale600'>
          <Block
            marginTop='scale200'
            marginBottom='scale200'
            display='flex'
            justifyContent='flex-end'
            paddingLeft='scale50'
            paddingRight='scale50'
          >
            <PropertyDisplaySelection />
          </Block>
          <ItemPagination
            nodeLength={nodeResultLength}
            edgeLength={edgeResultLength}
          />
          <ItemResults nodes={results.nodes} edges={results.edges} />
        </Block>
      )}
    </Block>
  );
};

export default SearchPanel;
