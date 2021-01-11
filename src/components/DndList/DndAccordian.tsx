/* eslint-disable */
import * as React from 'react';
import { styled } from 'baseui';
//@ts-ignore
import { getOverrides } from 'baseui/helpers/overrides.js';
import {
  StyledRoot,
  StyledList,
  StyledItem,
  StyledDragHandle,
  StyledCloseHandle,
  StyledLabel,
} from 'baseui/dnd-list';
import { List as MovableList } from 'react-movable';
import { Block } from 'baseui/block';
import { Grab, Delete } from 'baseui/icon';
//@ts-ignore
import { isFocusVisible, forkFocus, forkBlur } from 'baseui/utils/focusVisible';
import { Layer } from 'baseui/layer';
//@ts-ignore
import { ListPropsT, SharedStylePropsArgT } from 'baseui/dnd-list/types';

// https://github.com/uber/baseweb/blob/master/src/accordion/styled-components.js
export const Content = styled('div', (props) => {
  const {
    $theme: { animation, colors, sizing, typography },
    //@ts-ignore
    $expanded,
  } = props;
  return {
    ...typography.font200,
    backgroundColor: colors.listBodyFill,
    color: colors.contentPrimary,
    paddingTop: $expanded ? sizing.scale550 : 0,
    paddingBottom: $expanded ? sizing.scale550 : 0,
    paddingLeft: sizing.scale500,
    paddingRight: sizing.scale500,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    borderBottomWidth: '1px',
    borderBottomStyle: $expanded ? 'solid' : 'none',
    borderBottomColor: colors.border,
    boxSizing: 'border-box',
    height: $expanded ? 'auto' : 0,
    maxHeight: $expanded ? '100%' : 0,
    overflow: 'hidden',
    transitionProperty: 'all',
    transitionDuration: animation.timing400,
    transitionTimingFunction: animation.easeInOutCurve,
  };
});

const ItemLayer = ({
  children,
  dragged,
}: {
  children: React.ReactNode;
  dragged: boolean;
}): JSX.Element => {
  if (!dragged) {
    //@ts-ignore
    return children;
  }
  return <Layer>{children}</Layer>;
};

class DndAccordian extends React.Component<
  ListPropsT,
  { isFocusVisible: boolean }
> {
  static defaultProps: ListPropsT = {
    items: [],
    onChange: () => {},
  };

  //@ts-ignore
  state = { isFocusVisible: false };

  handleFocus = (event: React.SyntheticEvent) => {
    if (isFocusVisible(event)) {
      this.setState({ isFocusVisible: true });
    }
  };

  handleBlur = () => {
    if (this.state.isFocusVisible !== false) {
      this.setState({ isFocusVisible: false });
    }
  };

  render() {
    const { overrides = {}, items, onChange, removable } = this.props;
    const {
      Root: RootOverride,
      List: ListOverride,
      Item: ItemOverride,
      DragHandle: DragHandleOverride,
      CloseHandle: CloseHandleOverride,
      Label: LabelOverride,
    } = overrides;
    const [Root, rootProps] = getOverrides(RootOverride, StyledRoot);
    const [List, listProps] = getOverrides(ListOverride, StyledList);
    const [Item, itemProps] = getOverrides(ItemOverride, StyledItem);
    const [DragHandle, dragHandleProps] = getOverrides(
      DragHandleOverride,
      StyledDragHandle,
    );
    const [CloseHandle, closeHandleProps] = getOverrides(
      CloseHandleOverride,
      StyledCloseHandle,
    );
    const [Label, labelProps] = getOverrides(LabelOverride, StyledLabel);
    const isRemovable = this.props.removable || false;
    const isRemovableByMove = this.props.removableByMove || false;
    return (
      <Root
        $isRemovable={isRemovable}
        data-baseweb='dnd-list'
        {...rootProps}
        onFocus={forkFocus(rootProps, this.handleFocus)}
        onBlur={forkBlur(rootProps, this.handleBlur)}
      >
        <MovableList
          removableByMove={isRemovableByMove}
          values={items}
          onChange={onChange}
          renderList={({ children, props, isDragged }) => (
            <List
              $isRemovable={isRemovable}
              $isDragged={isDragged}
              ref={props.ref}
              {...listProps}
            >
              {children}
            </List>
          )}
          renderItem={({
            value,
            props,
            isDragged,
            isSelected,
            isOutOfBounds,
            index,
          }) => {
            const sharedProps: SharedStylePropsArgT = {
              $isRemovable: isRemovable,
              $isRemovableByMove: isRemovableByMove,
              $isDragged: isDragged,
              $isSelected: isSelected,
              //@ts-ignore
              $isFocusVisible: this.state.isFocusVisible,
              $isOutOfBounds: isOutOfBounds,
              $value: value,
              $index: index,
            };
            return (
              <ItemLayer dragged={isDragged} key={props.key}>
                <Item
                  {...sharedProps}
                  ref={props.ref}
                  tabIndex={props.tabIndex}
                  aria-roledescription={props['aria-roledescription']}
                  onKeyDown={props.onKeyDown}
                  onWheel={props.onWheel}
                  {...itemProps}
                  style={{ ...props.style, display: 'block' }}
                >
                  <Block
                    display='flex'
                    paddingLeft='scale200'
                    paddingRight='scale200'
                  >
                    <DragHandle {...sharedProps} {...dragHandleProps}>
                      <Grab size={20} color='#CCC' />
                    </DragHandle>
                    <Label {...sharedProps} {...labelProps}>
                      {value}
                    </Label>
                    {removable && (
                      <CloseHandle
                        {...sharedProps}
                        onClick={(evt: any) => {
                          evt.preventDefault();
                          onChange &&
                            onChange({
                              oldIndex:
                                typeof index !== 'undefined' ? index : 0,
                              newIndex: -1,
                            });
                        }}
                        {...closeHandleProps}
                      >
                        <Delete size={24} color='#CCC' />
                      </CloseHandle>
                    )}
                  </Block>
                  <Content //@ts-ignore
                    $expanded={this.props.expanded.includes(value.key)}
                  >
                    {
                      //@ts-ignore
                      value.children
                    }
                  </Content>
                </Item>
              </ItemLayer>
            );
          }}
        />
      </Root>
    );
  }
}

export default DndAccordian;
