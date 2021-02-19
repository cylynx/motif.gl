import { Value } from 'baseui/select';
import { EdgeNode, GraphAttribute, SearchOptions } from '../../../redux/graph';

export type TActiveKey = {
  activeKey: GraphAttribute;
};

export interface IUseSearchOptions {
  searchOptions: SearchOptions;
  updateNodeSearch: (value: Value) => void;
  updateSearchResults: (results: EdgeNode[]) => void;
  updateTabs: (activeTab: GraphAttribute) => void;
}
