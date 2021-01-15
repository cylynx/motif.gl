// @ts-nocheck
import React from 'react';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import {
  StatefulDataTable,
  BooleanColumn,
  NumericalColumn,
  StringColumn,
  CustomColumn,
} from 'baseui/data-table';
import { DATA_TYPES as AnalyzerDataTypes } from 'type-analyzer';
import { format } from 'date-fns';
import { getGraph } from '../../redux';
import * as Graph from '../Graph/types';

export const FIELDS_COLUMN_MAP = {
  [AnalyzerDataTypes.BOOLEAN]: (title, mapDataToValue) =>
    BooleanColumn({
      title,
      mapDataToValue,
    }),
  [AnalyzerDataTypes.DATE]: (title, mapDataToValue) =>
    CustomColumn({
      title,
      mapDataToValue,
      renderCell: function Cell(props: any) {
        const { value } = props;
        if (!value) return '';

        const date: Date = new Date(value);
        return <span>{format(date, 'dd/MM/yyyy')}</span>;
      },
    }),
  [AnalyzerDataTypes.INT]: (title, mapDataToValue) =>
    NumericalColumn({
      title,
      mapDataToValue,
    }),
  [AnalyzerDataTypes.NUMBER]: (title, mapDataToValue) =>
    NumericalColumn({
      title,
      mapDataToValue,
    }),
  [AnalyzerDataTypes.FLOAT]: (title, mapDataToValue) =>
    NumericalColumn({
      title,
      mapDataToValue,
    }),
  [AnalyzerDataTypes.STRING]: (title, mapDataToValue) =>
    StringColumn({
      title,
      mapDataToValue,
    }),
  [AnalyzerDataTypes.DATETIME]: (title, mapDataToValue) =>
    CustomColumn({
      title,
      mapDataToValue,
      minWidth: 160,
      renderCell: function Cell(props: any) {
        const { value } = props;
        if (!value) return '';

        const date: Date = new Date(value);
        return <span>{format(date, 'dd/MM/yyyy HH:MM:ss')}</span>;
      },
    }),
  [AnalyzerDataTypes.TIME]: (title, mapDataToValue) =>
    StringColumn({
      title,
      mapDataToValue,
    }),
  [AnalyzerDataTypes.ARRAY]: (title, mapDataToValue) =>
    StringColumn({
      title,
      mapDataToValue,
    }),
};

export const graphData2Columns = (fields: Graph.Field[]) => {
  const columns: Graph.Field[] = fields.map((field: Graph.Field) => {
    const { analyzerType, name } = field;

    if (analyzerType === AnalyzerDataTypes.DATE) {
      return FIELDS_COLUMN_MAP[analyzerType](name, (data) => {
        const dateProperty: string | undefined = get(data, name);
        if (!dateProperty) return '';

        return dateTimeProperty;
      });
    }

    if (analyzerType === AnalyzerDataTypes.DATETIME) {
      return FIELDS_COLUMN_MAP[analyzerType](name, (data) => {
        const dateTimeProperty: string | undefined = get(data, name);
        if (!dateTimeProperty) return '';

        return dateTimeProperty;
      });
    }

    if (
      [
        AnalyzerDataTypes.INT,
        AnalyzerDataTypes.BOOLEAN,
        AnalyzerDataTypes.FLOAT,
        AnalyzerDataTypes.NUMBER,
      ].includes(analyzerType)
    ) {
      return FIELDS_COLUMN_MAP[analyzerType](name, (data) => {
        const numberProperty: number | undefined = Number(get(data, name));

        if (Number.isNaN(numberProperty)) return '';

        return numberProperty;
      });
    }

    if (AnalyzerDataTypes.ARRAY === analyzerType) {
      return FIELDS_COLUMN_MAP[analyzerType](name, (data) => {
        const arrProperty: any[] | undefined = get(data, name);
        return `${arrProperty}` ?? '';
      });
    }

    /**
     * AnalyzerDataTypes:
     * 1. STRING
     */
    return FIELDS_COLUMN_MAP[analyzerType](
      name,
      (data) => get(data, name) ?? '',
    );
  });

  return columns;
};

const DataTable = ({ dataKey }: { dataKey: string }) => {
  const [, key, index, types] = dataKey.split('_'); // e.g. table_graphList_1_nodes
  const graphData = useSelector((state) =>
    key === 'graphList'
      ? getGraph(state).graphList[Number(index)]
      : getGraph(state)[key],
  );
  // Need to do a mapping as the mapDataToValue function gets from row.data
  let data;
  let graphColumns;
  if (types === 'nodes') {
    data = graphData.nodes.map((r) => ({ id: r.id, data: r }));
    graphColumns = graphData2Columns(graphData.metadata.fields.nodes);
  } else if (types === 'edges') {
    data = graphData.edges.map((r) => ({ id: r.id, data: r }));
    graphColumns = graphData2Columns(graphData.metadata.fields.edges);
  }
  return (
    <Block height='600px' width='800px' paddingBottom='18px'>
      <StatefulDataTable columns={graphColumns} rows={data} />
    </Block>
  );
};

export default DataTable;
