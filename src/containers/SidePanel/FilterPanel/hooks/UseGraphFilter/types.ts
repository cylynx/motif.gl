import { Value } from 'baseui/select';
import { FilterCriteria, FilterOptions, GraphData } from '../../../../Graph';

export type GraphAttribute = 'nodes' | 'edges';

interface GraphFilterActions {
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

export type GraphFilterAction = [FilterOptions, GraphFilterActions];
