import React, { FC, useMemo, useContext } from 'react';
import { useStyletron } from 'baseui';
import { ParagraphSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import useSearchOption from '../../hooks/useSearchOption';
import { IUseSearchOptions } from '../../types';
import { SearchOptPagination } from '../../../../../redux/graph';
import { ITEM_PER_PAGE } from '../../../../../constants/widget-units';
import { GraphRefContext } from '../../../../Graph/context';
import useGraphBehaviors from '../../../../Graph/hooks/useGraphBehaviors';
import {
  DeleteButton,
  NextPageButton,
  PreviousPageButton,
} from './IconButtons';

export type ItemPaginationProps = {
  nodeLength: number;
  edgeLength: number;
};

const ItemPagination: FC<ItemPaginationProps> = ({
  nodeLength,
  edgeLength,
}) => {
  const [css, theme] = useStyletron();
  const { searchOptions, nextPage, previousPage, resetSearchOptions } =
    useSearchOption() as IUseSearchOptions;
  const { currentPage, totalPage } =
    searchOptions.pagination as SearchOptPagination;

  const { graph } = useContext(GraphRefContext);
  const { centerCanvas, clearNodeSelectedState, clearEdgeSelectedState } =
    useGraphBehaviors(graph);

  const endIndex = currentPage * ITEM_PER_PAGE;
  const startIndex = endIndex - ITEM_PER_PAGE + 1;
  const totalItems = nodeLength + edgeLength;
  const endText = endIndex < totalItems ? endIndex : totalItems;

  const isPreviousButtonDisplay = useMemo(() => {
    return currentPage !== 1;
  }, [currentPage]);

  const isNextButtonDisplay = useMemo(() => {
    return currentPage < totalPage;
  }, [currentPage, totalPage]);

  const displayText: string = useMemo(() => {
    const isEdgeResultEmpty = edgeLength === 0;
    const isNodeResultEmpty = nodeLength === 0;
    if (isEdgeResultEmpty && isNodeResultEmpty) {
      return '0 Item';
    }

    return `${startIndex}-${endText} of ${totalItems}`;
  }, [currentPage, nodeLength, edgeLength]);

  const clearButtonClick = () => {
    clearNodeSelectedState();
    clearEdgeSelectedState();
    centerCanvas();
    resetSearchOptions();
  };

  return (
    <Block color='primary300' position='absolute' width='100%' bottom='20px'>
      <hr
        className={css({ borderColor: theme.colors.contentInverseSecondary })}
      />
      <Block justifyContent='space-between' alignItems='center' display='flex'>
        <ParagraphSmall marginTop='0' marginBottom='0'>
          Results {displayText}
        </ParagraphSmall>

        <Block>
          <DeleteButton onClick={clearButtonClick} />
          <PreviousPageButton
            onClick={previousPage}
            disabled={!isPreviousButtonDisplay}
          />
          <NextPageButton onClick={nextPage} disabled={!isNextButtonDisplay} />
        </Block>
      </Block>
    </Block>
  );
};

export default ItemPagination;
