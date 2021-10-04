import React from 'react';
import { Block } from 'baseui/block';
import ErrorMessage from '../ErrorMessage';

const BoldCodeText: React.FC = ({ children }) => {
  return (
    <b>
      <code>{children}</code>
    </b>
  );
};

const MissingNodeOrEdge = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid JSON Format.
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

export default MissingNodeOrEdge;
