/* eslint-disable no-shadow */
// Adapted from: https://github.com/keplergl/kepler.gl/blob/master/src/components/common/range-plot.js

import React, { useState, useCallback, useMemo } from 'react';
import { Block } from 'baseui/block';
import RangeBrush from './RangeBrush';
import HistogramPlot from './HistogramPlot';
import { Slider } from '../ui';
import { HistogramBin } from '../../utils/data-utils';
import NumericAxis from './NumericAxis';
import DateTimeAxis from './DateTimeAxis';
import { DomainType } from './NumericAxis/utils';

export type RangePlotProps = {
  range: [number, number];
  value: [number, number];
  histogram: HistogramBin[];
  dataType: string;
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
  dataType,
  ...chartProps
}: RangePlotProps) => {
  const [brushing, setBrushing] = useState(false);
  const [hoveredDP, onMouseMove] = useState(null);
  const [enableChartHover, setEnableChartHover] = useState(false);

  const domain: [number, number] =
    range[0] === range[1] ? [range[0] - 1, range[1] + 1] : range;

  /**
   * Decrement the lower boundary and increment upper boundary to prevent overlap
   * 1. "integer" | "real" dataType perform modification with one integer
   * 2. "timestamp" | "date" dataType perform modificatin with one day
   */
  // const domain: [number, number] = useMemo(() => {
  //   const [minRange, maxRange] = range;
  //   if (minRange === maxRange) {
  //     if (dataType === 'integer' || dataType === 'real') {
  //       return [minRange - 1, maxRange + 1];
  //     }

  //     // dataType === "timestamp" || dataType === "date"
  //     // second in millis * minutes * hours * 24
  //     const DAY: number = 24 * 60 * 60 * 1000;
  //     return [minRange - DAY, maxRange + DAY];
  //   }

  //   return range;
  // }, [range]);

  const height: number = useMemo(() => {
    if (inputHeight) return inputHeight;
    if (size === 'default') return 100;

    return 60;
  }, [inputHeight, size]);

  const width: number = useMemo(() => {
    if (inputWidth) return inputWidth;
    if (size === 'default') return 420;

    return 150;
  }, [inputHeight, size]);

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
          {(dataType === 'integer' || dataType === 'real') && (
            <NumericAxis domain={domain} width={width} height={height} />
          )}
          {(dataType === 'timestamp' || dataType === 'date') && (
            <DateTimeAxis domain={domain} width={width} height={height} />
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default RangePlot;
