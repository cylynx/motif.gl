import React from 'react';
import styled from 'styled-components';
import classnames from 'classnames';

import { FaPlay, FaFastBackward, FaPause } from 'react-icons/fa';
import { ButtonGroup, Button } from '../styled-components';

const StyledAnimationControls = styled.div`
  display: flex;
  margin-right: 12px;
  &.disabled {
    opacity: 0.4;
    pointer-events: none;
  }
`;

const IconButton = styled(Button)`
  padding: 6px 4px;
  svg {
    margin: 0 6px;
  }
`;

function nop() {}
const DEFAULT_BUTTON_HEIGHT = '18px';

const AnimationPlaybacks = ({
  isAnimatable,
  isAnimating,
  buttonStyle,
  pauseAnimation = nop,
  updateAnimationTime = nop,
  startAnimation = nop,
  buttonHeight = DEFAULT_BUTTON_HEIGHT,
}) => {
  const btnStyle = buttonStyle ? { [buttonStyle]: true } : {};
  return (
    <StyledAnimationControls
      className={classnames('time-range-slider__control', {
        disabled: !isAnimatable,
      })}
    >
      <ButtonGroup>
        <IconButton
          className="playback-control-button"
          {...btnStyle}
          onClick={updateAnimationTime}
        >
          <FaFastBackward height={buttonHeight} />
        </IconButton>
        <IconButton
          {...btnStyle}
          className={classnames('playback-control-button', {
            active: isAnimating,
          })}
          onClick={isAnimating ? pauseAnimation : startAnimation}
        >
          {isAnimating ? (
            <FaPause height={buttonHeight} />
          ) : (
            <FaPlay height={buttonHeight} />
          )}
        </IconButton>
      </ButtonGroup>
    </StyledAnimationControls>
  );
};

export default AnimationPlaybacks;
