export interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
  title: string;
  style?: {
    line?: {
      width: number;
    };
    endArrow: boolean;
  };
  data?: object;
}

export interface Node {
  id: string;
  label: string;
  style: {
    nodeSize: number;
    primaryColor: string;
  };
  data?: {
    category?: string;
    label?: string;
    _key?: string;
    _id?: string;
    _rev?: string;
    address?: string;
    created_ts_unix?: number;
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

export interface StyleOptions {
  layout: {
    name: string;
    options?: object;
  };
  nodeSize: string;
  edgeWidth: string;
  resetView: boolean;
  groupEdges: boolean;
}
