import { Value } from 'baseui/select';
import { IUserEdge, IUserNode } from '@antv/graphin/lib/typings/type';
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
  searchOptions: SearchOptions;
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
  data: GraphData | TLoadFormat | GraphList | void;
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

export declare type Edge = IUserEdge;
export declare type Node = IUserNode;

export type GraphFields = {
  nodes: Field[];
  edges: Field[];
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
export type NodeItemType = 'source' | 'target' | 'normal';

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
    | 'graphin-force'
    | 'fruchterman'
    | 'mds'
    | 'comboForce'
    | 'preset';
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
  type?: string;
  selection?: SelectVariableOption[];
  stringOptions?: Value;
  histogram?: HistogramProp;
  isFilterReady?: boolean;
  format?: string;
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

/** --------------------------------------------
 *  Search Panels
 ** -------------------------------------------- */
export type SearchOptionPayload = {
  key: keyof SearchOptions;
  value: GraphAttribute | Value | EdgeNode[] | SearchOptPagination;
};

export type EdgeInformation = {
  sourceNode: Node;
  edge: Edge;
  targetNode: Node;
};

export type ItemProperties = {
  nodes: Node[];
  edges: EdgeInformation[];
};

export type SearchResultPayload = {
  value: Node[] | EdgeInformation[];
};

export type SearchOptPagination = {
  currentPage: number;
  totalPage: number;
  totalItems: number;
};
export interface SearchOptions {
  activeTabs: GraphAttribute;
  nodeSearchCase: Value;
  edgeSearchCase: Value;
  results: ItemProperties;
  pagination: SearchOptPagination;
}

/** ==============================
 *  Export and Import Data
 ** ============================== */

export interface TLoadFormat {
  data: GraphList;
  style: StyleOptions;
}
