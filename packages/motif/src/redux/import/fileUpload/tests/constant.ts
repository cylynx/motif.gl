export const singleSimpleGraph = {
  nodes: [{ id: 'node-3' }, { id: 'node-4' }],
  edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
  metadata: {
    key: 234,
    fields: {
      edges: [
        {
          analyzerType: 'STRING',
          format: '',
          name: 'id',
          type: 'string',
        },
        {
          analyzerType: 'STRING',
          format: '',
          name: 'source',
          type: 'string',
        },
        {
          analyzerType: 'STRING',
          format: '',
          name: 'target',
          type: 'string',
        },
      ],
      nodes: [
        {
          analyzerType: 'STRING',
          format: '',
          name: 'id',
          type: 'string',
        },
      ],
    },
    groupEdges: {
      availability: false,
      toggle: false,
    },
  },
};

export const multipleSimpleGraph = [
  singleSimpleGraph,
  {
    nodes: [{ id: 'node-1' }, { id: 'node-2' }],
    edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
    metadata: {
      key: 123,
      fields: {
        edges: [
          {
            analyzerType: 'STRING',
            format: '',
            name: 'id',
            type: 'string',
          },
          {
            analyzerType: 'STRING',
            format: '',
            name: 'source',
            type: 'string',
          },
          {
            analyzerType: 'STRING',
            format: '',
            name: 'target',
            type: 'string',
          },
        ],
        nodes: [
          {
            analyzerType: 'STRING',
            format: '',
            name: 'id',
            type: 'string',
          },
        ],
      },
      groupEdges: {
        availability: false,
        toggle: false,
      },
    },
  },
];

export const restrictedWordJson = {
  nodes: [
    { id: 'node-3', type: 'special' },
    { id: 'node-4', type: 'normal' },
  ],
  edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
  metadata: {
    key: 234,
  },
};

export const singleNodeEdgeData = {
  edgeCsv: [
    {
      fileName: 'edge.csv',
      content:
        'id,relation,source,target\ntxn1,hello,a,b\ntxn2,works,b,c\ntxn3,abc,c,a',
    },
  ],
  nodeCsv: [
    {
      fileName: 'node.csv',
      content: 'id,value,score\na,20,80\nb,40,100\nc,60,123',
    },
  ],
};

export const restrictedNodeEdge = {
  edgeCsv: [
    {
      fileName: 'edge.csv',
      content:
        'id,relation,source,target\ntxn1,hello,a,b\ntxn2,works,b,c\ntxn3,abc,c,a',
    },
  ],
  nodeCsv: [
    {
      fileName: 'node.csv',
      content: 'id,value,type\na,20,normal\nb,40,normal\nc,60,special',
    },
  ],
};

export const multipleNodeEdgeData = {
  edgeCsv: [
    {
      fileName: 'edge-1.csv',
      content:
        'id,relation,source,target\ntxn1,hello,a,b\ntxn2,works,b,c\ntxn3,abc,c,a',
    },
    {
      fileName: 'edge-2.csv',
      content:
        'id,relation,source,target\ntxn1,hello,a,b\ntxn2,works,b,c\ntxn3,abc,c,a',
    },
  ],
  nodeCsv: [
    {
      fileName: 'node-1.csv',
      content: 'id,value,score\na,20,80\nb,40,100\nc,60,123',
    },
    {
      fileName: 'node-2.csv',
      content: 'id,value,score\na,20,80\nb,40,100\nc,60,123',
    },
  ],
};

export const edgeListCsv =
  'id,type,source,target\ntxn1,works,jason,cylynx\ntxn3,abc,cylynx,timothy\ntxn4,says hi to,swan,cylynx';
