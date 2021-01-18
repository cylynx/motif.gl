import * as Graph from '../../containers/Graph/types';

export type Selection = {
  label: string;
  id: string;
  type: string;
  selected: boolean;
};

export interface GraphState {
  accessors: Graph.Accessors;
  styleOptions: Graph.StyleOptions;
  filterOptions: Graph.FilterOptions;
  graphList: Graph.GraphList;
  graphFlatten: Graph.GraphData;
  nodeSelection: Selection[];
  edgeSelection: Selection[];
}
