// @ts-nocheck
import React from 'react';
import get from 'lodash/get';
import { DATA_TYPES as AnalyzerDataTypes } from 'type-analyzer';
import { format } from 'date-fns';
import {
  BooleanColumn,
  CustomColumn,
  NumericalColumn,
  StringColumn,
} from 'baseui/data-table';
import { Field } from '../../redux/graph';

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

/**
 * Convert graph data to datatable columns
 *
 * @param fields
 */
export const graphData2Columns = (fields: Field[]) => {
  const columns: Field[] = fields.map((field: Field) => {
    const { analyzerType, name } = field;

    if (analyzerType === AnalyzerDataTypes.DATE) {
      return FIELDS_COLUMN_MAP[analyzerType](name, (data) => {
        const dateProperty: string | undefined = get(data, name);
        if (!dateProperty) return '';

        return dateProperty;
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
