import React, { FC, useMemo } from 'react';
import { LabelXSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { Button, KIND, SIZE } from 'baseui/button';
import { Theme } from 'baseui/theme';
import * as Icon from '../../../../components/Icons';

export type ItemPaginationProps = {
  nodeLength: number;
  edgeLength: number;
};

const ItemPagination: FC<ItemPaginationProps> = ({
  nodeLength,
  edgeLength,
}) => {
  const displayText: string = useMemo(() => {
    const isEdgeResultEmpty = edgeLength === 0;
    const isNodeResultEmpty = nodeLength === 0;
    if (isEdgeResultEmpty && isNodeResultEmpty) {
      return '0 Item';
    }

    const totalItems = nodeLength + edgeLength;

    return `${totalItems}-${totalItems} of ${totalItems}`;
  }, [nodeLength, edgeLength]);

  return (
    <Block
      color='primary300'
      display='flex'
      paddingRight='scale300'
      paddingLeft='scale300'
      paddingTop='scale100'
      paddingBottom='scale100'
      backgroundColor='backgroundSecondary'
      justifyContent='space-between'
      overrides={{
        Block: {
          style: ({ $theme }: { $theme: Theme }) => ({
            borderBottomLeftRadius: $theme.sizing.scale300,
            borderBottomRightRadius: $theme.sizing.scale300,
            borderTopLeftRadius: $theme.sizing.scale300,
            borderTopRightRadius: $theme.sizing.scale300,
          }),
        },
      }}
    >
      <LabelXSmall
        color='contentSecondary'
        alignContent='center'
        paddingTop='scale100'
      >
        Showing result {displayText}
      </LabelXSmall>

      <Block>
        <Button
          onClick={() => alert('prev')}
          kind={KIND.secondary}
          size={SIZE.compact}
          disabled={false}
          overrides={{
            BaseButton: {
              style: ({ $theme }: { $theme: Theme }) => ({
                padding: $theme.sizing.scale0,
                borderTopLeftRadius: $theme.sizing.scale200,
                borderBottomLeftRadius: $theme.sizing.scale200,
                marginRight: $theme.sizing.scale0,
              }),
            },
          }}
        >
          <Icon.ChevronLeft />
        </Button>

        <Button
          onClick={() => alert('right')}
          kind={KIND.secondary}
          size={SIZE.compact}
          disabled={false}
          overrides={{
            BaseButton: {
              style: ({ $theme }: { $theme: Theme }) => ({
                padding: $theme.sizing.scale0,
                borderTopRightRadius: $theme.sizing.scale200,
                borderBottomRightRadius: $theme.sizing.scale200,
              }),
            },
          }}
        >
          <Icon.ChevronRight />
        </Button>
      </Block>
    </Block>
  );
};

export default ItemPagination;
