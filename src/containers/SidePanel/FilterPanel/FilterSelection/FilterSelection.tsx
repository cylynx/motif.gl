import React, { FC, useCallback, useState, MouseEvent } from 'react';
import { Value } from 'baseui/select';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import Header from './Header';
import RangePlot from './RangePlot';
import StringSelect from './StringSelect';

import {
  SelectOptions,
  SelectVariableOption,
} from '../../../../components/SelectVariable/SelectVariable';
import { getFieldDomain } from '../../../../utils/data-utils';
import { getGraphFlatten } from '../../../../redux';

export type FilterSelectionProps = {
  selectOptions: SelectOptions;
  idx: string;
  onDeleteBtnClick: (idx: string) => void;
};

const FilterSelection: FC<FilterSelectionProps> = ({
  selectOptions,
  idx,
  onDeleteBtnClick,
}) => {
  const [histogramProp, setHistogramProp] = useState(null);

  const [selection, setSelection] = useState([]);
  const [stringVariable, setStringVariable] = useState<Value>([]);
  const graphFlatten = useSelector((state) => getGraphFlatten(state));

  const onSelectChange = useCallback(
    (obj: SelectVariableOption) => {
      if (obj === undefined) {
        setSelection([]);
        setHistogramProp(null);
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

  const onStringSelect = (values: Value): void => {
    setStringVariable(values);
  };

  const onDeleteClick = (_: MouseEvent<HTMLButtonElement>): void => {
    onDeleteBtnClick(idx);
  };

  const renderBody = (dataType: string): JSX.Element => {
    if (dataType !== 'STRING') {
      return (
        <RangePlot histogram={histogramProp} onChangeRange={onChangeRange} />
      );
    }

    return (
      <StringSelect
        value={stringVariable}
        options={[
          { id: 'Portland', label: 'Portland' },
          { id: 'NYC', label: 'New York City' },
          { id: 'LosAngeles', label: 'Los Angeles' },
          { id: 'Boston', label: 'Boston' },
          { id: 'Atlanta', label: 'Atlanta' },
          { id: 'SanFrancisco', label: 'San Francisco' },
        ]}
        placeholder='Enter a value'
        onChange={onStringSelect}
      />
    );
  };

  return (
    <Block marginBottom='scale400'>
      <Header
        selectOptions={selectOptions}
        onSelectChange={onSelectChange}
        selection={selection}
        onDeleteBtnClick={onDeleteClick}
      />
      {histogramProp !== null && renderBody(histogramProp.dataType)}
    </Block>
  );
};

export default FilterSelection;
