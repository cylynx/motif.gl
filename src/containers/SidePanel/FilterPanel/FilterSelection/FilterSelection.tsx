import React, { FC, useCallback, useState, useRef } from 'react';
import { Value } from 'baseui/select';
import { Block } from 'baseui/block';
import Header from './Header';
import RangePlot from './RangePlot';
import StringSelect from './StringSelect';

import {
  SelectOptions,
  SelectVariableOption,
} from '../../../../components/SelectVariable/SelectVariable';
import { getFieldDomain } from '../../../../utils/data-utils';
import { FilterCriteria, GraphData } from '../../../Graph';
import useGraphFilter from '../hooks/UseGraphFilter';
import { GraphAttribute } from '../hooks/UseGraphFilter/types';

export type FilterSelectionProps = {
  selectOptions: SelectOptions;
  idx: string;
  graphFlatten: GraphData;
};

const FilterSelection: FC<FilterSelectionProps> = ({
  selectOptions,
  graphFlatten,
  idx,
}) => {
  const [histogramProp, setHistogramProp] = useState(null);
  const [
    ,
    { getStringOptions, deleteFilter, updateFilterCriteria, getFilterCriteria },
  ] = useGraphFilter(graphFlatten);
  const filterAttribute: FilterCriteria = getFilterCriteria(idx) ?? {};
  const stringSelectionRef = useRef<Value>([]);

  const onSelectChange = useCallback(
    (obj: SelectVariableOption) => {
      if (obj === undefined) {
        stringSelectionRef.current = [];
        setHistogramProp(null);
        updateFilterCriteria(idx, {});
        return;
      }

      const { id, from, analyzerType, format } = obj;

      // update redux filter options
      const filterCriteria: FilterCriteria = {
        id,
        from,
        selection: [obj],
        analyzerType,
      };

      if (analyzerType === 'STRING') {
        const stringOptions: Value = getStringOptions(
          from as GraphAttribute,
          id,
        );
        stringSelectionRef.current = stringOptions;
      }

      if (analyzerType !== 'STRING') {
        const { domain, step, histogram } = getFieldDomain(
          graphFlatten[from],
          (x) => x[id],
          analyzerType,
        );
        setHistogramProp({
          step,
          domain,
          format,
          value: domain,
          data: histogram,
          dataType: analyzerType,
        });
        filterCriteria.range = domain;
      }

      updateFilterCriteria(idx, filterCriteria);
    },
    [selectOptions],
  );

  const onChangeRange = useCallback((value: [number, number]) => {
    setHistogramProp((histogram: any) => ({
      ...histogram,
      value,
    }));
  }, []);

  const onStringSelect = (value: Value): void => {
    const filterCriteria: FilterCriteria = {
      ...filterAttribute,
      caseSearch: value,
    };
    updateFilterCriteria(idx, filterCriteria);
  };

  const onDeleteBtnClick = useCallback(() => {
    deleteFilter(idx);
  }, [selectOptions, graphFlatten]);

  const renderBody = (dataType: string): JSX.Element => {
    if (dataType !== 'STRING') {
      return (
        <RangePlot histogram={histogramProp} onChangeRange={onChangeRange} />
      );
    }

    return (
      <StringSelect
        value={filterAttribute.caseSearch}
        options={stringSelectionRef.current}
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
        selection={filterAttribute.selection}
        onDeleteBtnClick={onDeleteBtnClick}
      />
      {Object.keys(filterAttribute).length !== 0 &&
        renderBody(filterAttribute.analyzerType)}
    </Block>
  );
};

export default FilterSelection;
