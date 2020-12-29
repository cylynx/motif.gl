import React, { FC, useCallback, useState, useRef, Fragment } from 'react';
import { useSelector } from 'react-redux';
import {
  SelectOptions,
  SelectVariableOption,
} from '../../../../components/SelectVariable/SelectVariable';
import FilterSelectionHeader from './FilterSelectionHeader';
import FilterSelectionContent from './FilterSelectionContent';
import { getFieldDomain } from '../../../../utils/data-utils';
import { getGraphFlatten } from '../../../../redux';

export type FilterSelectionProps = {
  selectOptions: SelectOptions;
};

const FilterSelection: FC<FilterSelectionProps> = ({ selectOptions }) => {
  const [selection, setSelection] = useState([]);
  const [histogramProp, setHistogramProp] = useState(null);
  const graphFlatten = useSelector((state) => getGraphFlatten(state));

  const onSelectChange = useCallback(
    (obj: SelectVariableOption) => {
      if (obj === undefined) {
        setSelection([]);
        return;
      }

      const { id, from, analyzerType, format } = obj;
      const { domain, step, histogram } = getFieldDomain(
        graphFlatten[from],
        (x) => x[id],
        analyzerType,
      );
      setSelection([obj]);
      setHistogramProp({
        step,
        domain,
        format,
        value: domain,
        data: histogram,
        dataType: analyzerType,
      });
    },
    [selectOptions],
  );

  const onChangeRange = useCallback(
    (value: [number, number]) => {
      setHistogramProp((histogram: any) => ({
        ...histogram,
        value,
      }));
    },
    [selection],
  );

  return (
    <Fragment>
      <FilterSelectionHeader
        selectOptions={selectOptions}
        onSelectChange={onSelectChange}
        selection={selection}
      />
      {histogramProp !== null && (
        <FilterSelectionContent
          histogram={histogramProp}
          onChangeRange={onChangeRange}
        />
      )}
    </Fragment>
  );
};

export default FilterSelection;
