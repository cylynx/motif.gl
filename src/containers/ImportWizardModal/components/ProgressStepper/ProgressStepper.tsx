import React, { FC } from 'react';
import { Block } from 'baseui/block';
import StyledStepperItem from './StyledStepperItem';

type StepperProps = { step: number };
const ProgressStepper: FC<StepperProps> = () => {
  return (
    <Block
      display='flex'
      flexDirection='row'
      alignItems='flex-start'
      width='100%'
    >
      <StyledStepperItem $isActive>1. Upload Files </StyledStepperItem>
      <StyledStepperItem $isActive={false}>
        2. Configure Files
      </StyledStepperItem>
    </Block>
  );
};

export default ProgressStepper;
