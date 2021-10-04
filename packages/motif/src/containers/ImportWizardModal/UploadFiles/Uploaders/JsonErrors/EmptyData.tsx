import React from 'react';
import { Block } from 'baseui/block';
import ErrorMessage from '../ErrorMessage';

const EmptyData = () => {
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

export default EmptyData;
