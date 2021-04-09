import React, { FC, useMemo } from 'react';
import { flatten, isObject, uniq } from 'lodash';
import { Table } from 'baseui/table-semantic';
import { Theme } from 'baseui/theme';
import { EdgeNode, GraphAttribute, GraphData } from '../../redux/graph';

type TablePreviewProps = {
  isEdgeGroupable: boolean;
  activeTab: GraphAttribute;
  graphData: GraphData;
};
const TablePreview: FC<TablePreviewProps> = ({
  activeTab,
  isEdgeGroupable = false,
  graphData = { nodes: [], edges: [] },
}) => {
  const graphAttributeData: EdgeNode[] = useMemo(() => {
    return graphData[activeTab] ?? [];
  }, [graphData, activeTab]);

  const columns: string[] = useMemo(() => {
    if (graphAttributeData.length === 0) return [];

    const columnKey = graphAttributeData.map((attribute: EdgeNode) =>
      Object.keys(attribute),
    );
    const flattenColumns = flatten(columnKey);
    const uniqueColumns = uniq(flattenColumns);
    return uniqueColumns;
  }, [graphAttributeData]);

  const data = useMemo(() => {
    const cleanedGraphValues = graphAttributeData
      .slice(0, 50)
      .map((attr: EdgeNode) =>
        Object.values(attr).map((value) => {
          // allow us to render objects in React :D
          if (isObject(value)) {
            return JSON.stringify(value);
          }

          return value;
        }),
      );

    return cleanedGraphValues;
  }, [graphAttributeData]);

  return (
    <Table
      columns={columns}
      data={data}
      overrides={{
        Root: {
          style: ({ $theme }: { $theme: Theme }) => ({
            position: 'absolute',
            width: '100%',
            height: 'auto',
            maxHeight: `calc(100% - ${isEdgeGroupable ? '389px' : '295px'})`,
            '::-webkit-scrollbar': {
              height: $theme.sizing.scale100,
              width: $theme.sizing.scale100,
            },
            '::-webkit-scrollbar-track': {
              background: '#f1f1f1',
            },
            '::-webkit-scrollbar-thumb': {
              background: '#595f6d',
            },
          }),
        },
        TableHeadCell: {
          style: ({ $theme }: { $theme: Theme }) => ({
            fontSize: $theme.sizing.scale500,
            paddingTop: $theme.sizing.scale200,
            paddingBottom: $theme.sizing.scale200,
            paddingLeft: $theme.sizing.scale300,
            paddingRight: $theme.sizing.scale300,
          }),
        },
        TableBodyRow: {
          style: ({ $theme }: { $theme: Theme }) => ({
            fontSize: $theme.sizing.scale300,
            borderBottom: '1px solid lightgrey',
          }),
        },
        TableBodyCell: {
          style: ({ $theme }: { $theme: Theme }) => ({
            fontSize: $theme.sizing.scale500,
            paddingTop: $theme.sizing.scale100,
            paddingBottom: $theme.sizing.scale100,
            paddingLeft: $theme.sizing.scale300,
            paddingRight: $theme.sizing.scale300,
          }),
        },
      }}
    />
  );
};
export default TablePreview;
