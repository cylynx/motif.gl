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
          Motif is unable to parse one of the datasets because the provided CSV
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
          Motif is unable to parse the datasets because one of the provided CSV
          files do not possess a single row.
        </Block>
      }
    />
  );
};
