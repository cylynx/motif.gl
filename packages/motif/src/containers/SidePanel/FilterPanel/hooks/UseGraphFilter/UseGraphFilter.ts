import get from 'lodash/get';
import shortid from 'shortid';

import { Value } from 'baseui/select';
import { useDispatch, useSelector } from '../../../../../redux/hooks';
import { GraphFilterActions } from './types';

import {
  GraphSlices,
  GraphSelectors,
  GraphAttribute,
  Node,
  Edge,
  GraphData,
  FilterCriteria,
  FilterOptions,
} from '../../../../../redux/graph';

const useGraphFilter = (): GraphFilterActions => {
  const dispatch = useDispatch();
  const filterOptions: FilterOptions = useSelector((state) =>
    GraphSelectors.getFilterOptions(state),
  );

  const getStringOptions = (
    attribute: GraphAttribute,
    graphFlatten: GraphData,
    criteria: string,
  ): Value => {
    const properties: (Node | Edge)[] = graphFlatten[attribute];
    const stringValues: string[] = properties.map((node: Node | Edge) => {
      const data = get(node, criteria) as string;
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
    dispatch(GraphSlices.updateFilterAttributes({ key, criteria }));
  };

  const deleteFilter = (key: string): void => {
    dispatch(GraphSlices.removeFilterAttributes({ key }));
  };

  const resetFilter = (): void => {
    dispatch(GraphSlices.resetFilters());
  };

  const getFilterCriteria = (key: string): FilterCriteria => {
    return filterOptions[key] ?? {};
  };

  const updateFilterCriteria = (
    key: string,
    criteria: FilterCriteria,
  ): void => {
    dispatch(GraphSlices.updateFilterAttributes({ key, criteria }));
  };

  return {
    filterOptions,
    getStringOptions,
    getFilterCriteria,
    addFilter,
    deleteFilter,
    updateFilterCriteria,
    resetFilter,
  } as GraphFilterActions;
};

export default useGraphFilter;
