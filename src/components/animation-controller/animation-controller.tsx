/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/state-in-constructor */
/* https://github.com/keplergl/kepler.gl/blob/master/src/components/common/animation-control/animation-controller.js */
// @ts-nocheck

import { Component } from 'react';
import { bisectLeft } from 'd3-array';

export const BASE_SPEED = 600;
export const FPS = 60;
export const ANIMATION_TYPE = {
  interval: 'interval',
  continuous: 'continuous',
};

class AnimationController extends Component {
  state = {
    isAnimating: false,
  };

  componentDidUpdate() {
    if (!this._timer && this.state.isAnimating) {
      if (this.props.animationType === ANIMATION_TYPE.continuous) {
        this._timer = requestAnimationFrame(this._nextFrame);
      } else {
        // animate by interval
        // 30*600
        const { steps, speed } = this.props;
        if (!Array.isArray(steps) || !steps.length) {
          console.log('animation steps should be an array');
          return;
        }
        // when speed = 1, animation should loop through 600 frames at 60 FPS
        // calculate delay based on # steps
        const delay = (BASE_SPEED * (1000 / FPS)) / steps.length / (speed || 1);
        this._animate(delay);
      }
    }
  }

  _timer = null;

  _animate = (delay) => {
    this._startTime = new Date().getTime();

    const loop = () => {
      const current = new Date().getTime();
      // @ts-ignore
      const delta = current - this._startTime;

      if (delta >= delay) {
        this._nextFrame();
        this._startTime = new Date().getTime();
      } else {
        this._timer = requestAnimationFrame(loop);
      }
    };

    this._timer = requestAnimationFrame(loop);
  };

  _resetAnimationWindow = () => {
    const { domain, value } = this.props;
    if (Array.isArray(value)) {
      const value0 = domain[0];
      const value1 = value0 + value[1] - value[0];
      this.props.updateAnimation([value0, value1]);
    } else {
      this.props.updateAnimation(domain[0]);
    }
  };

  _resetAnimtionStep = () => {
    // go to the first steps
    this.props.updateAnimation([this.props.steps[0], 0]);
  };

  _resetAnimation = () => {
    if (this.props.animationType === ANIMATION_TYPE.continuous) {
      this._resetAnimationWindow();
    } else {
      this._resetAnimtionStep();
    }
  };

  _startAnimation = () => {
    this._pauseAnimation();
    if (typeof this.props.startAnimation === 'function') {
      this.props.startAnimation();
    }
    this.setState({ isAnimating: true });
  };

  _pauseAnimation = () => {
    if (this._timer) {
      cancelAnimationFrame(this._timer);
      if (typeof this.props.pauseAnimation === 'function') {
        this.props.pauseAnimation();
      }
      this._timer = null;
    }
    this.setState({ isAnimating: false });
  };

  _nextFrame = () => {
    this._timer = null;
    const nextValue =
      this.props.animationType === ANIMATION_TYPE.continuous
        ? this._nextFrameByWindow()
        : this._nextFrameByStep();

    this.props.updateAnimation(nextValue);
  };

  _nextFrameByWindow() {
    const { domain, value, speed, baseSpeed } = this.props;
    const delta = ((domain[1] - domain[0]) / baseSpeed) * speed;
    // loop when reaches the end
    if (Array.isArray(value)) {
      const value0 =
        value[1] + delta > domain[1] ? domain[0] : value[0] + delta;
      const value1 = value0 + value[1] - value[0];
      return [value0, value1];
    }
    return value + delta > domain[1] ? domain[0] : value + delta;
  }

  _nextFrameByStep() {
    const { steps, value } = this.props;
    const val = Array.isArray(value) ? value[0] : value;
    const index = bisectLeft(steps, val);
    const nextIdx = index >= steps.length - 1 ? 0 : index + 1;

    return [steps[nextIdx], nextIdx];
  }

  render() {
    const { isAnimating } = this.state;
    const { children } = this.props;

    return typeof children === 'function'
      ? children(
          isAnimating,
          this._startAnimation,
          this._pauseAnimation,
          this._resetAnimation,
        )
      : null;
  }
}

AnimationController.defaultProps = {
  baseSpeed: BASE_SPEED,
  speed: 1,
  animationType: ANIMATION_TYPE.continuous,
};

export default AnimationController;
