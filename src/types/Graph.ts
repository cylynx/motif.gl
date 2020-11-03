import {
  Node as GraphinNode,
  Edge as GraphinEdge,
  InnerEdgeStyle,
} from '@antv/graphin/';

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

export interface EdgeStyleAccessors {
  label?: string;
  width?: string;
}

export interface NodeStyleAccessors {
  label?: string;
  size?: string;
}

export interface Accessors {
  nodeID?: string;
  nodeStyle?: NodeStyleAccessors;
  nodeType?: string;
  edgeID?: string;
  edgeType?: string;
  edgeSource: string;
  edgeTarget: string;
  edgeTime?: string;
  edgeStyle?: EdgeStyleAccessors;
}

export interface Layout {
  name: 'concentric' | 'force' | 'radial' | 'grid' | 'dagre' | 'circle';
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface NodeStyleOptions {
  size: string;
}

export interface EdgeStyleOptions {
  width: string;
}

export interface StyleOptions {
  layout: Layout;
  resetView: boolean;
  groupEdges: boolean;
  nodeStyle: NodeStyleOptions;
  edgeStyle: EdgeStyleOptions;
}

export interface ChartData {
  name: string;
  value: number;
}
