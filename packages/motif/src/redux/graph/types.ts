import { Value } from 'baseui/select';
import { IUserEdge, IUserNode } from '@cylynx/graphin';
import { RestNode } from '@cylynx/graphin/lib/typings/type';
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

export type ColorFixed = {
  id: 'fixed';
  value: string;
};

export type ColorLegend = {
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

export type JsonImport = GraphData | TLoadFormat | GraphList | void;
export type EdgeListCsv = string;
export type NodeEdgeCsv = NodeEdgeDataType;

export declare type Edge = IUserEdge;
export declare type Node = IUserNode;

export type NodePositions = {
  x: RestNode['x'];
  y: RestNode['y'];
};

export type GraphFields = {
  nodes: Field[];
  edges: Field[];
};

/** ======================================
 *  Graph's Metadata - Group Edges
 ** ====================================== */
export type NumericAggregations = 'min' | 'max' | 'average' | 'count' | 'sum';
export type StringAggregations = 'first' | 'last' | 'most_frequent';
export type FieldAndAggregation = {
  field: string;
  aggregation: (NumericAggregations | StringAggregations)[] | [];
};
export type GroupEdgeFields = {
  [key: string]: FieldAndAggregation;
};
export type GroupEdges = {
  toggle?: boolean;

  /* determine whether graph has duplicate connectivity */
  availability?: boolean;
  type?: string;
  fields?: GroupEdgeFields;
  ids?: string[];
};

export interface Metadata {
  key?: number | string;
  fields?: GraphFields;
  title?: string;
  visible?: boolean;
  groupEdges?: GroupEdges;

  // allow adding custom fields
  [key: string]: any;
}

export type GroupEdgePayload = {
  index: number;
  key: 'toggle' | 'type';
  value: boolean | string;
};

export type DeleteGroupEdgeFieldPayload = {
  graphIndex: number;
  fieldIndex: string;
};

export type UpdateGroupEdgeFieldPayload = {
  index: number;
  fieldId: string;
  value: string | FieldAndAggregation['aggregation'];
};

export type UpdateGroupEdgeIds = {
  graphIndex: number;
  groupEdgeIds: string[];
};

export type GroupEdgeCandidates = Record<string, Edge[]>;

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

export type LayoutParams = {
  layout: {
    id: Layout['types'];
    [key: string]: any;
  };
};

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

export type EdgeColor = ColorFixed | ColorLegend;
export interface EdgeStyleOptions {
  width?: EdgeWidth;
  pattern?: 'none' | 'dot' | 'dash' | 'dash-dot';
  fontSize?: number;
  color?: EdgeColor;
  label?: string | string[];
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

export type NodeColor = ColorFixed | ColorLegend;
export interface NodeStyleOptions {
  size?: NodeSize;
  color?: NodeColor;
  fontSize?: number;
  label?: string | string[];
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
  // not necessary to enforce overwrite styles.
  style?: StyleOptions;
  filter?: FilterOptions;
}

export type NodePosParams = NodePositions & {
  nodeId: Node['id'];
};
