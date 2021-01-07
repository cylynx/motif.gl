import React, { FC, useEffect, useRef } from 'react';
import { styled } from 'baseui';
import { scaleUtc } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { format } from "date-fns"; 
import { generateDateTimeTicks, dateTimeFormatDeterminer } from './utils';

const MINIMUM_WIDTH = 300;
const MINIMUM_HEIGHT = 20;
type AxisRef = SVGSVGElement | null;
type DateTimeAxisProps = {
  width?: number;
  height?: number;
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
}) => {
  const axis = useRef<AxisRef>(null);

  useEffect(() => {
    const renderAxis = () => {
      if (axis.current === null) return;

      const scale = scaleUtc().domain(domain).range([0, width]).nice();
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

export type { DateTimeAxisProps };
export default DateTimeAxis;
