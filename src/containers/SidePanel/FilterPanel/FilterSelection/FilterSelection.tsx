import React, { FC, useCallback } from 'react';
import { Value } from 'baseui/select';
import { Block } from 'baseui/block';
import Header from './Header';
import RangePlot, { HistogramProp } from './RangePlot';
import StringSelect from './StringSelect';
import useGraphFilter from '../hooks/UseGraphFilter';

import {
  SelectOptions,
  SelectVariableOption,
} from '../../../../components/SelectVariable/SelectVariable';
import { getFieldDomain } from '../../../../utils/data-utils';
import { FilterCriteria, GraphData, GraphAttribute } from '../../../Graph';

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
  const {
    getStringOptions,
    deleteFilter,
    updateFilterCriteria,
    getFilterCriteria,
  } = useGraphFilter();
  const filterAttribute: FilterCriteria = getFilterCriteria(idx) ?? {};

  const onSelectChange = useCallback(
    (obj: SelectVariableOption) => {
      if (obj === undefined) {
        updateFilterCriteria(idx, {});
        return;
      }

      const { id, from, analyzerType } = obj;

      // update redux filter options
      const filterCriteria: FilterCriteria = {
        id,
        from,
        selection: [obj],
        analyzerType,
        isFilterReady: false,
      };

      if (analyzerType === 'STRING') {
        const stringOptions: Value = getStringOptions(
          from as GraphAttribute,
          graphFlatten,
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
        filterCriteria.isFilterReady = true;
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

  const onStringSelect = useCallback(
    (value: Value): void => {
      if (value.length === 0) {
        const { caseSearch: removedValue, ...res } = filterAttribute;
        res.isFilterReady = false;
        updateFilterCriteria(idx, res);
        return;
      }

      const filterCriteria: FilterCriteria = {
        ...filterAttribute,
        caseSearch: value,
        isFilterReady: true,
      };
      updateFilterCriteria(idx, filterCriteria);
    },
    [filterAttribute, idx, updateFilterCriteria],
  );

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
    <Block marginBottom='scale500'>
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
