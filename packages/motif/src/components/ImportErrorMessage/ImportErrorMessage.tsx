import React, { FC } from 'react';
import { Block } from 'baseui/block';
import { Theme } from 'baseui/theme';
import { LabelSmall } from 'baseui/typography';
import * as Icons from '../Icons';
import { ErrorMessageProps } from './type';

const ErrorMessage: FC<ErrorMessageProps> = ({ title, content }) => {
  return (
    <Block
      data-testid='error-message'
      marginTop='scale300'
      padding='scale300'
      backgroundColor='#AD52521F'
      overrides={{
        Block: {
          style: ({ $theme }: { $theme: Theme }) => ({
            borderRadius: $theme.sizing.scale200,
            borderWidth: '1px',
            borderColor: '#AD5252',
            borderStyle: 'solid',
          }),
        },
      }}
    >
      <LabelSmall
        color='#AD5252'
        marginTop='0'
        marginBottom='0'
        display='flex'
        alignItems='center'
      >
        <Icons.WarningSign color='#AD5252' size={18} />
        <Block as='span' marginLeft='scale300'>
          {title}
        </Block>
      </LabelSmall>

      <LabelSmall>{content}</LabelSmall>
    </Block>
  );
};

export default ErrorMessage;
