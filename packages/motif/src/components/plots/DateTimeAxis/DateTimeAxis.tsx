import React, { FC, useEffect, useRef } from 'react';
import { styled } from 'baseui';
import { scaleUtc } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { format } from 'date-fns';
import { generateDateTimeTicks, dateTimeFormatDeterminer } from './utils';

const MINIMUM_WIDTH = 300;
const MINIMUM_HEIGHT = 20;
type AxisRef = SVGSVGElement | null;
export type DateTimeAxisProps = {
  width?: number;
  height?: number;
  xAxisFormat?: string;
  domain: [number, number];
};

const StyledSvg = styled('svg', ({ $theme }) => ({
  pointerEvents: 'none',
  overflow: 'visible',
  color: $theme.colors.contentTertiary,
}));

const DateTimeAxis: FC<DateTimeAxisProps> = ({
  domain,
  width = MINIMUM_WIDTH,
  height = MINIMUM_HEIGHT,
  xAxisFormat,
}) => {
  const axis = useRef<AxisRef>(null);

  useEffect(() => {
    const renderAxis = () => {
      if (axis.current === null) return;

      let scaleDomain = domain;

      if (xAxisFormat === 'x') {
        let [startRange, endRange] = domain;
        startRange *= 1000;
        endRange *= 1000;
        scaleDomain = [startRange, endRange];
      }

      const scale = scaleUtc()
        .domain(scaleDomain)
        .range([0, width])
        .nice();
      const tickValues: Date[] = generateDateTimeTicks(scale);
      const dateTimeFormat: string = dateTimeFormatDeterminer(tickValues);

      const xAxisGenerator = axisBottom(scale)
        .tickValues(tickValues)
        .tickSize(0)
        .tickPadding(3)
        .tickFormat((d: Date) => format(d, dateTimeFormat));

      select(axis.current)
        .call(xAxisGenerator)
        .style('stroke-width', 0)
        .style('font-size', 12)
        .style('font-weight', 500);
    };

    renderAxis();
  }, [width, domain]);

  return (
    <StyledSvg width={width} height={height}>
      <g ref={axis} transform='translate(0,0)' />
    </StyledSvg>
  );
};

export default DateTimeAxis;
