import React, { FC } from 'react';
import { Block } from 'baseui/block';
import { RangePlot } from '../../../../components/plots';
import { HistogramBin } from '../../../../utils/data-utils';

export type HistogramProp = {
  domain: [number, number];
  data: HistogramBin[];
  step: number;
  dataType: string;
  format: string;
};

type FilterSelectionContentProps = {
  histogram: HistogramProp;
  value: [number, number];
  onChangeRange: ([v0, v1]: [number, number]) => void;
};

const FilterSelectionRangePlot: FC<FilterSelectionContentProps> = ({
  histogram,
  onChangeRange,
  value,
}) => {
  const { domain, data, dataType, step = 0.01, format } = histogram;
  return (
    <Block
      padding='scale200'
      width='auto'
      height='130px'
      backgroundColor='backgroundTertiary'
    >
      <RangePlot
        range={domain}
        histogram={data}
        step={step}
        dataType={dataType}
        value={value}
        onChange={onChangeRange}
        width={275}
        height={90}
        xAxisFormat={format}
      />
    </Block>
  );
};

export default FilterSelectionRangePlot;
