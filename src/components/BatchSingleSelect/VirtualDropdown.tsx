import React from 'react';
import { withStyle } from 'baseui';
import { Block } from 'baseui/block';
import { StyledDropdownListItem } from 'baseui/select';
import { StyledList, OptionListProps } from 'baseui/menu';
import { FixedSizeList } from 'react-window';
import { LabelXSmall } from 'baseui/typography';

const LIST_ITEM_HEIGHT = 36;
const MAX_LIST_HEIGHT = 300;

const ListItem = withStyle(StyledDropdownListItem, ({ $theme }) => ({
  paddingTop: 0,
  paddingBottom: 0,
  display: 'flex',
  alignItems: 'center',
  ':hover': {
    backgroundColor: $theme.colors.mono700,
  },
  ':focus': {
    backgroundColor: $theme.colors.mono700,
  },
}));

const FixedSizeListItem = ({
  data,
  index,
  style,
}: {
  data: { props: OptionListProps }[];
  index: number;
  style: React.CSSProperties;
}) => {
  const {
    item,
    overrides,
    renderAll,
    resetMenu,
    onMouseEnter,
    getChildMenu,
    renderHrefAsAnchor,
    getItemLabel,
    ...restProps
  } = data[index].props;
  return (
    <ListItem
      key={item.id}
      style={{
        boxSizing: 'border-box',
        ...style,
      }}
      {...restProps}
    >
      {item.id}
    </ListItem>
  );
};
const VirtualDropdown = React.forwardRef((props: any, ref) => {
  const children = React.Children.toArray(props.children);
  // @ts-ignore
  if (!children[0] || !children[0].props.item) {
    return (
      <StyledList ref={ref}>
        <Block
          margin='0 auto'
          color='contentSecondary'
          paddingTop='scale300'
          paddingLeft='scale300'
        >
          <LabelXSmall>No Results Found.</LabelXSmall>
        </Block>
      </StyledList>
    );
  }

  const height = Math.min(MAX_LIST_HEIGHT, children.length * LIST_ITEM_HEIGHT);
  return (
    <StyledList
      $style={{ height: `${height}px`, overflowX: 'none !important' }}
      ref={ref}
    >
      <FixedSizeList
        width='100%'
        height={height}
        itemCount={children.length}
        itemData={children}
        itemKey={(index: number, data: { props: OptionListProps }[]) =>
          data[index].props.item.id
        }
        itemSize={LIST_ITEM_HEIGHT}
      >
        {FixedSizeListItem}
      </FixedSizeList>
    </StyledList>
  );
});

export default VirtualDropdown;
