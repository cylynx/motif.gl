import get from 'lodash/get';
import shortid from 'shortid';

import { Value } from 'baseui/select';
import { useDispatch, useSelector } from 'react-redux';
import { GraphFilterAction, GraphAttribute } from './types';
import {
  Node,
  Edge,
  GraphData,
  FilterCriteria,
  FilterOptions,
} from '../../../../Graph';

import {
  updateFilterAttributes,
  removeFilterAttributes,
  resetFilters,
  getFilterOptions,
} from '../../../../../redux';

const useGraphFilter = (): GraphFilterAction => {
  const dispatch = useDispatch();
  const filterOptions: FilterOptions = useSelector((state) =>
    getFilterOptions(state),
  );

  const getStringOptions = (
    attribute: GraphAttribute,
    graphFlatten: GraphData,
    criteria: string,
  ): Value => {
    const properties: (Node | Edge)[] = graphFlatten[attribute];
    const stringValues: string[] = properties.map((node: Node | Edge) => {
      const data: string = get(node, criteria);
      return data;
    });

    const optionsSet: Set<string> = new Set(stringValues);
    const options: Value = [...optionsSet].map((value: string) => ({
      id: value,
      label: value,
    }));

    return options;
  };

  const addFilter = (): void => {
    const key: string = shortid.generate();
    const criteria: FilterCriteria = {};
    dispatch(updateFilterAttributes({ key, criteria }));
  };

  const deleteFilter = (key: string): void => {
    dispatch(removeFilterAttributes({ key }));
  };

  const resetFilter = (): void => {
    dispatch(resetFilters());
  };

  const getFilterCriteria = (key: string): FilterCriteria => {
    return filterOptions[key] ?? {};
  };

  const updateFilterCriteria = (
    key: string,
    criteria: FilterCriteria,
  ): void => {
    dispatch(updateFilterAttributes({ key, criteria }));
  };

  return [
    filterOptions,
    {
      getStringOptions,
      getFilterCriteria,
      addFilter,
      deleteFilter,
      updateFilterCriteria,
      resetFilter,
    },
  ] as GraphFilterAction;
};

export default useGraphFilter;
