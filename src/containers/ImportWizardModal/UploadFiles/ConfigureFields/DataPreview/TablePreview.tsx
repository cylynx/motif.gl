import React, { FC, useMemo } from 'react';
import { Table } from 'baseui/table-semantic';
import { Theme } from 'baseui/theme';
import { uniq, flatten, isObject } from 'lodash';
import useFileContent from '../../hooks/useFileContents';
import { EdgeNode, GraphAttribute } from '../../../../../redux/graph';

type TablePreviewProps = {
  isEdgeGroupable: boolean;
  activeTab: GraphAttribute;
};
const TablePreview: FC<TablePreviewProps> = ({
  activeTab,
  isEdgeGroupable = false,
}) => {
  const { fileUpload } = useFileContent();

  const graphAttributeData: EdgeNode[] = useMemo(() => {
    return fileUpload.dataPreview[activeTab] ?? [];
  }, [fileUpload.dataPreview, activeTab]);

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
            maxHeight: isEdgeGroupable ? '265px' : '360px',
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
