import * as DATA from '../constants/sample-data';
import { importJson, addRequiredFields } from './import-data';

const accessors = {
  nodeID: 'id',
  edgeSource: 'source',
  edgeTarget: 'target',
};

describe('Import various json data types', () => {
  it('should import valid json graph data object', async () => {
    const results = await importJson(DATA.RandomData, accessors);
    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('nodes', 'edges', 'metadata');
  });
  it('should import valid json graph list array', async () => {
    const results = await importJson([DATA.RandomData], accessors);
    expect(results).toHaveLength(1);
    expect(results[0]).toHaveProperty('nodes', 'edges', 'metadata');
  });
  it('should output a valid graph data for each object in graph list array', async () => {
    const results = await importJson(DATA.TwoDataArray, accessors);
    expect(results).toHaveLength(2);
    expect(results[0]).toHaveProperty('nodes', 'edges', 'metadata');
    expect(results[1]).toHaveProperty('nodes', 'edges', 'metadata');
  });
});

const processedData = {
  nodes: [
    {
      id2: 'a',
    },
    {
      id2: 'b',
    },
  ],
  edges: [
    {
      id2: 'txn a-b',
      from: 'a',
      to: 'b',
    },
  ],
  metadata: {
    key: 123,
  },
};

const accessors2 = {
  nodeID: 'id2',
  edgeSource: 'from',
  edgeTarget: 'to',
};

describe('Pre-process the data correctly', () => {
  it('should add the required node id fields', () => {
    const results = addRequiredFields(processedData, accessors2);
    expect(results.nodes[0].id).toEqual('a');
    expect(results.nodes[1].id).toEqual('b');
  });
  it('should add the required edge id, source, target fields', () => {
    const results = addRequiredFields(processedData, accessors2);
    expect(results.edges[0].id).toBeTruthy();
    expect(results.edges[0].source).toEqual('a');
    expect(results.edges[0].target).toEqual('b');
  });
});
