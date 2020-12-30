import get from 'lodash/get';
import shortid from 'shortid';

import { Value } from 'baseui/select';
import { GraphFilterAction, GraphAttribute } from './types';
import {
  Node,
  Edge,
  GraphData,
  FilterCriteria,
  FilterOptions,
} from '../../../../Graph';

import { useDispatch, useSelector } from 'react-redux';
import {
  updateFilterAttributes,
  removeFilterAttributes,
  getFilterOptions,
} from '../../../../../redux';

const useGraphFilter = (graphFlatten: GraphData): GraphFilterAction => {
  const dispatch = useDispatch();
  const filterOptions: FilterOptions = useSelector((state) =>
    getFilterOptions(state),
  );

  const getStringOptions = (
    attribute: GraphAttribute,
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

  return [
    filterOptions,
    { getStringOptions, addFilter, deleteFilter },
  ] as GraphFilterAction;
};

export default useGraphFilter;
