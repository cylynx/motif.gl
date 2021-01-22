import { EdgeConfig, NodeConfig } from '@antv/graphin';
import { Value } from 'baseui/select';
import { SelectVariableOption } from '../../components/SelectVariable/SelectVariable';
import { HistogramProp } from '../../containers/SidePanel/FilterPanel/FilterSelection/RangePlot';

export type Field = {
  analyzerType: string;
  id?: string;
  name: string;
  format: string;
  type: string;
  filterProps?: any;
};

export type NodeColorFixed = {
  id: 'fixed';
  value: string;
};

export type NodeColorLegend = {
  id: 'legend';
  variable: string;
  /** Map of variable keys to color strings */
  mapping: {
    [key: string]: string;
  };
};

export type NodeSizeFixed = {
  id: 'fixed';
  value: number;
};

export type NodeSizeDegree = {
  id: 'degree';
  range: [number, number];
};

export type NodeSizeProperty = {
  id: 'property';
  variable: string;
  range: [number, number];
};

export type NodeSize = NodeSizeFixed | NodeSizeDegree | NodeSizeProperty;

export type Selection = {
  label: string;
  id: string;
  type: string;
  selected: boolean;
};

export interface GraphState {
  accessors: Accessors;
  styleOptions: StyleOptions;
  filterOptions: FilterOptions;
  graphList: GraphList;
  graphFlatten: GraphData;
  nodeSelection: Selection[];
  edgeSelection: Selection[];
}

export type ImportFormat = JsonImport | EdgeListCsv | NodeEdgeCsv;

export type NodeEdgeDataType = {
  nodeData: string;
  edgeData: string;
};

export type JsonImport = {
  data: GraphData | GraphList | void;
  type: 'json';
};

export type EdgeListCsv = {
  data: string;
  type: 'edgeListCsv';
};

export type NodeEdgeCsv = {
  data: NodeEdgeDataType;
  type: 'nodeEdgeCsv';
};

export declare type Edge = EdgeConfig;
export declare type Node = NodeConfig;

export type GraphFields = {
  nodes: Field[] | [];
  edges: Field[] | [];
};

export interface Metadata {
  key?: number | string;
  fields?: GraphFields;
  search_size?: number;
  retrieved_size?: number;
  title?: string;
  visible?: boolean;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  metadata?: Metadata;
  key?: number | string;
}

export type GraphList = GraphData[];
export type EdgeNode = Node | Edge;

export interface Accessors {
  nodeID?: string;
  nodeType?: string;
  edgeID?: string;
  edgeType?: string;
  edgeSource: string;
  edgeTarget: string;
  edgeTime?: string;
}

export type ArrowOptions = 'none' | 'display';

export type EdgeWidthFixed = {
  id: 'fixed';
  value: number;
};

export type EdgeWidthProperty = {
  id: 'property';
  variable: string;
  range: [number, number];
};

export type EdgeWidth = EdgeWidthFixed | EdgeWidthProperty;

export interface EdgeStyleOptions {
  width?: EdgeWidth;
  pattern?: 'none' | 'dot' | 'dash' | 'dash-dot';
  fontSize?: number;
  label?: string;
  arrow?: ArrowOptions;
}

export interface Layout {
  type:
    | 'concentric'
    | 'force'
    | 'radial'
    | 'grid'
    | 'dagre'
    | 'circular'
    | 'gForce'
    | 'fruchterman'
    | 'mds'
    | 'comboForce'
    | 'none';
  [key: string]: any;
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface StyleOptions {
  layout?: Layout;
  resetView?: boolean;
  groupEdges?: boolean;
  nodeStyle?: NodeStyleOptions;
  edgeStyle?: EdgeStyleOptions;
}

export type FilterCriteria = {
  id?: string;
  from?: string;
  range?: [number, number];
  caseSearch?: Value;
  analyzerType?: string;
  selection?: SelectVariableOption[];
  stringOptions?: Value;
  histogram?: HistogramProp;
  isFilterReady?: boolean;
};

export interface FilterOptions {
  [key: string]: FilterCriteria;
}

export type NodeColor = NodeColorFixed | NodeColorLegend;
export interface NodeStyleOptions {
  size?: NodeSize;
  color?: NodeColor;
  fontSize?: number;
  label?: string;
}

export type GraphAttribute = 'nodes' | 'edges';

export type TimeRange = [number, number];
export type TimeSeries = Array<[number, number]> | [];
