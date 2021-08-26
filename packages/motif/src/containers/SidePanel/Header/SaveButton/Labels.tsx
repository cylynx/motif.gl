import { Block } from 'baseui/block';
import React from 'react';
import { ParagraphSmall } from 'baseui/typography';
import * as Icons from '../../../../components/Icons';
import { LabelProps } from './types';

export const JsonAttachment = ({ theme }: LabelProps) => (
  <Block display='flex' alignItems='center'>
    <Icons.FileCode color={theme.colors.contentTertiary} />

    <ParagraphSmall
      color='contentTertiary'
      marginLeft='scale300'
      marginTop='0'
      marginBottom='0'
    >
      Export to JSON
    </ParagraphSmall>
  </Block>
);

export const CloudUpload = ({ theme }: LabelProps) => (
  <Block display='flex' alignItems='center'>
    <Icons.UploadCloud color={theme.colors.contentTertiary} />

    <ParagraphSmall
      color='contentTertiary'
      marginLeft='scale300'
      marginTop='0'
      marginBottom='0'
    >
      Save to Cloud
    </ParagraphSmall>
  </Block>
);
