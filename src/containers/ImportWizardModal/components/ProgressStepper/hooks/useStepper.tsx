import { useDispatch, useSelector } from 'react-redux';
import {
  FileUploadSelectors,
  FileUploadSlices,
} from '../../../../../redux/import/fileUpload';

const UseStepper = (initialStep: number, maxStep: number) => {
  const dispatch = useDispatch();
  const { step } = useSelector((state) =>
    FileUploadSelectors.getFileUpload(state),
  );

  const setStep = (targetStep: number) => {
    dispatch(FileUploadSlices.setStep(targetStep));
  };

  const nextStep = () => {
    const incrementStep = step + 1;
    const targetStep = incrementStep > maxStep ? maxStep : incrementStep;

    setStep(targetStep);
  };

  const previousStep = () => {
    const decrementStep = step - 1;

    const targetStep =
      decrementStep < initialStep ? initialStep : decrementStep;
    setStep(targetStep);
  };

  return { currentStep: step, setStep, nextStep, previousStep };
};

export default UseStepper;
