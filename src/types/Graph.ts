export interface Edge {
  id: string;
  source: string;
  target: string;
  label: string;
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
  };
}

export interface Metadata {
  search_size?: number;
  retrieved_size?: number;
  key: number;
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
  getEdgeValue?: GetEdgeNumber;
  getNodeID?: GetNodeString;
  getNodeLabel?: GetNodeString;
}
