import React from 'react';
import { Block } from 'baseui/block';
import ProgressStepper from '../components/ProgressStepper';

const UploadFiles = () => {
  return (
    <Block>
      <ProgressStepper step={1} />
    </Block>
  );
};

export default UploadFiles;
