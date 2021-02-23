import { Value } from 'baseui/select';
import {
  GraphAttribute,
  SearchOptions,
  Node,
  EdgeInformation,
} from '../../../redux/graph';

export type TActiveKey = {
  activeKey: GraphAttribute;
};

export interface IUseSearchOptions {
  searchOptions: SearchOptions;
  updateNodeSearch: (value: Value) => void;
  updateEdgeSearch: (value: Value) => void;
  updateTabs: (activeTab: GraphAttribute) => void;
  updateNodeResults: (node: Node[]) => void;
  updateEdgeResults: (edge: EdgeInformation[]) => void;
  updatePagination: (
    currentPage: number,
    totalItems: number,
    totalPage: number,
  ) => void;
}
