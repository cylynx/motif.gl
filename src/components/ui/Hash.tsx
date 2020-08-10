import React from 'react';

import { ParagraphSmall } from 'baseui/typography';
import { BlockProps } from 'baseui/block';
import { Button } from 'baseui/button';
import { FaRegCopy } from 'react-icons/fa';
import useClipboard from './UseClipboard';

type HashProps = JSX.IntrinsicElements['div'] &
  BlockProps & {
    text: string;
    copyText?: string;
  };

const Hash = ({ text, copyText, ...rest }: HashProps) => {
  const { onCopy } = useClipboard(copyText || text);

  const onClick = () => {
    onCopy();
  };

  return (
    <ParagraphSmall {...rest}>
      {text}{' '}
      <Button onClick={onClick} shape='round' size='mini' kind='secondary'>
        <FaRegCopy />
      </Button>
    </ParagraphSmall>
  );
};

export default Hash;
