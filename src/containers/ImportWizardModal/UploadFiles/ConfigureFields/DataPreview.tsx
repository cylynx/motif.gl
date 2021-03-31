import React from 'react';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';

const DataPreview = () => {
  return (
    <Block display='flex' justifyContent='space-between'>
      <LabelXSmall
        color='#4D6A83'
        overrides={{ Block: { style: { textTransform: 'uppercase' } } }}
      >
        uploaded data preview
      </LabelXSmall>
    </Block>
  );
};

export default DataPreview;
