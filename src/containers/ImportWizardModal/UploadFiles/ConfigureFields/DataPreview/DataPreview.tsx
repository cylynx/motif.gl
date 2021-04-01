import React, { FC, useState } from 'react';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import { styled } from 'baseui';
import { Theme } from 'baseui/theme';
import { GraphAttribute } from '../../../../../redux/graph';
import TablePreview from './TablePreview';

type TableTabProps = { $theme?: Theme; $isActive: boolean };
const TableTab = styled('div', ({ $theme, $isActive }: TableTabProps) => {
  const {
    backgroundPrimary,
    backgroundSecondary,
    contentPrimary,
    mono200,
  } = $theme.colors;
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

const TABLE_TABS: TableTabItem[] = [
  { key: 'nodes', label: 'Node' },
  { key: 'edges', label: 'Edge' },
];
type DataPreviewProps = { isEdgeGroupable: boolean };
const DataPreview: FC<DataPreviewProps> = ({ isEdgeGroupable }) => {
  const [activeTab, setActiveTab] = useState<GraphAttribute>('nodes');

  return (
    <Block marginTop='scale500'>
      <Block
        display='flex'
        justifyContent='space-between'
        alignItems='baseline'
      >
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
      <Block marginTop='scale300'>
        <TablePreview isEdgeGroupable={isEdgeGroupable} activeTab={activeTab} />
      </Block>
    </Block>
  );
};

export default DataPreview;
