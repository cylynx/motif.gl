import React, { useMemo, useState } from 'react';
import { Block } from 'baseui/block';
import { ProgressStepper } from 'motif.gl';
import { Driver } from 'neo4j-driver/types/driver';
import { StepperItems } from '../../../../src/components/ProgressStepper';
import ConnectDatabase from './sections/ConnectDatabase';

const SecondPage = () => <div>Second Page</div>;
const ThirdPage = () => <div>Third Page</div>;
const Neo4J = () => {
  const [currentStep, setCurrentStep] = useState<number>(3);
  // @ts-ignore
  const [driver, setDriver] = useState<Driver>({});

  const onStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => setCurrentStep((step) => step + 1);

  const stepperItems: StepperItems[] = useMemo(() => {
    const isSecondStepDisabled = currentStep >= 2;
    const isThirdStepDisabled = currentStep >= 3;
    return [
      {
        children: '1. Connect Database',
        disabled: true,
      },
      {
        children: '2. Execute Query',
        disabled: isSecondStepDisabled,
      },
      {
        children: '3. Configure Fields',
        disabled: isThirdStepDisabled,
      },
    ];
  }, [currentStep]);

  return (
    <Block>
      <ProgressStepper
        items={stepperItems}
        onStepChange={onStepChange}
        currentStep={currentStep}
      />

      <Block>
        {currentStep === 1 && (
          <ConnectDatabase
            driver={driver}
            setDriver={setDriver}
            nextStep={nextStep}
          />
        )}
        {currentStep === 2 && <SecondPage />}
        {currentStep === 3 && <ThirdPage />}
      </Block>
    </Block>
  );
};

export default Neo4J;
