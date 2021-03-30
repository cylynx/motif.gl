import React, { FC } from 'react';
import { Block } from 'baseui/block';
import StyledStepperItem from './StyledStepperItem';
import { StepperItems } from './types';

type StepperProps = {
  currentStep: number;
  onStepChange: (step: number) => void;
  items: StepperItems[];
};
const ProgressStepper: FC<StepperProps> = ({
  currentStep,
  onStepChange,
  items,
}) => {
  const onItemClick = (step: number, isClickable: boolean) => {
    if (isClickable === false) {
      return;
    }

    onStepChange(step);
  };

  const isStepActive = (step: number) => currentStep >= step;

  return (
    <Block
      display='flex'
      flexDirection='row'
      alignItems='flex-start'
      width='100%'
    >
      {items.map((item: StepperItems, index: number) => {
        const { children, isClickable } = item;
        const step = index + 1;
        const isDisabled = isClickable === false;
        return (
          <StyledStepperItem
            key={step}
            $isActive={isStepActive(step)}
            $isDisabled={isDisabled}
            onClick={() => onItemClick(step, isClickable)}
          >
            {children}
          </StyledStepperItem>
        );
      })}
    </Block>
  );
};

export default ProgressStepper;
