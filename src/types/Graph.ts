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

export interface Data {
  nodes: Node[];
  edges: Edge[];
  metadata?: object;
}

export type GetEdgeNumber = (edge: Edge) => number | number[];
