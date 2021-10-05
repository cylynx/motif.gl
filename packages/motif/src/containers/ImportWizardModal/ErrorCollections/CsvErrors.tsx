import { Block } from 'baseui/block';
import React from 'react';
import ErrorMessage from '../../../components/ImportErrorMessage';

export const InvalidCsvFormat = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid CSV Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif unable to parse one of the dataset because the provided CSV
          format is invalid.
        </Block>
      }
    />
  );
};

export const EmptyCsvRow = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid CSV Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif unable to parse the dataset because one of the provided CSV file
          do not possess single row.
        </Block>
      }
    />
  );
};
