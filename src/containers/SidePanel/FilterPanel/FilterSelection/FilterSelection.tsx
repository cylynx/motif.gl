import React, { FC, useCallback, useState, useRef } from 'react';
import { Value } from 'baseui/select';
import { Block } from 'baseui/block';
import Header from './Header';
import RangePlot, { HistogramProp } from './RangePlot';
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
  const [
    ,
    { getStringOptions, deleteFilter, updateFilterCriteria, getFilterCriteria },
  ] = useGraphFilter(graphFlatten);
  const filterAttribute: FilterCriteria = getFilterCriteria(idx) ?? {};

  const onSelectChange = useCallback(
    (obj: SelectVariableOption) => {
      if (obj === undefined) {
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
        filterCriteria.stringOptions = stringOptions;
      }

      if (analyzerType !== 'STRING') {
        const { domain, histogram } = getFieldDomain(
          graphFlatten[from],
          (x) => x[id],
          analyzerType,
        );

        const histogramProp: HistogramProp = {
          domain,
          data: histogram,
          dataType: analyzerType,
        };

        filterCriteria.histogram = histogramProp;
        filterCriteria.range = domain;
      }

      updateFilterCriteria(idx, filterCriteria);
    },
    [selectOptions],
  );

  const onChangeRange = (value: [number, number]) => {
    const filterCriteria: FilterCriteria = {
      ...filterAttribute,
      range: value,
    };
    updateFilterCriteria(idx, filterCriteria);
  };

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
        <RangePlot
          histogram={filterAttribute.histogram}
          value={filterAttribute.range}
          onChangeRange={onChangeRange}
        />
      );
    }

    return (
      <StringSelect
        value={filterAttribute.caseSearch}
        options={filterAttribute.stringOptions ?? []}
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
