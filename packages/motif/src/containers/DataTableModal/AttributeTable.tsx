import React, { FC } from 'react';
import { StatefulDataTable } from 'baseui/data-table';
import { GraphData, EdgeNode, GraphAttribute } from '../../redux/graph';
import { graphData2Columns } from './utils';

// https://github.com/uber/baseweb/blob/master/src/data-table/types.js#L51

type AttributeTableProps = { graphData: GraphData; types: GraphAttribute };
const AttributeTable: FC<AttributeTableProps> = ({ graphData, types }) => {
  const rows = (graphData[types] as EdgeNode[]).map((r: EdgeNode) => ({
    id: r.id,
    data: r,
  }));

  const columns = graphData2Columns(graphData.metadata.fields[types]);

  return <StatefulDataTable columns={columns} rows={rows} />;
};

export default AttributeTable;
