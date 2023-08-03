import { Theme } from 'baseui/theme';
import { styled } from 'baseui';
import React, { FC } from 'react';
import { Block } from 'baseui/block';
import { GraphAttribute } from '../../redux/graph';

type TableTabProps = { $theme?: Theme; $isActive: boolean };
const TableTab = styled<'div', TableTabProps, Theme>(
  'div',
  ({ $theme, $isActive }) => {
    const { backgroundPrimary, backgroundSecondary, contentPrimary, mono200 } =
      $theme.colors;
    const { scale0 } = $theme.sizing;
    return {
      paddingTop: $theme.sizing.scale300,
      paddingBottom: $theme.sizing.scale300,
      paddingLeft: $theme.sizing.scale500,
      paddingRight: $theme.sizing.scale500,
      color: contentPrimary,
      backgroundColor: $isActive ? backgroundSecondary : backgroundPrimary,
      borderWidth: $isActive ? scale0 : '2px',
      borderColor: $isActive ? contentPrimary : 'transparent',
      borderStyle: 'solid',
      ...$theme.typography.LabelSmall,
      ':hover': {
        backgroundColor: mono200,
        cursor: 'pointer',
      },
    };
  },
);

export type TableTabItem = { key: GraphAttribute; label: string };
type TableTabsProps = {
  items: TableTabItem[];
  activeKey: GraphAttribute;
  onClick: (targetKey: GraphAttribute) => void;
};
const TableTabs: FC<TableTabsProps> = ({ items, activeKey, onClick }) => {
  const isTabActive = (
    key: GraphAttribute,
    attribute: GraphAttribute,
  ): boolean => key === attribute;

  return (
    <Block
      display='inline-flex'
      backgroundColor='backgroundPrimary'
      alignItems='center'
      overrides={{
        Block: {
          style: ({ $theme }: { $theme: Theme }) => ({
            borderWidth: '1px',
            borderColor: $theme.colors.mono400,
            borderStyle: 'solid',
          }),
        },
      }}
    >
      {items.map((item) => {
        const { key, label } = item;
        return (
          <TableTab
            $isActive={isTabActive(activeKey, key)}
            key={key}
            onClick={() => onClick(key)}
          >
            {label}
          </TableTab>
        );
      })}
    </Block>
  );
};

export default TableTabs;
