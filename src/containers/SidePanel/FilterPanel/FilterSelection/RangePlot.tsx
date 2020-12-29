import React, { FC } from 'react';
import { Block } from 'baseui/block';
import { RangePlot } from '../../../../components/plots';
import { HistogramBin } from '../../../../utils/data-utils';

type FilterSelectionContentProps = {
  histogram: {
    domain: [number, number];
    step: string;
    data: HistogramBin[];
    dataType: string;
    xAxisFormat?: string;
    value: [number, number];
  };
  onChangeRange: ([v0, v1]: [number, number]) => void;
};

const FilterSelectionRangePlot: FC<FilterSelectionContentProps> = ({
  histogram,
  onChangeRange,
}) => {
  const { domain, value, data, dataType } = histogram;
  return (
    <Block
      padding='scale200'
      width='auto'
      height='130px'
      backgroundColor='backgroundSecondary'
    >
      <RangePlot
        range={domain}
        value={value}
        histogram={data}
        dataType={dataType}
        onChange={onChangeRange}
        width={275}
        height={90}
      />
    </Block>
  );
};

export default FilterSelectionRangePlot;
