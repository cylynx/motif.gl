import React, { useMemo } from 'react';

import { Block } from 'baseui/block';
import MainSection from './Section/MainSection';
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
    <Block position='absolute' height='100%' width='inherit'>
      <Block
        paddingLeft='scale550'
        paddingRight='scale550'
        paddingTop='scale550'
        paddingBottom='scale200'
      >
        <MainSection />
      </Block>

      {isResultEmpty === false && (
        <Block position='relative' height='calc(100% - 94px)'>
          <ItemResults nodes={results.nodes} edges={results.edges} />
          <ItemPagination
            nodeLength={nodeResultLength}
            edgeLength={edgeResultLength}
          />
        </Block>
      )}
    </Block>
  );
};

export default SearchPanel;
