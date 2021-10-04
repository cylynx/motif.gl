import React from 'react';
import { Block } from 'baseui/block';
import ErrorMessage from '../ErrorMessage';

const RestrictedDataType = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          The uploaded datasets contain type column in node properties
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <b>
            <code>type</code>
          </b>{' '}
          is a reserve words used as identifiers to perform styling.
          <br />
          You can rename{' '}
          <b>
            <code>type</code>
          </b>{' '}
          column to{' '}
          <b>
            <code>node_type</code>
          </b>{' '}
          or{' '}
          <b>
            <code>types</code>
          </b>{' '}
          to import data successfully.
        </Block>
      }
    />
  );
};

export default RestrictedDataType;
