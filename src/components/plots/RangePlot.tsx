/* eslint-disable no-shadow */
// Adapted from: https://github.com/keplergl/kepler.gl/blob/master/src/components/common/range-plot.js

import React, { useState, useCallback, useMemo } from 'react';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import { scaleLinear, scaleUtc } from 'd3-scale';
import RangeBrush from './RangeBrush';
import HistogramPlot from './HistogramPlot';
import { Slider } from '../ui';
import { HistogramBin } from '../../utils/data-utils';

export type RangePlotProps = {
  range: [number, number];
  value: [number, number];
  histogram: HistogramBin[];
  onChange: ([v0, v1]: [number, number]) => void;
  onFinalChange?: ([v0, v1]: [number, number]) => void;
  xAxisFormat?: string;
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

const getTicks = (
  range: [number, number],
  numTicks: number,
  xAxisFormat: string,
) => {
  // xAxisFormat if date / time field
  const scale = xAxisFormat
    ? scaleUtc().domain(range).nice()
    : scaleLinear().domain(range).nice();
  const tickArray: Ticks[] = [];
  if (range[1] - range[0] === 2 && xAxisFormat) {
    return [{ pos: 0.4, value: new Date(range[0]).toISOString() }];
  }
  if (!xAxisFormat) {
    tickArray.push({
      pos: 0,
      value: range[0],
    });
    tickArray.push({
      pos: 1,
      value: range[1],
    });
    scale.ticks(numTicks).forEach((x: any) => {
      if (x > range[0] && x < range[1]) {
        tickArray.push({
          pos: (x - range[0]) / (range[1] - range[0]),
          value: x,
        });
      }
    });
  } else {
    // @ts-ignore
    const formattedTime = scale.ticks(numTicks).map(scale.tickFormat());
    scale.ticks(numTicks).forEach((x: any, index: number) => {
      tickArray.push({
        pos: (x - range[0]) / (range[1] - range[0]),
        value: formattedTime[index],
      });
    });
  }

  return tickArray;
};

const RangePlot = ({
  range,
  value,
  histogram,
  onChange,
  onFinalChange,
  xAxisFormat,
  step = 0.01,
  numTicks,
  size = 'default',
  height: inputHeight = null,
  width: inputWidth = null,
  isRanged = true,
  ...chartProps
}: RangePlotProps) => {
  const [brushing, setBrushing] = useState(false);
  const [hoveredDP, onMouseMove] = useState(null);
  const [enableChartHover, setEnableChartHover] = useState(false);
  // +- 1 if same domain to avoid slider errors
  const domain: [number, number] =
    range[0] === range[1] ? [range[0] - 1, range[1] + 1] : range;

  const height = inputHeight || size === 'default' ? 100 : 60;
  const width = inputWidth || size === 'default' ? 420 : 150;
  const ticks = useMemo(
    () => getTicks(domain, numTicks || Math.floor(width / 80), xAxisFormat),
    [domain, numTicks, xAxisFormat],
  );

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
      range={domain}
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
    domain,
    step,
    brushComponent,
    brushing,
    enableChartHover,
    onMouseMove,
    hoveredDP,
    isRanged,
    ...chartProps,
  };

  return (
    <Block display='flex' justifyContent='center'>
      <Block height={`${height}px`} width={`${width}px`}>
        <HistogramPlot histogram={histogram} {...commonProps} />
        <Block marginTop='-15px'>
          <Slider
            value={value}
            min={domain[0]}
            max={domain[1]}
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
            <LabelXSmall
              position='absolute'
              color='contentTertiary'
              left={`${x.pos * width}px`}
              key={`${x.value}`}
            >
              {x.value}
            </LabelXSmall>
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default RangePlot;
