import React from 'react';

import { Button, SHAPE } from 'baseui/button';
import { Block } from 'baseui/block';
import * as Icon from '../Icons';
import { SimpleTooltip } from '../ui';

export type PlaybackControlsProps = {
  isAnimating: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onChangeSpeed: () => void;
};

const PlayPauseButton = ({
  isAnimating,
  onClick,
}: {
  isAnimating: boolean;
  onClick: () => void;
}) => (
  <SimpleTooltip tooltip={isAnimating ? 'Pause' : 'Play'}>
    <Button
      shape={SHAPE.square}
      size='compact'
      kind='secondary'
      onClick={onClick}
    >
      {isAnimating ? <Icon.Pause /> : <Icon.Play />}
    </Button>
  </SimpleTooltip>
);

const ResetButton = ({ onClick }: { onClick: () => void }) => (
  <SimpleTooltip tooltip='Reset'>
    <Button
      shape={SHAPE.square}
      size='compact'
      kind='secondary'
      onClick={onClick}
    >
      <Icon.Reset />
    </Button>
  </SimpleTooltip>
);

const SpeedButton = ({ onClick }: { onClick: () => void }) => (
  <SimpleTooltip tooltip='Speed'>
    <Button
      shape={SHAPE.square}
      size='compact'
      kind='secondary'
      onClick={onClick}
    >
      <Icon.Rocket />
    </Button>
  </SimpleTooltip>
);

const PlaybackControls = ({
  isAnimating,
  onPlay,
  onPause,
  onReset,
  onChangeSpeed,
}: PlaybackControlsProps) => {
  return (
    <Block display='flex' flexDirection='row'>
      <SpeedButton onClick={onChangeSpeed} />
      <ResetButton onClick={onReset} />
      <PlayPauseButton
        isAnimating={isAnimating}
        onClick={isAnimating ? onPause : onPlay}
      />
    </Block>
  );
};

export default PlaybackControls;
