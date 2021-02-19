import { Value } from 'baseui/select';
import { EdgeNode, SearchOptions } from '../../../redux/graph';

export type TActiveKey = {
  activeKey: string;
};

export interface IUseSearchOptions {
  searchOptions: SearchOptions;
  updateNodeSearch: (value: Value) => void;
  updateSearchResults: (results: EdgeNode[]) => void;
}
