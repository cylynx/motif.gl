import * as DATA from '../constants/sample-data';
import {
  importJson,
  importEdgeListCsv,
  importNodeEdgeCsv,
  addRequiredFieldsJson,
} from './import-data';

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
      id2: '1',
    },
    {
      id2: '2',
    },
  ],
  edges: [
    {
      id2: 'txn 1-2',
      from: '1',
      to: '2',
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

describe('Pre-process Json data correctly', () => {
  it('should add the required node id fields', () => {
    const results = addRequiredFieldsJson(processedData, accessors2);
    expect(results.nodes[0].id).toEqual('1');
    expect(results.nodes[1].id).toEqual('2');
  });
  it('should add the required edge id, source, target fields', () => {
    const results = addRequiredFieldsJson(processedData, accessors2);
    expect(results.edges[0].id).toBeTruthy();
    expect(results.edges[0].source).toEqual('1');
    expect(results.edges[0].target).toEqual('2');
  });
  it('should keep id, source and target fields as string after processing', async () => {
    const results = await importJson(processedData, accessors2);
    expect(results[0].edges[0].id).toBeTruthy();
    expect(results[0].edges[0].source).toEqual('1');
    expect(results[0].edges[0].target).toEqual('2');
  });
});

const edgeListCsv = `custom_id,data.value,data.blk_ts_unix,from,to
1,100,NaN,a,b
2,200,2000000,b,c
3,300,Null,c,b`;

const edgeListAccessors = {
  edgeID: 'custom_id',
  edgeSource: 'from',
  edgeTarget: 'to',
};

describe('Import edge list csv', () => {
  it('should output valide json graph object', async () => {
    const results = await importEdgeListCsv(edgeListCsv, edgeListAccessors);
    expect(results).toHaveProperty('nodes', 'edges', 'metadata');
  });
  it('should map id, source and target accessors correctly', async () => {
    const results = await importEdgeListCsv(edgeListCsv, edgeListAccessors);
    expect(results.nodes).toHaveLength(3);
    expect(results.nodes[0]).toHaveProperty('id');
    expect(results.edges).toHaveLength(3);
    expect(results.edges[0]).toHaveProperty('id', 'from', 'to');
  });
});

const nodeCsv = `id,data.value
a,100
b,200
c,300`;

describe('Import node edge csv', () => {
  it('should output valide json graph object', async () => {
    const results = await importNodeEdgeCsv(
      nodeCsv,
      edgeListCsv,
      edgeListAccessors,
    );
    expect(results).toHaveProperty('nodes', 'edges', 'metadata');
  });
  it('should map id, source and target accessors correctly', async () => {
    const results = await importNodeEdgeCsv(
      nodeCsv,
      edgeListCsv,
      edgeListAccessors,
    );
    expect(results.nodes).toHaveLength(3);
    expect(results.nodes[0]).toHaveProperty('id');
    expect(results.edges).toHaveLength(3);
    expect(results.edges[0]).toHaveProperty('id', 'from', 'to');
    expect(results.edges[0].id).toEqual('1');
  });
});
