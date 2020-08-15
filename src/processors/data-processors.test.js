import * as DATA from '../constants/sample-data';
import {
  json2csv,
  csv2json,
  cleanUpFalsyValue,
  flattenObject,
  getSampleForTypeAnalyze,
  getFieldsFromData,
  parseJsonByFields,
} from './data-processors';

describe('Parsing json to csv', () => {
  it('should contain the right number of rows (including header)', async () => {
    const nodeCsv = await json2csv(DATA.TriangleJSON[0].nodes);
    const edgeCsv = await json2csv(DATA.TriangleJSON[0].edges);
    expect(nodeCsv.split('\n')).toHaveLength(4);
    expect(edgeCsv.split('\n')).toHaveLength(4);
  });
  it('should contain id at root level', async () => {
    const nodeCsv = await json2csv(DATA.TriangleJSON[0].nodes);
    const edgeCsv = await json2csv(DATA.TriangleJSON[0].edges);
    expect(nodeCsv).toContain('id');
    expect(edgeCsv).toContain('id');
  });
  it('should contain nested style fields', async () => {
    const nodeCsv = await json2csv(DATA.TriangleJSON[0].nodes);
    const edgeCsv = await json2csv(DATA.TriangleJSON[0].edges);
    expect(nodeCsv).toContain('style.nodeSize');
    expect(edgeCsv).toContain('style.endArrow');
  });
});

const testCsv = `id,data.value,data.blk_ts_unix,source,target,style.endArrow
txn a-b,100,NaN,a,b,true
txn b-c,200,2000000,b,c,true
txn c-b,300,Null,c,b,true
`;

describe('Parsing csv to json', () => {
  it('should contain the right number of objects', async () => {
    const edgeJson = await csv2json(testCsv);
    expect(edgeJson).toHaveLength(3);
  });
  it('should contain all the relevant id fields', async () => {
    const edgeJson = await csv2json(testCsv);
    expect(edgeJson.map((x) => x.id)).toMatchObject([
      'txn a-b',
      'txn b-c',
      'txn c-b',
    ]);
  });
  it('should convert falsy values to null', async () => {
    const edgeJson = await csv2json(testCsv);
    cleanUpFalsyValue(edgeJson);
    expect(edgeJson[0].data.blk_ts_unix).toBeNull();
    expect(edgeJson[2].data.blk_ts_unix).toBeNull();
  });
  it('should be the same when converted from json to csv to json', async () => {
    const edgeCsv = await json2csv(DATA.TriangleJSON[0].edges);
    const edgeJson = await csv2json(edgeCsv);
    expect(edgeJson).toMatchObject(DATA.TriangleJSON[0].edges);
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

describe('Process csv data', () => {
  it('should get correct samples', async () => {
    const edgeJson = await csv2json(testCsv);
    const headerRow = testCsv.split('\n')[0].split(',');
    const sample = getSampleForTypeAnalyze(headerRow, edgeJson);
    const firstEdgeFlatten = flattenObject(edgeJson[0]);
    expect(sample).toHaveLength(3);
    expect(sample[0]).toMatchObject(firstEdgeFlatten);
  });
  it('should exclude restricted columns (id, target, source) when generating fields', async () => {
    const edgeJson = await csv2json(testCsv);
    const headerRow = testCsv.split('\n')[0].split(',');
    const sample = getSampleForTypeAnalyze(headerRow, edgeJson);
    const fields = getFieldsFromData(sample, headerRow);
    expect(fields.map((x) => x.name)).toMatchObject([
      'data.value',
      'data.blk_ts_unix',
      'style.endArrow',
    ]);
  });
  it('should parse the dataset correctly', async () => {
    const edgeJson = await csv2json(testCsv);
    cleanUpFalsyValue(edgeJson);
    const headerRow = testCsv.split('\n')[0].split(',');
    const sample = getSampleForTypeAnalyze(headerRow, edgeJson);
    const fields = getFieldsFromData(sample, headerRow);
    const cleanedJson = parseJsonByFields(edgeJson, fields);
    expect(cleanedJson[0].data.blk_ts_unix).toBeNull();
    expect(cleanedJson[1].data.blk_ts_unix).toEqual(2000000);
    expect(cleanedJson[2].style.endArrow).toEqual(true);
  });
});
