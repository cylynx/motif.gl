import React, { FC, useEffect, useRef } from 'react';
import { styled } from 'baseui';
import { NumberValue, scaleLinear } from 'd3-scale';
import { axisBottom } from 'd3-axis';
import { select } from 'd3-selection';
import { format } from 'd3-format';

import {
  DomainType,
  generateNumericTicks,
  INumericTicks,
} from '../../utils/data-utils';

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

const StyledSvg = styled('svg', ({ $theme }) => ({
  pointerEvents: 'none',
  overflow: 'visible',
  color: $theme.colors.contentTertiary,
}));

const NumericAxis: FC<NumericAxisProps> = ({
  domain,
  width = MINIMUM_WIDTH,
  height = MINIMUM_HEIGHT,
  tickCounts = TICK_COUNTS,
}) => {
  const axis = useRef<AxisRef>(null);

  /**
   * @tutorial
   * https://github.com/d3/d3-format/blob/master/README.md#format
   */
  useEffect(() => {
    const renderAxis = () => {
      if (axis.current === null) return;

      const scale = scaleLinear().domain(domain).range([0, width]);
      const {
        tickValues,
        type,
        decimalPrecision,
      }: INumericTicks = generateNumericTicks(domain, scale);

      const xAxisGenerator = axisBottom(scale)
        .tickSize(0)
        .tickPadding(3)
        .tickValues(tickValues);

      if (type === 'integer') {
        const formatValue = format('~s');
        xAxisGenerator.tickFormat((d: NumberValue) =>
          formatValue(d).replace('k', 'K').replace('m', 'M').replace('G', 'B'),
        );
      }

      if (type === 'float') {
        xAxisGenerator.tickFormat(format(`.${decimalPrecision}f`));
      }

      select(axis.current)
        .call(xAxisGenerator)
        .style('stroke-width', 0)
        .style('font-size', 12)
        .style('font-weight', 500);
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
