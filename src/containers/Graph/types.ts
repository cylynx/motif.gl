import { Node as GraphinNode, Edge as GraphinEdge } from '@antv/graphin/';
import { Value } from 'baseui/select';
import { SelectVariableOption } from '../../components/SelectVariable/SelectVariable';
import { HistogramProp } from '../SidePanel/FilterPanel/FilterSelection/RangePlot';

export interface Edge extends Omit<GraphinEdge, 'style'> {
  style?:
    | Partial<GraphinEdge['style']>
    | {
        [property: string]: boolean;
      };
}

export interface Node extends Omit<GraphinNode, 'data'> {
  data?: Partial<GraphinNode['data']> & {
    [property: string]: any;
  };
}

export type EdgeNode = Edge | Node;
export type GraphAttribute = 'nodes' | 'edges';

export type Field = {
  analyzerType: string;
  id?: string;
  name: string;
  format: string;
  type: string;
  filterProps?: any;
};

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

export type TimeRange = [number, number];
export type TimeSeries = Array<[number, number]> | [];

export interface Accessors {
  nodeID?: string;
  nodeType?: string;
  edgeID?: string;
  edgeType?: string;
  edgeSource: string;
  edgeTarget: string;
  edgeTime?: string;
}

export interface Layout {
  name:
    | 'concentric'
    | 'force'
    | 'radial'
    | 'grid'
    | 'dagre'
    | 'circle'
    | 'none';
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

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

export type NodeColor = NodeColorFixed | NodeColorLegend;
export interface NodeStyleOptions {
  size?: NodeSize;
  color?: NodeColor;
  fontSize?: number;
  label?: string;
}

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
export type ArrowOptions = 'none' | 'display';

export interface EdgeStyleOptions {
  width?: EdgeWidth;
  pattern?: 'none' | 'dot' | 'dash' | 'dash-dot';
  fontSize?: number;
  label?: string;
  arrow?: ArrowOptions;
}

export interface StyleOptions {
  layout?: Layout;
  resetView?: boolean;
  groupEdges?: boolean;
  nodeStyle?: NodeStyleOptions;
  edgeStyle?: EdgeStyleOptions;
}

export interface ChartData {
  name: string;
  value: number;
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
