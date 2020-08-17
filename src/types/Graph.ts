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
  nodes: Field[];
  edges: Field[];
};

export interface Metadata {
  key: number | string;
  fields?: GraphFields;
  search_size?: number;
  retrieved_size?: number;
  title?: string;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  metadata?: Metadata;
}

export type GraphList = GraphData[];

export type TimeRange = [number, number];
export type TimeSeries = Array<[number, number]> | [];
export type EdgeAccessor<T> = (edge: Edge) => T;
export type NodeAccessor<T> = (node: Node) => T;

export interface Accessors {
  edgeSource: string;
  edgeTarget: string;
  edgeID?: string;
  edgeSourceAdd?: string;
  edgeTargetAdd?: string;
  edgeLabel?: string;
  edgeTime?: string;
  edgeScore?: string;
  edgeWidth?: string;
  nodeID?: string;
  nodeLabel?: string;
}

export interface Layout {
  name: 'concentric' | 'force' | 'radial' | 'grid' | 'dagre' | 'circle';
  options?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface StyleOptions {
  layout: Layout;
  nodeSize: string;
  edgeWidth: string;
  resetView: boolean;
  groupEdges: boolean;
}

export interface ChartData {
  name: string;
  value: number;
}
