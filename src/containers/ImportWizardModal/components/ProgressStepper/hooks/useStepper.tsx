import { useState } from 'react';

const UseStepper = (initialStep: number, maxStep: number) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = () => {
    setCurrentStep((prevStep) => {
      const incrementStep = prevStep + 1;
      if (incrementStep > maxStep) {
        return maxStep;
      }

      return incrementStep;
    });
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => {
      const decrementStep = prevStep - 1;
      if (decrementStep < initialStep) {
        return initialStep;
      }

      return decrementStep;
    });
  };

  return { currentStep, setCurrentStep, nextStep, previousStep };
};

export default UseStepper;
