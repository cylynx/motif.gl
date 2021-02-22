import React, { useMemo, Fragment } from 'react';

import { Block } from 'baseui/block';
import Header from '../Header';
import MainSection from './Section/MainSection';
import ItemResults from './Section/ItemResults';
import PaginationLabel from './Components/PaginationLabel';
import useSearchOption from './hooks/useSearchOption';
import { SearchOptions } from '../../../redux/graph';

const SearchPanel = () => {
  const { searchOptions } = useSearchOption();
  const { results } = searchOptions as SearchOptions;

  const isResultEmpty: boolean = useMemo(() => {
    return results.nodes.length === 0 && results.edges.length === 0;
  }, [results]);

  return (
    <Block>
      <Header />
      <MainSection />
      {isResultEmpty === false && (
        <Fragment>
          <PaginationLabel results={results.nodes} />
          <ItemResults nodes={results.nodes} edges={results.edges} />
        </Fragment>
      )}
    </Block>
  );
};

export default SearchPanel;
