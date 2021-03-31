import React, { useMemo } from 'react';
import { Block } from 'baseui/block';

import ProgressStepper, {
  useStepper,
  StepperItems,
} from '../components/ProgressStepper';
import DataTypeSelection from './Uploaders/DataTypeSelection';
import useFileContents from './hooks/useFileContents';
import { SingleFileForms } from '../../../redux/import/fileUpload';
import ConfigureFields from './ConfigureFields';

const UploadFiles = () => {
  const { currentStep, setCurrentStep, nextStep } = useStepper(1, 2);
  const { fileUpload } = useFileContents();

  const onStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const stepperItems: StepperItems[] = useMemo(() => {
    // const isContainAttachments = () => {
    //   if (Array.isArray(fileUpload.attachments)) {
    //     if (fileUpload.attachments.length !== 0) {
    //       return true;
    //     }
    //
    //     return false;
    //   }
    //
    //   const { nodeCsv, edgeCsv } = fileUpload.attachments as SingleFileForms;
    //   if (nodeCsv && edgeCsv) {
    //     return true;
    //   }
    //
    //   return false;
    // };

    // const isContainAttachment = isContainAttachments();
    return [
      {
        children: '1. Upload Files',
        isClickable: true,
      },
      {
        children: '2. Configure Fields',
        // isClickable: isContainAttachment,
        isClickable: true,
      },
    ];
  }, [fileUpload.attachments]);

  return (
    <Block>
      <ProgressStepper
        currentStep={currentStep}
        items={stepperItems}
        onStepChange={onStepChange}
      />

      <Block>
        {currentStep === 1 && <DataTypeSelection nextStep={nextStep} />}
        {currentStep === 2 && <ConfigureFields />}
      </Block>
    </Block>
  );
};

export default UploadFiles;
