export interface StyleOptions {
  layout: {
    name: string;
  };
  nodeSize: string;
  edgeWidth: string;
  resetView: boolean;
  groupEdges: boolean;
}

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
  style: object;
  data?: {
    category?: string;
    label?: string;
  };
}

export interface Data {
  nodes: Node[];
  edges: Edge[];
  metadata?: object;
}

export interface MinMax {
  min: number;
  max: number;
}

export type GetEdgeNumber = (edge: Edge) => number | number[];
