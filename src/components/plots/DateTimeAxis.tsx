import React, { FC, useEffect, useRef } from 'react';
import { styled } from 'baseui';
import { scaleTime } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';

const MINIMUM_WIDTH = 300;
const MINIMUM_HEIGHT = 100;
type AxisRef = SVGSVGElement | null;
type DateTimeAxisProps = {
  width?: number;
  height?: number;
  domain: [number, number];
};

const StyledSvg = styled('svg', () => ({
  overflow: 'visible',
  pointerEvents: 'none',
}));

const DateTimeAxis: FC<DateTimeAxisProps> = ({
  width = MINIMUM_WIDTH,
  height = MINIMUM_HEIGHT,
  domain,
}) => {
  const axis = useRef<AxisRef>(null);

  useEffect(() => {
    const renderAxis = () => {
      if (axis.current === null) return;

      const scale = scaleTime().domain(domain).range([0, width]).nice();
      const xAxisGenerator = axisBottom(scale)
        // .tickFormat(timeFormat('%Y'))
        .ticks(6)
        .tickSize(0)
        .tickPadding(8);

      select(axis.current).call(xAxisGenerator);
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
