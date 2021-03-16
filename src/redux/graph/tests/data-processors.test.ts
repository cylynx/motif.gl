import { TriangleJSON } from '../../../constants/sample-data';
import {
  json2csv,
  csv2json,
  cleanUpValue,
  flattenObject,
  getSampleForTypeAnalyze,
  getFieldsFromData,
  parseJsonByFields,
  processJson,
  processNodeEdgeCsv,
  processEdgeListCsv,
} from '../processors/data';
import { Edge, GraphData, Node } from '../types';

describe('Parsing json to csv', () => {
  // it('should contain the right number of rows (including header)', async () => {
  //   const nodeCsv = await json2csv(TriangleJSON()[0].nodes);
  //   const edgeCsv = await json2csv(TriangleJSON()[0].edges);
  //   expect(nodeCsv.split('\n')).toHaveLength(4);
  //   expect(edgeCsv.split('\n')).toHaveLength(4);
  // });
  // it('should contain id at root level', async () => {
  //   const nodeCsv = await json2csv(TriangleJSON()[0].nodes);
  //   const edgeCsv = await json2csv(TriangleJSON()[0].edges);
  //   expect(nodeCsv).toContain('id');
  //   expect(edgeCsv).toContain('id');
  // });
  // it('should contain nested style fields', async () => {
  //   const nodeCsv = await json2csv(TriangleJSON()[0].nodes);
  //   const edgeCsv = await json2csv(TriangleJSON()[0].edges);
  //   expect(nodeCsv).toContain('style.keyshape.size');
  //   expect(edgeCsv).toContain('style.keyshape.endArrow');
  // });
});

const testCsv = `id,data.value,data.blk_ts_unix,source,target,style.keyshape.endArrow
txn a-b,100,NaN,a,b,true
txn b-c,200,2000000,b,c,true
txn c-b,300,Null,c,b,true
`;

const nodeCsv = `id,data.value
a,100
b,200
c,300
`;

describe('Parsing csv to json', () => {
  it('should contain the right number of objects', async () => {
    const edgeJson = await csv2json(testCsv);
    expect(edgeJson).toHaveLength(3);
  });
  it('should contain all the relevant id fields', async () => {
    const edgeJson = await csv2json(testCsv);
    expect((edgeJson as Edge[]).map((x: Edge) => x.id)).toMatchObject([
      'txn a-b',
      'txn b-c',
      'txn c-b',
    ]);
  });
  it('should convert falsy values to null', async () => {
    const edgeJson = await csv2json(testCsv);
    cleanUpValue(edgeJson);
    expect(edgeJson[0].data.blk_ts_unix).toBeNull();
    expect(edgeJson[2].data.blk_ts_unix).toBeNull();
  });
  it('should be the same when converted from json to csv to json', async () => {
    const edgeCsv = await json2csv(TriangleJSON()[0].edges);
    const edgeJson = await csv2json(edgeCsv as string);
    expect(edgeJson).toMatchObject(TriangleJSON()[0].edges);
  });
  it('should return a GraphData object with valid metadata', async () => {
    const toggleGroupEdge = false;
    const output = await processNodeEdgeCsv(
      nodeCsv as string,
      testCsv as string,
      toggleGroupEdge,
    );
    expect(output).toHaveProperty('nodes');
    expect(output).toHaveProperty('edges');
    expect(output).toHaveProperty('metadata');
    expect(output.metadata.fields.nodes).toHaveLength(2);
    expect(output.metadata.fields.edges).toHaveLength(5);
  });
  it('should return distinct nodes in an edgelist csv format', async () => {
    const toggleGroupEdge = false;
    const output = await processEdgeListCsv(
      testCsv as string,
      'source',
      'target',
      toggleGroupEdge,
    );
    const nodeIds = output.nodes.map((n: Node) => n.id);
    expect(output).toHaveProperty('nodes');
    expect(output).toHaveProperty('edges');
    expect(output).toHaveProperty('metadata');
    expect(nodeIds).toMatchObject(['a', 'b', 'c']);
  });
});

const testObj = {
  a: 1,
  b: {
    c: 'hello',
    e: {
      f: [4, 5, 6],
    },
  },
};

describe('Flatten object', () => {
  it('should exclude array', async () => {
    const flattenObj = flattenObject(testObj);
    expect(flattenObj).toMatchObject({
      a: 1,
      'b.c': 'hello',
      'b.e.f': [4, 5, 6],
    });
  });
});

const complexCsv = `id,data.date,data.datetime,data.unixtsms,data.arrayint,source,target
txn a-b,2016-09-17,2016-09-17 00:09:55,1597563378349,"[1,2]",a,b
txn b-c,2016-09-17,2016-09-17 00:30:08,1297563378349,"[3,4,5]",b,c
txn c-b,2018-10-23,null,1497563378349,"[4,5]",c,b
`;

const arrayCsv = `id,source,target,array1,array2
txn a-b,a,b,"[a,a]","[""a"",""b""]"
txn b-c,b,c,"[b]","[""c"",""z""]"
`;

