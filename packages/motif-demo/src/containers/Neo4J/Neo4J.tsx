// @ts-ignore
import React, { useMemo, useState } from 'react';
import { Block } from 'baseui/block';
import { ProgressStepper, GraphData, StepperItems } from 'motif.gl';

import { Value } from 'baseui/select';
import ConnectDatabase from './sections/ConnectDatabase';
import ExecuteQuery, { ExecuteQueryState } from './sections/ExecuteQuery';
import ConfigureFields from './sections/ConfigureFields';

// @ts-ignore
const Neo4J = ({ driver, setDriver }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [executeQuery, setExecuteQuery] = useState<ExecuteQueryState>({
    query: '',
    db: [],
    graphData: { nodes: [], edges: [] },
  });

  const onStepChange = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => setCurrentStep((step) => step + 1);

  const onExecuteQueryChange = (
    name: string,
    value: string | Value | GraphData,
  ) => {
    setExecuteQuery((state: ExecuteQueryState) => {
      return {
        ...state,
        [name]: value,
      };
    });
  };

  const stepperItems: StepperItems[] = useMemo(() => {
    const isSecondStepDisabled =
      currentStep >= 2 || Object.keys(driver).length > 0;
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
  }, [currentStep, driver]);

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
        {currentStep === 2 && (
          <ExecuteQuery
            driver={driver}
            nextStep={nextStep}
            states={executeQuery}
            onStateChange={onExecuteQueryChange}
          />
        )}
        {currentStep === 3 && (
          <ConfigureFields graphData={executeQuery.graphData} />
        )}
      </Block>
    </Block>
  );
};

export default Neo4J;
