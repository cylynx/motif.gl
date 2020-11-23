/* eslint-disable no-shadow */
// Adapted from: https://github.com/keplergl/kepler.gl/blob/master/src/components/common/range-plot.js

import React, { useState, useCallback } from 'react';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { scaleLinear } from 'd3-scale';
import RangeBrush from './RangeBrush';
import HistogramPlot from './HistogramPlot';
import { SimpleSlider } from '../ui';
import { HistogramBin } from '../../utils/data-utils';

export type RangePlotProps = {
  range: [number, number];
  value: [number, number];
  histogram: HistogramBin[];
  onChange: ([v0, v1]: [number, number]) => void;
  onFinalChange?: ([v0, v1]: [number, number]) => void;
  step?: number;
  numTicks?: number;
  size?: 'default' | 'compact';
  height?: number;
  width?: number;
  isRanged?: boolean;
  [key: string]: any;
};

export type Ticks = {
  pos: number;
  value: any;
};

const getTicks = (range: [number, number], numTicks: number) => {
  const ticks = scaleLinear().domain(range).nice().ticks(numTicks);
  const tickArray: Ticks[] = [];
  tickArray.push({ pos: 0, value: range[0] });
  ticks.forEach((x) => {
    if (x > range[0] && x < range[1]) {
      tickArray.push({ pos: (x - range[0]) / (range[1] - range[0]), value: x });
    }
  });
  tickArray.push({ pos: 1, value: range[1] });
  return tickArray;
};

const RangePlot = ({
  range,
  value,
  histogram,
  onChange,
  onFinalChange,
  step = 0.01,
  numTicks = 5,
  size = 'default',
  height: inputHeight = null,
  width: inputWidth = null,
  isRanged = true,
  ...chartProps
}: RangePlotProps) => {
  const [brushing, setBrushing] = useState(false);
  const [hoveredDP, onMouseMove] = useState(null);
  const [enableChartHover, setEnableChartHover] = useState(false);
  const height = inputHeight || size === 'default' ? 110 : 60;
  const width = inputWidth || size === 'default' ? 460 : 150;
  const ticks = getTicks(range, numTicks);

  const onBrushStart = useCallback(() => {
    setBrushing(true);
    onMouseMove(null);
    setEnableChartHover(false);
  }, [setBrushing, onMouseMove, setEnableChartHover]);

  const onBrush = useCallback(
    (v0: number, v1: number) => {
      if (onChange) {
        onChange([v0, v1]);
      }
    },
    [onChange],
  );

  const onChangeSlider = useCallback(
    (value: [number, number]) => {
      if (value) {
        setBrushing(false);
        onMouseMove(null);
        setEnableChartHover(false);
      }
      if (value && onChange) {
        onChange(value);
      }
    },
    [setBrushing, onMouseMove, setEnableChartHover, onChange],
  );

  const onBrushEnd = useCallback(
    (v0: number, v1: number) => {
      setBrushing(false);
      setEnableChartHover(true);
      if (onFinalChange) {
        onFinalChange([v0, v1]);
      }
    },
    [setBrushing, setEnableChartHover, onFinalChange],
  );

  const onFinalChangeSlider = useCallback(
    (value: [number, number]) => {
      setBrushing(false);
      setEnableChartHover(true);
      if (onFinalChange) {
        onFinalChange(value);
      }
    },
    [setBrushing, setEnableChartHover, onFinalChange],
  );

  const onMouseoverHandle = useCallback(() => {
    onMouseMove(null);
    setEnableChartHover(false);
  }, [onMouseMove, setEnableChartHover]);

  const onMouseoutHandle = useCallback(() => {
    setEnableChartHover(true);
  }, [setEnableChartHover]);

  const brushComponent = (
    <RangeBrush
      // @ts-ignore
      onBrush={onBrush}
      onBrushStart={onBrushStart}
      onBrushEnd={onBrushEnd}
      range={range}
      value={value}
      step={step}
      width={width}
      height={height}
      isRanged={isRanged}
      onMouseoverHandle={onMouseoverHandle}
      onMouseoutHandle={onMouseoutHandle}
      {...chartProps}
    />
  );

  const commonProps = {
    // to avoid last histogram exceeding container width
    width,
    value,
    height,
    brushComponent,
    brushing,
    enableChartHover,
    onMouseMove,
    hoveredDP,
    isRanged,
    ...chartProps,
  };

  return (
    <Block height={`${height}px`} width={`${width}px`}>
      <HistogramPlot histogram={histogram} {...commonProps} />
      <Block marginTop='-15px'>
        <SimpleSlider
          value={value}
          min={range[0]}
          max={range[1]}
          step={step}
          onChange={({ value }: { value: [number, number] }) =>
            onChangeSlider(value)
          }
          onFinalChange={({ value }: { value: [number, number] }) =>
            onFinalChangeSlider(value)
          }
          showThumbValue={false}
          showTickBar={false}
        />
      </Block>
      <Block position='relative' width={`${width}px`}>
        {ticks.map((x: Ticks) => (
          <LabelSmall
            position='absolute'
            color='contentTertiary'
            left={`${x.pos * width}px`}
            key={x.value}
          >
            {x.value}
          </LabelSmall>
        ))}
      </Block>
    </Block>
  );
};

export default RangePlot;
