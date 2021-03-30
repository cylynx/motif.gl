import React, { useMemo } from 'react';
import { Block } from 'baseui/block';

import ProgressStepper, {
  useStepper,
  StepperItems,
} from '../components/ProgressStepper';
import DataTypeSelection from './Uploaders/DataTypeSelection';
import useFileContents from './hooks/useFileContents';

const Sample = () => <div>Sample</div>;

const UploadFiles = () => {
  const { currentStep, setCurrentStep, nextStep } = useStepper(1, 2);
  const { state } = useFileContents();

  const onStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const stepperItems: StepperItems[] = useMemo(() => {
    const isContainAttachment = state.attachments.length !== 0;
    return [
      {
        children: '1. Upload Files',
        isClickable: true,
      },
      {
        children: '2. Configure Fields',
        isClickable: isContainAttachment,
      },
    ];
  }, [state.attachments]);

  return (
    <Block>
      <ProgressStepper
        currentStep={currentStep}
        items={stepperItems}
        onStepChange={onStepChange}
      />

      <Block>
        {currentStep === 1 && <DataTypeSelection nextStep={nextStep} />}
        {currentStep === 2 && <Sample />}
      </Block>
    </Block>
  );
};

export default UploadFiles;
