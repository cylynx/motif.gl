import React from 'react';
import { Block } from 'baseui/block';
import ErrorMessage from '../../../components/ImportErrorMessage';

const BoldCodeText: React.FC = ({ children }) => {
  return (
    <b>
      <code>{children}</code>
    </b>
  );
};

export const EmptyData = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          The datasets provided are empty.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif unable to import your dataset because the provided JSON is
          empty.
        </Block>
      }
    />
  );
};

export const MissingNodeOrEdge = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid Motif JSON Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Uploaded dataset(s) does not contain{' '}
          <BoldCodeText>nodes</BoldCodeText> or{' '}
          <BoldCodeText>edges</BoldCodeText>.
        </Block>
      }
    />
  );
};

export const RestrictedDataType = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          The uploaded datasets contain type column in node properties
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <BoldCodeText>type</BoldCodeText> is a reserve words used as
          identifiers to perform styling.
          <br />
          You can rename <BoldCodeText>type</BoldCodeText> column to{' '}
          <BoldCodeText>node_type</BoldCodeText> or{' '}
          <BoldCodeText>types</BoldCodeText> to import data successfully.
        </Block>
      }
    />
  );
};
