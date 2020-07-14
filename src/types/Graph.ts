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

export type GetEdgeNumber = (edge: Edge) => number | number[];
export type GetEdgeString = (edge: Edge) => string;
export type GetNodeString = (edge: Node) => string;

export interface GetFns {
  getEdgeSource?: GetEdgeString;
  getEdgeTarget?: GetEdgeString;
  getEdgeSourceAdd?: GetEdgeString;
  getEdgeTargetAdd?: GetEdgeString;
  getEdgeLabel?: GetEdgeString;
  getEdgeTime?: GetEdgeNumber;
  getEdgeScore?: GetEdgeNumber;
  getEdgeWidth?: GetEdgeNumber;
  getNodeID?: GetNodeString;
  getNodeLabel?: GetNodeString;
}

export interface Layout {
  name: string;
  options?: {
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
