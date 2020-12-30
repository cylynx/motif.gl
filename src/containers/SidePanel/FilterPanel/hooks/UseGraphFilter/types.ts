import { Value } from 'baseui/select';
import { FilterOptions } from '../../../../Graph';

export type GraphAttribute = 'nodes' | 'edges';

interface GraphFilterActions {
  getStringOptions: (attribute: GraphAttribute, criteria: string) => Value;
  addFilter: () => void;
  deleteFilter: (key: string) => void;
}

export type GraphFilterAction = [FilterOptions, GraphFilterActions];
