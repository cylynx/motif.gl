import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
import { HeadingMedium } from 'baseui/typography';

import SearchTabs from './Section/SearchTabs';
import ItemResults from './Section/ItemResults';
import ItemPagination from './Components/ItemPagination';
import useSearchOption from './hooks/useSearchOption';
import { SearchOptions } from '../../../redux/graph';

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
    <Block
      position='absolute'
      height='100%'
      width='inherit'
      data-testid='search-panel'
    >
      <Block>
        <HeadingMedium marginTop='scale300' marginBottom='scale300'>
          Search
        </HeadingMedium>
        <SearchTabs />
      </Block>
      {isResultEmpty === false && (
        <>
          <Block position='relative' height='calc(100% - 220px)'>
            <ItemResults />
          </Block>
          <ItemPagination
            nodeLength={nodeResultLength}
            edgeLength={edgeResultLength}
          />
        </>
      )}
    </Block>
  );
};

export default SearchPanel;
