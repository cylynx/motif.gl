import React, { useMemo, Fragment } from 'react';

import { Block } from 'baseui/block';
import Header from '../Header';
import MainSection from './Section/MainSection';
import ItemResults from './Section/ItemResults';
import PaginationLabel from './Components/PaginationLabel';
import useSearchOption from './hooks/useSearchOption';
import { SearchOptions } from '../../../redux/graph';
import PropertyDisplaySelection from './Components/PropertyDisplaySelection';

const SearchPanel = () => {
  const { searchOptions } = useSearchOption();
  const { results } = searchOptions as SearchOptions;

  const isResultEmpty: boolean = useMemo(() => {
    return results.nodes.length === 0 && results.edges.length === 0;
  }, [results]);

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
          <ItemResults nodes={results.nodes} edges={results.edges} />
          <PaginationLabel results={results.nodes} />
        </Block>
      )}
    </Block>
  );
};

export default SearchPanel;
