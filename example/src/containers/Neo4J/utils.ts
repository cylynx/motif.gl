import Neo4j from 'neo4j-driver';
import { Node, Edge } from 'motif.gl';

export const buildNode = (n: any) => {
  let node: Node = {
    id: `node-${n.identity.toString()}`,
    labels: n.labels[0],
  };
  if (n.properties) {
    for (let [key, value] of Object.entries(n.properties)) {
      node[key] = value instanceof Neo4j.types.Integer ? value.toInt() : value;
    }
  }
  return { ...node };
};

export const buildEdge = (e: any) => {
  let edge: Edge = {
    id: `edge-${e.identity.toString()}`,
    source: `node-${e.start.toString()}`,
    target: `node-${e.end.toString()}`,
    erelationship: e.type,
  };

  if (e.properties) {
    for (let [key, value] of Object.entries(e.properties)) {
      edge[key] = value instanceof Neo4j.types.Integer ? value.toInt() : value;
    }
  }

  return { ...edge };
};
