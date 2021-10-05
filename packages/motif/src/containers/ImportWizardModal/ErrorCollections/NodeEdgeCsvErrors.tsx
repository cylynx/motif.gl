import { Block } from 'baseui/block';
import React from 'react';
import ErrorMessage from '../../../components/ImportErrorMessage';

export const InvalidNodeCsvFormat = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid Node CSV Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif unable to parse the one of the dataset because the provided Node
          CSV file is invalid.
        </Block>
      }
    />
  );
};

export const InvalidEdgeCsvFormat = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid Edge CSV Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif unable to parse one of the dataset because the provided Edge CSV
          file is invalid.
        </Block>
      }
    />
  );
};

export const EmptyNodeCsvRow = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid Node CSV Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif unable to parse one of the dataset because the provided Node CSV
          does not contain a single row.
        </Block>
      }
    />
  );
};

export const EmptyEdgeCsvRow = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid Edge CSV Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif unable to parse one of the dataset because the provided Edge CSV
          does not contain a single row.
        </Block>
      }
    />
  );
};
