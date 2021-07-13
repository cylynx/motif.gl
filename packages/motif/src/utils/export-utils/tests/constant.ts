export const stateWithPosition = {
  graphList: [
    {
      nodes: [{ id: 'node-1' }, { id: 'node-2' }],
      edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
    },
    {
      nodes: [{ id: 'node-3' }, { id: 'node-4' }],
      edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
    },
    {
      nodes: [{ id: 'node-5' }, { id: 'node-6' }],
      edges: [{ id: 'edge-3', source: 'node-5', target: 'node-6' }],
    },
  ],
  graphFlatten: {
    nodes: [
      {
        id: 'node-1',
        x: 1,
        y: 1,
      },
      {
        id: 'node-2',
        x: 2,
        y: 2,
      },
      {
        id: 'node-3',
        x: 3,
        y: 3,
      },
      {
        id: 'node-4',
        x: 4,
        y: 4,
      },
      {
        id: 'node-5',
        x: 5,
        y: 5,
      },
      {
        id: 'node-6',
        x: 6,
        y: 6,
      },
    ],
    edges: [
      { id: 'edge-1', source: 'node-1', target: 'node-2' },
      {
        id: 'edge-2',
        source: 'node-3',
        target: 'node-4',
      },
      {
        id: 'edge-3',
        source: 'node-5',
        target: 'node-6',
      },
    ],
  },
};

export const stateWithoutPosition = {
  graphList: [
    {
      nodes: [{ id: 'node-1' }, { id: 'node-2' }],
      edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
    },
    {
      nodes: [{ id: 'node-3' }, { id: 'node-4' }],
      edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
    },
    {
      nodes: [{ id: 'node-5' }, { id: 'node-6' }],
      edges: [{ id: 'edge-3', source: 'node-5', target: 'node-6' }],
    },
  ],
  graphFlatten: {
    nodes: [
      {
        id: 'node-1',
      },
      {
        id: 'node-2',
      },
      {
        id: 'node-3',
      },
      {
        id: 'node-4',
      },
      {
        id: 'node-5',
      },
      {
        id: 'node-6',
      },
    ],
    edges: [
      { id: 'edge-1', source: 'node-1', target: 'node-2' },
      {
        id: 'edge-2',
        source: 'node-3',
        target: 'node-4',
      },
      {
        id: 'edge-3',
        source: 'node-5',
        target: 'node-6',
      },
    ],
  },
};
