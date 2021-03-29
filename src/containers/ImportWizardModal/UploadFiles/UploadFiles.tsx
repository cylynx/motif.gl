import React from 'react';
import { Block } from 'baseui/block';

import ProgressStepper from '../components/ProgressStepper';

import DataTypeSelection from './Uploaders/DataTypeSelection';

const UploadFiles = () => {
  return (
    <Block>
      <ProgressStepper step={1} />

      <Block position='relative'>
        <DataTypeSelection />
      </Block>
    </Block>
  );
};

export default UploadFiles;
