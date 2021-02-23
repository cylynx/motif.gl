import React, { FC, useMemo } from 'react';
import { ParagraphXSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Button, KIND, SIZE } from 'baseui/button';
import { Theme } from 'baseui/theme';
import * as Icon from '../../../../components/Icons';
import useSearchOption from '../hooks/useSearchOption';
import { IUseSearchOptions } from '../types';
import { SearchOptPagination } from '../../../../redux/graph';
import { ITEM_PER_PAGE } from '../../../../constants/widget-units';

export type ItemPaginationProps = {
  nodeLength: number;
  edgeLength: number;
};

const ItemPagination: FC<ItemPaginationProps> = ({
  nodeLength,
  edgeLength,
}) => {
  const { searchOptions } = useSearchOption() as IUseSearchOptions;
  const {
    currentPage,
    totalPage,
    totalItems,
  } = searchOptions.pagination as SearchOptPagination;

  const endIndex = currentPage * ITEM_PER_PAGE;
  const startIndex = endIndex - ITEM_PER_PAGE + 1;
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

    const totalItems = nodeLength + edgeLength;

    return `${startIndex}-${endText} of ${totalItems}`;
  }, [nodeLength, edgeLength]);

  const onLeftClick = () => {};
  const onRightClick = () => {};

  return (
    <Block
      color='primary300'
      backgroundColor='backgroundSecondary'
      position='absolute'
      width='100%'
      bottom='0'
      overrides={{
        Block: {
          style: ({ $theme }: { $theme: Theme }) => ({
            boxShadow: `-4px 2px 6px 2px ${$theme.colors.backgroundInverseSecondary}`,
          }),
        },
      }}
    >
      <Block
        paddingTop='scale300'
        paddingBottom='scale300'
        paddingRight='scale300'
        paddingLeft='scale300'
        justifyContent='space-between'
        display='flex'
      >
        <ParagraphXSmall
          color='contentSecondary'
          marginTop='0'
          marginBottom='0'
        >
          Showing result {displayText}
        </ParagraphXSmall>

        <Block>
          {isPreviousButtonDisplay && (
            <Button
              onClick={onLeftClick}
              kind={KIND.secondary}
              size={SIZE.compact}
              disabled={false}
              overrides={{
                BaseButton: {
                  style: ({ $theme }: { $theme: Theme }) => ({
                    paddingTop: $theme.sizing.scale0,
                    paddingBottom: $theme.sizing.scale0,
                    paddingRight: $theme.sizing.scale0,
                    paddingLeft: $theme.sizing.scale0,
                    borderTopLeftRadius: $theme.sizing.scale200,
                    borderBottomLeftRadius: $theme.sizing.scale200,
                    marginRight: $theme.sizing.scale0,
                  }),
                },
              }}
            >
              <Icon.ChevronLeft />
            </Button>
          )}

          {isNextButtonDisplay && (
            <Button
              onClick={onRightClick}
              kind={KIND.secondary}
              size={SIZE.compact}
              disabled={false}
              overrides={{
                BaseButton: {
                  style: ({ $theme }: { $theme: Theme }) => ({
                    paddingTop: $theme.sizing.scale0,
                    paddingBottom: $theme.sizing.scale0,
                    paddingRight: $theme.sizing.scale0,
                    paddingLeft: $theme.sizing.scale0,
                    borderTopRightRadius: $theme.sizing.scale200,
                    borderBottomRightRadius: $theme.sizing.scale200,
                  }),
                },
              }}
            >
              <Icon.ChevronRight />
            </Button>
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default ItemPagination;
