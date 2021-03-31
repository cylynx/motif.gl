import React, { FC, useState } from 'react';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import { styled } from 'baseui';
import { Theme } from 'baseui/theme';
import { GraphAttribute } from '../../../../redux/graph';

type TableTabProps = { $theme?: Theme; $isActive: boolean };
const TableTab = styled('div', ({ $theme, $isActive }: TableTabProps) => {
  const {
    backgroundPrimary,
    backgroundSecondary,
    contentPrimary,
    mono400,
  } = $theme.colors;
  const { scale0 } = $theme.sizing;
  return {
    padding: $theme.sizing.scale300,
    color: '#112B42',
    backgroundColor: $isActive ? backgroundSecondary : backgroundPrimary,
    borderWidth: $isActive ? 1 : scale0,
    borderColor: $isActive ? contentPrimary : mono400,
    borderStyle: 'solid',
  };
});

type TableTabItem = { key: GraphAttribute; label: string };
type TableTabsProps = {
  items: TableTabItem[];
  activeKey: GraphAttribute;
  onClick: (targetKey: GraphAttribute) => void;
};
const TableTabs: FC<TableTabsProps> = ({ items, activeKey, onClick }) => {
  const isTabActive = (
    activeKey: GraphAttribute,
    attribute: GraphAttribute,
  ): boolean => activeKey === attribute;

  return (
    <Block display='flex' width='auto'>
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

const TABLE_TABS: TableTabItem[] = [
  { key: 'nodes', label: 'Nodes' },
  { key: 'edges', label: 'Edges' },
];
const DataPreview = () => {
  const [activeTab, setActiveTab] = useState<GraphAttribute>('nodes');

  return (
    <Block display='flex' justifyContent='space-between' alignItems='baseline'>
      <LabelXSmall
        color='#4D6A83'
        overrides={{ Block: { style: { textTransform: 'uppercase' } } }}
      >
        uploaded data preview
      </LabelXSmall>

      <TableTabs
        items={TABLE_TABS}
        activeKey={activeTab}
        onClick={setActiveTab}
      />
    </Block>
  );
};

export default DataPreview;
