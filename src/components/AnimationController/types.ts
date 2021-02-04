type AnimationFunc = () => void;
type UpdateAnimationFunc = (value: number[] | number) => void;

export type AnimationControllerProps = Partial<{
  steps: any;
  speed: number;
  domain: [number, number] | number[];
  value: [number, number] | number[];
  animationType: 'interval' | 'continuous';
  baseSpeed: number;
  startAnimation: AnimationFunc;
  pauseAnimation: AnimationFunc;
  updateAnimation: UpdateAnimationFunc;
  children: (
    isAnimating: boolean,
    startAnimation: AnimationFunc,
    pauseAnimation: AnimationFunc,
    resetAnimation: AnimationFunc,
  ) => JSX.Element;
}>;

export type AnimationControllerState = {
  isAnimating: boolean;
};
