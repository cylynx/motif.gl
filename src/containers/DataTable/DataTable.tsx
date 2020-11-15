// @ts-nocheck
import React from 'react';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import {
  StatefulDataTable,
  BooleanColumn,
  CategoricalColumn,
  CustomColumn,
  NumericalColumn,
  StringColumn,
  COLUMNS,
  NUMERICAL_FORMATS,
} from 'baseui/data-table';
import { getGraph } from '../../redux';
import { ALL_FIELD_TYPES } from '../../processors/data-processors';
import * as Graph from '../Graph/types';

export const FIELDS_COLUMN_MAP = {
  [ALL_FIELD_TYPES.boolean]: (title, mapDataToValue) =>
    BooleanColumn({
      title,
      mapDataToValue,
    }),
  [ALL_FIELD_TYPES.date]: (title, mapDataToValue) =>
    DatetimeColumn({
      title,
      mapDataToValue,
    }),
  [ALL_FIELD_TYPES.integer]: (title, mapDataToValue) =>
    NumericalColumn({
      title,
      mapDataToValue,
    }),
  [ALL_FIELD_TYPES.real]: (title, mapDataToValue) =>
    NumericalColumn({
      title,
      mapDataToValue,
    }),
  [ALL_FIELD_TYPES.string]: (title, mapDataToValue) =>
    StringColumn({
      title,
      mapDataToValue,
    }),
  [ALL_FIELD_TYPES.timestamp]: (title, mapDataToValue) =>
    DatetimeColumn({
      title,
      mapDataToValue,
    }),
  [ALL_FIELD_TYPES.array]: (title, mapDataToValue) =>
    StringColumn({
      title,
      mapDataToValue,
    }),
};

export const graphData2Columns = (
  fields: Graph.Field[] | [],
  kind = 'nodes',
) => {
  const columns = [];
  // Defaults
  columns.push(FIELDS_COLUMN_MAP.string('id', (data) => data.id));
  if (kind === 'edges') {
    columns.push(FIELDS_COLUMN_MAP.string('source', (data) => data.source));
    columns.push(FIELDS_COLUMN_MAP.string('target', (data) => data.target));
  }
  // Additional fields from metadata
  if (fields.length > 0) {
    fields.forEach((field) => {
      columns.push(
        FIELDS_COLUMN_MAP[field.type](field.name, (data) =>
          get(data, `${field.name}`),
        ),
      );
    });
  }
  return columns;
};

const DataTable = ({ dataKey }: { dataKey: string }) => {
  const dataPath = dataKey.split('_'); // e.g. table_graphList_1_nodes
  const graphData = useSelector((state) =>
    dataPath[1] === 'graphList'
      ? getGraph(state).graphList[Number(dataPath[2])]
      : getGraph(state)[dataPath[1]],
  );
  // Need to do a mapping as the mapDataToValue function gets from row.data
  let data;
  let graphColumns;
  if (dataPath[dataPath.length - 1] === 'nodes') {
    data = graphData.nodes.map((r) => ({ id: r.id, data: r }));
    graphColumns = graphData2Columns(graphData.metadata.fields.nodes, 'nodes');
  } else if (dataPath[dataPath.length - 1] === 'edges') {
    data = graphData.edges.map((r) => ({ id: r.id, data: r }));
    graphColumns = graphData2Columns(graphData.metadata.fields.edges, 'edges');
  }
  return (
    <Block height='600px' width='800px' paddingBottom='18px'>
      <StatefulDataTable columns={graphColumns} rows={data} />
    </Block>
  );
};

export default DataTable;
