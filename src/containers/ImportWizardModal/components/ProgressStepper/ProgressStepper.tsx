import React, { FC } from 'react';
import { Block } from 'baseui/block';
import StyledStepperItem from './StyledStepperItem';
import { StepperItems } from './types';

type StepperProps = {
  onStepChange: (step: number) => void;
  items: StepperItems[];
};
const ProgressStepper: FC<StepperProps> = ({ onStepChange, items }) => {
  const onItemClick = (step: number, isClickable: boolean) => {
    if (isClickable === false) {
      return;
    }

    onStepChange(step);
  };

  return (
    <Block
      display='flex'
      flexDirection='row'
      alignItems='flex-start'
      width='100%'
    >
      {items.map((item: StepperItems, index: number) => {
        const { children, disabled } = item;
        const step = index + 1;
        const isDisabled = disabled === false;
        const isStart = index === 0;
        const isEnd = index === items.length - 1;

        return (
          <StyledStepperItem
            key={step}
            $isDisabled={isDisabled}
            $isStart={isStart}
            $isEnd={isEnd}
            onClick={() => onItemClick(step, disabled)}
          >
            {children}
          </StyledStepperItem>
        );
      })}
    </Block>
  );
};

export default ProgressStepper;
