/* eslint-disable prefer-const, no-console */
// @ts-nocheck
import Neo4j from 'neo4j-driver';
import { Node, Edge, GraphData } from '@cylynx/motif';
import Record from 'neo4j-driver/types/record';
import uniqBy from 'lodash.uniqby';

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
    relationship: e.type,
  };

  if (e.properties) {
    for (let [key, value] of Object.entries(e.properties)) {
      edge[key] = value instanceof Neo4j.types.Integer ? value.toInt() : value;
    }
  }

  return { ...edge };
};

/* Adapted from https://github.com/neo4j-contrib/neovis.js/blob/master/src/neovis.js */
export const toMotifFormat = (records: Record[]): GraphData => {
  let nodes: Node[] = [];
  let edges: Edge[] = [];
  records.forEach((record) => {
    Object.values(record.toObject()).map(async (v) => {
      if (v instanceof Neo4j.types.Node) {
        let node = buildNode(v);
        try {
          nodes.push(node);
        } catch (e) {
          console.log(e, 'error');
        }
      } else if (v instanceof Neo4j.types.Relationship) {
        let edge = buildEdge(v);
        edges.push(edge);
      } else if (v instanceof Neo4j.types.Path) {
        let startNode = buildNode(v.start);
        let endNode = buildNode(v.end);

        nodes.push(startNode);
        nodes.push(endNode);

        for (let obj of v.segments) {
          nodes.push(buildNode(obj.start));
          nodes.push(buildNode(obj.end));
          edges.push(buildEdge(obj.relationship));
        }
      } else if (v instanceof Array) {
        for (let obj of v) {
          if (obj instanceof Neo4j.types.Node) {
            let node = buildNode(obj);
            nodes.push(node);
          } else if (obj instanceof Neo4j.types.Relationship) {
            let edge = buildEdge(obj);
            edges.push(edge);
          }
        }
      } else {
        console.log('Invalid format');
      }
    });
  });

  // produce duplicate free nodes to display in table preview
  nodes = uniqBy(nodes, 'id');
  edges = uniqBy(edges, 'id');

  const graphData: GraphData = {
    nodes,
    edges,
  };
  
  return graphData;
};
