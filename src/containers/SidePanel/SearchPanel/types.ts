import { Value } from 'baseui/select';
import { NodeConfig } from '@antv/graphin';
import { EdgeNode, GraphAttribute, SearchOptions } from '../../../redux/graph';

export type TActiveKey = {
  activeKey: GraphAttribute;
};

export interface IUseSearchOptions {
  searchOptions: SearchOptions;
  updateNodeSearch: (value: Value) => void;
  updateEdgeSearch: (value: Value) => void;
  updateSearchResults: (results: EdgeNode[]) => void;
  updateTabs: (activeTab: GraphAttribute) => void;
  displayNodeInformation: (nodeConfigs: NodeConfig[]) => void;
}
