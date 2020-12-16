import React, { FC, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { format } from 'd3-format';

import { DomainType, generateNumericTicks } from '../../utils/data-utils';

const MINIMUM_WIDTH = 300;
const MINIMUM_HEIGHT = 100;
const TICK_COUNTS = 5;

type AxisRef = SVGSVGElement | null;
type NumericAxisProps = {
  domain: DomainType;
  width?: number;
  height?: number;
  tickCounts?: number;
};

const StyledSvg = styled.svg`
  pointer-events: none;
  overflow: visible;
`;

const NumericAxis: FC<NumericAxisProps> = ({
  domain,
  width = MINIMUM_WIDTH,
  height = MINIMUM_HEIGHT,
  tickCounts = TICK_COUNTS,
}) => {
  const axis = useRef<AxisRef>(null);

  useEffect(() => {
    const renderAxis = () => {
      if (axis.current === null) return;

      const scale = scaleLinear().domain(domain).range([0, width]);
      const { tickValues, decimalPrecision } = generateNumericTicks(
        domain,
        scale,
      );
      const xAxisGenerator = axisBottom(scale)
        .tickValues(tickValues)
        .tickFormat(format(`.${decimalPrecision}f`))
        .tickSize(0)
        .tickPadding(6);

      select(axis.current).call(xAxisGenerator);
    };

    renderAxis();
  }, [width, domain, tickCounts]);

  return (
    <StyledSvg width={width} height={height}>
      <g ref={axis} transform='translate(0,0)' />
    </StyledSvg>
  );
};

export type { NumericAxisProps };
export default NumericAxis;
