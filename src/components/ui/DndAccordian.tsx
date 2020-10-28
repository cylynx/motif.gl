/* eslint-disable */
import * as React from 'react';
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
import { StyledContent } from 'baseui/accordion';
import { Block } from 'baseui/block';
import { Grab, Delete } from 'baseui/icon';
//@ts-ignore
import { isFocusVisible, forkFocus, forkBlur } from 'baseui/utils/focusVisible';
import { Layer } from 'baseui/layer';
//@ts-ignore
import { ListPropsT, SharedStylePropsArgT } from 'baseui/dnd-list/types';

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
                    paddingBottom='scale200'
                    paddingTop='scale200'
                  >
                    <DragHandle {...sharedProps} {...dragHandleProps}>
                      <Grab size={24} color='#CCC' />
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
                  <StyledContent //@ts-ignore
                    $expanded={this.props.expanded.includes(value.key)}
                  >
                    {
                      //@ts-ignore
                      value.children
                    }
                  </StyledContent>
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
