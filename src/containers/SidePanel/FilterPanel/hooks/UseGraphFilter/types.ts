import { Value } from 'baseui/select';
import { FilterCriteria, FilterOptions } from '../../../../Graph';

export type GraphAttribute = 'nodes' | 'edges';

interface GraphFilterActions {
  getStringOptions: (attribute: GraphAttribute, criteria: string) => Value;
  addFilter: () => void;
  deleteFilter: (key: string) => void;
  updateFilterCriteria: (key: string, criteria: FilterCriteria) => void;
  getFilterCriteria: (key: string) => FilterCriteria;
}

export type GraphFilterAction = [FilterOptions, GraphFilterActions];
