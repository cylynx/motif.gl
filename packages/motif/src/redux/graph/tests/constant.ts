export const whitespaceNodeEdge = {
  edgeCsv: [
    {
      fileName: 'test-1.csv',
      content:
        'id,relation,source,target\ntxn1,hello,   a,b   \ntxn2,works,b  ,c \ntxn3,abc,c  ,  a',
    },
  ],
  nodeCsv: [
    {
      fileName: 'test-2.csv',
      content: 'id,value,score\n   a,20,80\nb   ,40,100\n   c,60,123',
    },
  ],
};

export const numericAccessorsNodeEdge = {
  edgeCsv: [
    {
      fileName: 'numeric-accessors-1.csv',
      content:
        'id,relation,numeric_source,numeric_target\ntxn1,hello,1,2\ntxn2,works,2,3\ntxn3,abc,3,1\n',
    },
  ],
  nodeCsv: [
    {
      fileName: 'numeric-accessors-2.csv',
      content: 'custom_id,value,score\n1,20,80\n2,40,100\n3,60,123',
    },
  ],
};

export const sampleJson1 = {
  nodes: [
    {
      id: 'node-1',
      node1: '1',
    },
    {
      id: 'node-2',
      node1: '2',
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      edge1: '1',
    },
    {
      id: 'edge-2',
      source: 'node-2',
      target: 'node-1',
      edge1: '2',
    },
  ],
};

export const sampleJson2 = {
  nodes: [
    {
      id: 'node-1',
      node2: '1',
    },
    {
      id: 'node-2',
      node2: '2',
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      edge2: '1',
    },
    {
      id: 'edge-2',
      source: 'node-2',
      target: 'node-1',
      edge2: '2',
    },
  ],
};
