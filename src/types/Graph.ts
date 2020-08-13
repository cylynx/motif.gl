import { Node as GraphinNode, Edge as GraphinEdge } from '@antv/graphin/';

export interface Edge extends Omit<GraphinEdge, 'style'> {
  style: Partial<GraphinEdge['style']>;
}

export interface Node extends Omit<GraphinNode, 'data'> {
  data: Partial<GraphinNode['data']> & {
    [property: string]: any;
  };
}

export interface Metadata {
  key: number;
  search_size?: number;
  retrieved_size?: number;
  title?: string;
}

export interface Data {
  nodes: Node[];
  edges: Edge[];
  metadata?: Metadata;
}

export type TimeRange = [number, number];
export type TimeSeries = Array<[number, number]> | [];
export type EdgeAccessor<T> = (edge: Edge) => T;
export type NodeAccessor<T> = (node: Node) => T;

// export interface AccessorFns {
//   getEdgeSource: EdgeAccessor<string>;
//   getEdgeTarget: EdgeAccessor<string>;
//   getEdgeID?: EdgeAccessor<string>;
//   getEdgeSourceAdd?: EdgeAccessor<string>;
//   getEdgeTargetAdd?: EdgeAccessor<string>;
//   getEdgeLabel?: EdgeAccessor<string>;
//   getEdgeTime?: EdgeAccessor<number>;
//   getEdgeScore?: EdgeAccessor<number>;
//   getEdgeWidth?: EdgeAccessor<number>;
//   getNodeID?: NodeAccessor<string>;
//   getNodeLabel?: NodeAccessor<string>;
// }

export interface AccessorFns {
  getEdgeSource: string;
  getEdgeTarget: string;
  getEdgeID?: string;
  getEdgeSourceAdd?: string;
  getEdgeTargetAdd?: string;
  getEdgeLabel?: string;
  getEdgeTime?: string;
  getEdgeScore?: string;
  getEdgeWidth?: string;
  getNodeID?: string;
  getNodeLabel?: string;
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
