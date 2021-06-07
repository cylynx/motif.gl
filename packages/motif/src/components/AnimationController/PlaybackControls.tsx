import React, { useState } from 'react';
import { SHAPE } from 'baseui/button';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import * as Icon from '../Icons';
import { Button, SimpleTooltip, Dropdown } from '../ui';

const SPEED_OPTIONS = [
  { id: '1.0', label: '1.0', speed: 1 },
  { id: '2.0', label: '2.0', speed: 2 },
  { id: '4.0', label: '4.0', speed: 4 },
  { id: '8.0', label: '8.0', speed: 8 },
  { id: '16.0', label: '16.0', speed: 16 },
];

export type PlaybackControlsProps = {
  isAnimating: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onChangeSpeed: (newSpeed) => void;
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
      onClick={onClick}
      BaseButtonStyleOverrides={{
        marginLeft: '4px',
        marginright: '4px',
      }}
    >
      {isAnimating ? <Icon.Pause /> : <Icon.Play />}
    </Button>
  </SimpleTooltip>
);

const ResetButton = ({ onClick }: { onClick: () => void }) => (
  <SimpleTooltip tooltip='Reset'>
    <Button
      shape={SHAPE.square}
      kind='secondary'
      onClick={onClick}
      BaseButtonStyleOverrides={{
        marginLeft: '4px',
        marginright: '4px',
      }}
    >
      <Icon.Reset />
    </Button>
  </SimpleTooltip>
);

const SpeedControl = ({ onChange }: { onChange: (newSpeed) => void }) => {
  const [speed, setSpeed] = useState([SPEED_OPTIONS[0]]);
  const onChangeSpeedOption = (params) => {
    setSpeed(params.value);
    onChange(params.value[0].speed);
  };

  return (
    <Block
      marginLeft='scale400'
      display='flex'
      width='130px'
      justifyContent='center'
      alignItems='center'
    >
      <LabelSmall color='contentInverseSecondary' marginRight='scale200'>
        Speed
      </LabelSmall>
      <Dropdown
        value={speed}
        options={SPEED_OPTIONS}
        clearable={false}
        onChange={onChangeSpeedOption}
      />
    </Block>
  );
};

const PlaybackControls = ({
  isAnimating,
  onPlay,
  onPause,
  onReset,
  onChangeSpeed,
}: PlaybackControlsProps) => {
  return (
    <Block display='flex' alignItems='center'>
      <SpeedControl onChange={onChangeSpeed} />
      <ResetButton onClick={onReset} />
      <PlayPauseButton
        isAnimating={isAnimating}
        onClick={isAnimating ? onPause : onPlay}
      />
    </Block>
  );
};

export default PlaybackControls;