describe('Process csv data to required json format', () => {
  it('should get correct samples', async () => {
    const edgeJson = await csv2json(testCsv);
    const headerRow = testCsv.split('\n')[0].split(',');
    const sample = getSampleForTypeAnalyze(headerRow, edgeJson as Edge[]);
    const firstEdgeFlatten = flattenObject(edgeJson[0]);
    expect(sample).toHaveLength(3);
    expect(sample[0]).toMatchObject(firstEdgeFlatten);
  });
  it('should exclude restricted columns (id, target, source, style, defaultStyle) when generating fields', async () => {
    const edgeJson = await csv2json(testCsv);
    const headerRow = testCsv.split('\n')[0].split(',');
    const sample = getSampleForTypeAnalyze(headerRow, edgeJson as Edge[]);
    const fields = getFieldsFromData(sample, headerRow);
    expect(fields.map((x) => x.name)).toMatchObject([
      'id',
      'data.value',
      'data.blk_ts_unix',
      'source',
      'target',
    ]);
  });
  it('should parse timestamps and array correctly', async () => {
    const edgeJson = await csv2json(complexCsv);
    cleanUpValue(edgeJson);
    const headerRow = complexCsv.split('\n')[0].split(',');
    const sample = getSampleForTypeAnalyze(headerRow, edgeJson as Edge[]);
    const fields = getFieldsFromData(sample, headerRow);
    expect(fields.map((x) => x.type)).toMatchObject([
      'string',
      'date',
      'timestamp',
      'timestamp',
      'array<integer>',
      'string',
      'string',
    ]);
  });
  it('should parse simple arrays correctly', async () => {
    const edgeJson = await csv2json(arrayCsv);
    cleanUpValue(edgeJson);
    const headerRow = arrayCsv.split('\n')[0].split(',');
    const sample = getSampleForTypeAnalyze(headerRow, edgeJson as Edge[]);
    const fields = getFieldsFromData(sample, headerRow);
    expect(fields.map((x) => x.type)).toMatchObject([
      'string',
      'string',
      'string',
      'array<string>',
      'array<string>',
    ]);
  });
  it('should parse the dataset correctly', async () => {
    const edgeJson = (await csv2json(testCsv)) as Edge[];
    cleanUpValue(edgeJson);
    const headerRow = testCsv.split('\n')[0].split(',');
    const sample = getSampleForTypeAnalyze(headerRow, edgeJson);
    const fields = getFieldsFromData(sample, headerRow);
    const cleanedJson = parseJsonByFields(edgeJson, fields);
    expect(cleanedJson[0].data.blk_ts_unix).toBeNull();
    expect(cleanedJson[1].data.blk_ts_unix).toEqual(2000000);
    expect(cleanedJson[2].style.keyshape.endArrow).toEqual(true);
  });
});

const testJson = {
  nodes: [{ id: 'a' }, { id: 'b' }],
  edges: [{ id: 'a-b', source: 'a', target: 'b' }],
  metadata: {
    customField: 'hello',
    key: 10,
  },
};

describe('Process json data', () => {
  describe('Fault Tolerance', () => {
    it('should throw if no nodes or edges is in the json', async () => {
      const groupEdgeToggle = false;

      // assign wrong data format to trigger error conditions
      // @ts-ignore
      const errorJson: GraphData = { nodals: 'a', edges: 'b' };
      await expect(processJson(errorJson, groupEdgeToggle)).rejects.toThrow();
    });

    it('should not parse undefined fields', async () => {
      const testJsonWithUdf = {
        ...testJson,

        // @ts-ignore
        udf: undefined,
      };
      const groupEdgeToggle = false;
      const results = await processJson(testJsonWithUdf, groupEdgeToggle);
      expect(results.metadata.fields).not.toHaveProperty('udf');
    });
  });

  describe('Accuracy', () => {
    let results: GraphData;
    beforeEach(async () => {
      const groupEdgeToggle = false;
      results = await processJson(testJson, groupEdgeToggle);
    });

    afterEach(() => {
      results = undefined;
    });

    it('should return the exact object if all the main keys are there', () => {
      results.metadata.groupEdges = { toggle: false, availability: false };
      Object.assign(results.metadata, {
        groupEdges: { toggle: false, availability: false },
        fields: {
          nodes: [
            { analyzerType: 'STRING', format: '', name: 'id', type: 'string' },
          ],
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
        },
      });

      expect(results).toMatchObject(testJson);
    });

    it('should retain custom metadata field', () => {
      const { metadata } = results;
      expect(metadata).toHaveProperty('customField');
      expect(metadata).toHaveProperty('groupEdges');
      expect(metadata).toHaveProperty('fields');
      expect(metadata.customField).toEqual('hello');
    });

    it('should return the json object parsed, with the added metadata', () => {
      const { metadata } = results;
      expect(metadata.key).not.toBeNull();
      expect(metadata.groupEdges).not.toBeNull();
      expect(metadata.fields.nodes).not.toBeNull();
      expect(metadata.fields.edges).not.toBeNull();
    });

    it('should return metadata with the correct number of fields for nodes and edges', () => {
      const { nodes: nodeFields, edges: edgeFields } = results.metadata.fields;
      expect(nodeFields).toHaveLength(1);
      expect(edgeFields).toHaveLength(3);
    });

    it('should include a key in metadata if not specified', () => {
      expect(results.metadata).toHaveProperty('key');
    });
  });
});
