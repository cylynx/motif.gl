import React, { useMemo } from 'react';
import { Block } from 'baseui/block';

import ProgressStepper, {
  useStepper,
  StepperItems,
} from '../components/ProgressStepper';
import DataTypeSelection from './Uploaders/DataTypeSelection';
import useFileContents from './hooks/useFileContents';
import ConfigureFields from './ConfigureFields';

const UploadFiles = () => {
  const { currentStep, setStep, nextStep } = useStepper(1, 2);
  const {
    fileUpload: { attachments },
  } = useFileContents();

  const onStepChange = (step: number) => {
    setStep(step);
  };

  const stepperItems: StepperItems[] = useMemo(() => {
    const isSecondStepDisabled = currentStep === 2;
    return [
      {
        children: '1. Upload Files',
        disabled: true,
      },
      {
        children: '2. Configure Fields',
        disabled: isSecondStepDisabled,
      },
    ];
  }, [attachments, currentStep]);

  return (
    <Block>
      <ProgressStepper
        items={stepperItems}
        onStepChange={onStepChange}
        currentStep={currentStep}
      />

      <Block>
        {currentStep === 1 && <DataTypeSelection nextStep={nextStep} />}
        {currentStep === 2 && <ConfigureFields />}
      </Block>
    </Block>
  );
};

export default UploadFiles;
