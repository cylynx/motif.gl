// @ts-nocheck
import React, { useMemo } from 'react';
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
  // e.g. table_graphList_1_nodes
  const [, key, index, types] = dataKey.split('_');

  const graphData: Graph.GraphData = useSelector((state) => {
    if (key === 'graphList') {
      return getGraph(state).graphList[Number(index)];
    }

    return getGraph(state)[key];
  });

  const rows = graphData[types].map((r: Graph.EdgeNode) => ({
    id: r.id,
    data: r,
  }));

  const columns = graphData2Columns(graphData.metadata.fields[types]);

  return (
    <Block height='600px' width='800px' paddingBottom='18px'>
      <StatefulDataTable columns={columns} rows={rows} />
    </Block>
  );
};

export default DataTable;
