import { Value } from 'baseui/select';
import {
  FilterCriteria,
  FilterOptions,
  GraphData,
  GraphAttribute,
} from '../../../../../redux/graph';

export interface GraphFilterActions {
  filterOptions: FilterOptions;
  addFilter: () => void;
  deleteFilter: (key: string) => void;
  resetFilter: () => void;
  getStringOptions: (
    attribute: GraphAttribute,
    graphFlatten: GraphData,
    criteria: string,
  ) => Value;
  updateFilterCriteria: (key: string, criteria: FilterCriteria) => void;
  getFilterCriteria: (key: string) => FilterCriteria;
}
