/* eslint-disable no-param-reassign */
import converter from 'json-2-csv';
import { range } from 'd3-array';
import shortid from 'shortid';
// @ts-ignore
import { Analyzer, DATA_TYPES as AnalyzerDatatypes } from 'type-analyzer';
import { isEmpty, uniq, get, uniqBy } from 'lodash';
import { notNullorUndefined } from '../../../utils/data-utils/data-utils';
import {
  Edge,
  Field,
  GraphData,
  GroupEdgeCandidates,
  GroupEdges,
  Metadata,
  Node,
} from '../types';
import { duplicateDictionary } from './group-edges';

type RowData = {
  [key: string]: any;
}[];

// Type analyzer adapted from https://github.com/keplergl/kepler.gl/blob/master/src/processors/data-processor.js

export const ALL_FIELD_TYPES = {
  boolean: 'boolean',
  date: 'date',
  integer: 'integer',
  real: 'real',
  string: 'string',
  timestamp: 'timestamp',
  array: 'array',
  time: 'time',
};

export const DATASET_FORMATS = {
  json: 'json',
  csv: 'csv',
};

export const ACCEPTED_ANALYZER_TYPES = [
  AnalyzerDatatypes.DATE,
  AnalyzerDatatypes.TIME,
  AnalyzerDatatypes.DATETIME,
  AnalyzerDatatypes.INT,
  AnalyzerDatatypes.FLOAT,
  AnalyzerDatatypes.BOOLEAN,
  AnalyzerDatatypes.STRING,
  AnalyzerDatatypes.ARRAY,
];

// if any of these value occurs in csv, parse it to null;
// const CSV_NULLS = ['', 'null', 'NULL', 'Null', 'NaN', '/N'];
// matches empty string
export const CSV_NULLS = /^(null|NULL|Null|NaN|\/N||)$/;

export const IGNORE_DATA_TYPES = Object.keys(AnalyzerDatatypes).filter(
  (type) => !ACCEPTED_ANALYZER_TYPES.includes(type),
);

export const PARSE_FIELD_VALUE_FROM_STRING = {
  [ALL_FIELD_TYPES.boolean]: {
    valid: (d: any) => typeof d === 'boolean',
    parse: (d: any) => d === 'true' || d === 'True' || d === '1',
  },
  [ALL_FIELD_TYPES.integer]: {
    valid: (d: any) => parseInt(d, 10) === d,
    parse: (d: any) => parseInt(d, 10),
  },
  [ALL_FIELD_TYPES.timestamp]: {
    valid: (d: any, field: any) =>
      ['x', 'X'].includes(field.format)
        ? typeof d === 'number'
        : typeof d === 'string',
    parse: (d: any, field: any) =>
      ['x', 'X'].includes(field.format) ? Number(d) : d,
  },
  [ALL_FIELD_TYPES.real]: {
    valid: (d: any) => parseFloat(d) === d,
    // Note this will result in NaN for some string
    parse: parseFloat,
  },
};

/**
 * Quick check to test whether json has the keys required of GraphData type
 *
 * @param {GraphData} json
 * @return {boolean}
 */
export const validateMotifJson = (json: GraphData): boolean => {
  if (
    json.nodes &&
    json.edges &&
    json.metadata &&
    json.metadata.fields &&
    json.metadata.fields.nodes &&
    json.metadata.fields.edges &&
    json.metadata.groupEdges &&
    json.metadata.groupEdges.availability &&
    json.metadata.key
  ) {
    return true;
  }
  return false;
};

/**
 * Process json data, output a promise GraphData object with field information in metadata.
 *
 * @param {GraphData} json
 * @param {boolean} groupEdges
 * @param {*} [key=shortid.generate()] Either an accessor string or the key itself
 * @return {*}  {Promise<GraphData>}
 */
export const processJson = async (
  json: GraphData,
  groupEdges: boolean,
  key: string | number = shortid.generate(),
): Promise<GraphData> => {
  if (validateMotifJson(json)) return json;

  if (json.nodes && json.edges) {
    const nodeCsv = await json2csv(json.nodes);
    const edgeCsv = await json2csv(json.edges);
    const { fields: nodeFields, json: nodeJson } = await processCsvData(
      nodeCsv as string,
    );
    const { fields: edgeFields, json: edgeJson } = await processCsvData(
      edgeCsv as string,
    );

    // group edge configuration or metadata is not found in the graph data,
    // apply the group edge based on user input
    const groupEdgeConfig: GroupEdges =
      json.metadata?.groupEdges ??
      applyGroupEdges(groupEdges, nodeJson as Node[], edgeJson as Edge[]);

    const graphMetadata = {
      ...json?.metadata,
      fields: { nodes: nodeFields, edges: edgeFields },
      key: get(json, 'metadata.key', key),
      groupEdges: groupEdgeConfig,
    };

    return {
      nodes: nodeJson as Node[],
      edges: edgeJson as Edge[],
      metadata: graphMetadata,
    };
  }
  throw new Error(
    'process Json Data Failed: Json must contain both nodes & edges object',
  );
};

/**
 * Process a node and edge csv file, output a promise GraphData object with field information in metadata.
 *
 * @param {string[]} nodeCsvs
 * @param {string[]} edgeCsvs
 * @param {boolean} groupEdges
 * @param {*} [key=shortid.generate()]
 * @return {*}  {Promise<Graph.GraphData>}
 */
export const processNodeEdgeCsv = async (
  nodeCsvs: string[],
  edgeCsvs: string[],
  groupEdges: boolean,
  key = shortid.generate(),
): Promise<GraphData> => {
  const combineFieldsAndJson = (
    acc: ProcessedCsv,
    processedNode: ProcessedCsv,
  ): ProcessedCsv => {
    return {
      fields: uniqBy(
        [...acc.fields, ...processedNode.fields],
        'name',
      ) as Field[],
      json: [...acc.json, ...processedNode.json] as Node[] | Edge[],
    };
  };

  const emptyFieldsWithJson: ProcessedCsv = { fields: [], json: [] };
  const nodeDataPromises = nodeCsvs.map((nodeCsv: string) =>
    processCsvData(nodeCsv),
  );
  const edgeDataPromises = edgeCsvs.map((edgeCsv: string) =>
    processCsvData(edgeCsv),
  );

  try {
    // obtain node json and node fields from batch uploaded node csv
    const processedNodeDatas: ProcessedCsv[] = await Promise.all(
      nodeDataPromises,
    );
    const { fields: nodeFields, json: nodeJson } = processedNodeDatas.reduce(
      combineFieldsAndJson,
      emptyFieldsWithJson,
    );

    // obtain edge json and edge fields from batch uploaded edge csv
    const processedEdgeDatas: ProcessedCsv[] = await Promise.all(
      edgeDataPromises,
    );
    const { fields: edgeFields, json: edgeJson } = processedEdgeDatas.reduce(
      combineFieldsAndJson,
      emptyFieldsWithJson,
    );

    // ensure all the source and target in edges are present.
    verifySourceAndTargetExistence(nodeJson as Node[], edgeJson as Edge[]);

    const groupEdgeConfig: GroupEdges = applyGroupEdges(
      groupEdges,
      nodeJson as Node[],
      edgeJson as Edge[],
    );

    const graphMetadata: Metadata = {
      fields: { nodes: nodeFields, edges: edgeFields },
      key,
      groupEdges: groupEdgeConfig,
    };

    const graphData: GraphData = {
      nodes: nodeJson as Node[],
      edges: edgeJson as Edge[],
      metadata: graphMetadata,
    };

    return graphData;
  } catch (err) {
    const { message } = err;
    throw new Error(`Import Node Edge Data Error: ${message}`);
  }
};

/**
 * Process an edge list csv file, output a promise GraphData object with field information in metadata.
 *
 * @param {string} edgeCsv
 * @param {string} [edgeSourceAccessor='source']
 * @param {string} [edgeTargetAccessor='target']
 * @param {boolean} groupEdges
 * @param {*} [key=shortid.generate()]
 * @return {*}  {Promise<Graph.GraphData>}
 */
export const processEdgeListCsv = async (
  edgeCsv: string,
  edgeSourceAccessor = 'source',
  edgeTargetAccessor = 'target',
  groupEdges: boolean,
  key = shortid.generate(),
): Promise<GraphData> => {
  const { fields: edgeFields, json: edgeJson } = await processCsvData(edgeCsv);
  const edgeIds: string[] = [];
  (edgeJson as Edge[]).forEach((edge: Edge) => {
    edgeIds.push(edge[edgeSourceAccessor] as string);
    edgeIds.push(edge[edgeTargetAccessor] as string);
  });
  const uniqueNodes = [...new Set(edgeIds)];
  const nodeJson = uniqueNodes.map((node) => {
    return { id: node };
  });

  const groupEdgeConfig: GroupEdges = applyGroupEdges(
    groupEdges,
    nodeJson as Node[],
    edgeJson as Edge[],
  );

  const graphMetadata: Metadata = {
    fields: { nodes: [], edges: edgeFields },
    key,
    groupEdges: groupEdgeConfig,
  };

  return {
    nodes: nodeJson,
    edges: edgeJson as Edge[],
    metadata: graphMetadata,
  };
};

/**
 * Converts a json object to csv and returns a promise.
 * Nested documents will have a '.' appended between the keys.
 * Arrays of objects will not not be expanded.
 *
 * @param {*} json
 * @return {*}
 */
export const json2csv = async (json: any): Promise<string | void> => {
  const csv = converter
    .json2csvAsync(json)
    .then()
    // eslint-disable-next-line no-console
    .catch((err) => console.log(`ERROR: ${err.message}`));
  return csv;
};

/**
 * Converts a csv object to json and returns a promise.
 * Column names with '.' will be treated as a nested object
 *
 * @param {string} csv
 * @return {Promise<void | any[]>}
 */
export const csv2json = async (csv: string): Promise<void | any[]> => {
  const json = converter
    .csv2jsonAsync(csv)
    .then()
    // eslint-disable-next-line no-console
    .catch((err) => console.log(`ERROR: ${err.message}`));
  return json;
};

/**
 * Clean up falsy null values and string like arrays
 * Recursively loop through json object and cast `'', 'null', 'NULL', 'Null', 'NaN'` to `null`,
 * so that type-analyzer won't detect it as string
 * Convert arrays like '[a,b,c]' to an actual array [a,b,c]
 *
 * @param {*} obj value to parse and clean
 */
export const cleanUpValue = (obj: any) => {
  const nullRe = new RegExp(CSV_NULLS, 'g');
  const arrayRe = new RegExp(/^\[.*]$/, 'g'); // '[a,b,c]'
  for (const k in obj) {
    if (
      typeof obj[k] === 'object' &&
      !Array.isArray(obj[k]) &&
      obj[k] !== null
    ) {
      cleanUpValue(obj[k]);
    } else if (typeof obj[k] === 'string' && obj[k].match(arrayRe)) {
      const cleanArray: any[] = [];
      const temp = obj[k].slice(1, -1).split(',');
      temp.forEach((j: any) => cleanArray.push(j));
      obj[k] = cleanArray;
    } else if (typeof obj[k] === 'string' && obj[k].match(nullRe)) {
      obj[k] = null;
    }
  }
};

/**
 * Flatten nested object, excludes arrays
 * Keys of the new object are dot seperated corresponding to the previous location
 *
 * @param {*} obj
 * @param {string} [history=""]
 * @return {*}
 */
export const flattenObject = (obj: any, history = '') => {
  const result = {};
  for (const i in obj) {
    if (
      typeof obj[i] === 'object' &&
      !Array.isArray(obj[i]) &&
      obj[i] !== null
    ) {
      Object.assign(result, flattenObject(obj[i], `${history}.${i}`));
    } else {
      result[`${history}.${i}`.replace(/^\./, '')] = obj[i];
    }
  }
  return result;
};

export type ProcessedCsv = {
  fields: Field[] | [];
  json: Node[] | Edge[];
};

/**
 * Process csv data (node / edge csv or edge list), output a promise data object containing the parse fields and graph data.
 *
 * @param {string} rawCsv raw csv string
 * @return {*}  {Promise<ProcessedCsv>}
 */
export const processCsvData = async (rawCsv: string): Promise<ProcessedCsv> => {
  let parsedJson;
  if (typeof rawCsv === 'string') {
    parsedJson = await csv2json(rawCsv);
  }

  const headerRow = rawCsv
    .replace(/\r/g, '')
    .split('\n')[0]
    .split(',');

  if (!parsedJson || !headerRow) {
    throw new Error('invalid input passed to process Csv data');
  }

  // assume the csv file that uploaded csv will have first row
  // header names seperated by a dot indexed to the json position

  cleanUpValue(parsedJson);
  // here we get a list of none null values to run analyze on
  const sample = getSampleForTypeAnalyze(headerRow, parsedJson);
  // TODO: might want to add validation on id, source, target and style fields.
  const fields = getFieldsFromData(sample, headerRow);
  const cleanedJson = parseJsonByFields(parsedJson, fields);

  return { fields, json: cleanedJson };
};

/**
 * Parse rows of csv by analyzed field types. So that `'1'` -> `1`, `'True'` -> `true`
 * @param json
 * @param {Array<Object>} fields
 */
export const parseJsonByFields = (json: any[], fields: Field[]) => {
  // Edit rows in place
  fields.forEach((field) => {
    const parser = PARSE_FIELD_VALUE_FROM_STRING[field.type];
    if (parser) {
      // Loop through objects in json and parse field based on accessor and type
      // check first not null value of it's already parsed
      const firstValue = get(json[0], field.name);
      if (!notNullorUndefined(firstValue) || parser.valid(firstValue, field)) {
        return;
      }
      json.forEach((obj) => {
        // parse string value based on field type
        const value = get(obj, field.name);
        if (value !== null) {
          obj[field.name] = parser.parse(value, field);
        }
      });
    }
  });
  return json;
};

/**
 * Get sample data for analyzing field type.
 *
 * @param {string[]} fields accessor field string that correspond to the location of the data field in allData
 * @param {any[]} allData object to access
 * @param {number} [sampleCount=50] number of samples
 */
export const getSampleForTypeAnalyze = (
  fields: string[],
  allData: any[],
  sampleCount = 50,
) => {
  const total = Math.min(sampleCount, allData.length);
  // const fieldOrder = fields.map(f => f.name);
  const sample = range(0, total, 1).map(() => ({}));

  // collect sample data for each field
  fields.forEach((field) => {
    // data counter
    let i = 0;
    // sample counter
    let j = 0;

    while (j < total) {
      if (i >= allData.length) {
        // if depleted data pool
        sample[j][field] = null;
        j++;
      } else if (notNullorUndefined(get(allData[i], field))) {
        sample[j][field] = get(allData[i], field);
        j++;
        i++;
      } else {
        i++;
      }
    }
  });

  return sample;
};

/**
 * Analyze field types from data in `string` format, e.g. uploaded csv.
 * Assign `type`, and `format` (timestamp only) to each field
 * Exclude restricted fields (in, source, target)
 *
 * @param data array of row object
 * @param fieldOrder array of field names as string
 * @returns formatted fields
 * @example
 *
 * import {getFieldsFromData} from 'kepler.gl/processors';
 * const data = [{
 *   time: '2016-09-17 00:09:55',
 *   value: '4',
 *   surge: '1.2',
 *   isTrip: 'true',
 *   zeroOnes: '0'
 * }, {
 *   time: '2016-09-17 00:30:08',
 *   value: '3',
 *   surge: null,
 *   isTrip: 'false',
 *   zeroOnes: '1'
 * }, {
 *   time: null,
 *   value: '2',
 *   surge: '1.3',
 *   isTrip: null,
 *   zeroOnes: '1'
 * }];
 *
 * const fieldOrder = ['time', 'value', 'surge', 'isTrip', 'zeroOnes'];
 * const fields = getFieldsFromData(data, fieldOrder);
 * // fields = [
 * // {name: 'time', format: 'YYYY-M-D H:m:s', type: 'timestamp'},
 * // {name: 'value', format: '', type: 'integer'},
 * // {name: 'surge', format: '', type: 'real'},
 * // {name: 'isTrip', format: '', type: 'boolean'},
 * // {name: 'zeroOnes', format: '', type: 'integer'}];
 *
 */
export const getFieldsFromData = (
  data: RowData,
  fieldOrder: string[],
): Field[] => {
  // add a check for epoch timestamp
  const metadata = Analyzer.computeColMeta(
    data,
    [{ regex: /^\[.*]$/g, dataType: 'ARRAY' }],
    { ignoredDataTypes: IGNORE_DATA_TYPES },
  );
  const { fieldByIndex } = renameDuplicateFields(fieldOrder);
  const result: Field[] = [];

  fieldOrder.forEach((field, index) => {
    const name = fieldByIndex[index];
    const fieldMeta = metadata.find((m: any) => m.key === field);

    // Excludes undefined type, restricted fields and style / defaultStyle fields
    if (
      typeof fieldMeta !== 'undefined' &&
      !name.includes('style.') &&
      !name.includes('defaultStyle.')
    ) {
      const { type, format } = fieldMeta || {};
      const fieldType = analyzerTypeToFieldType(type);
      if (fieldType === 'array') {
        // Check first value of the array
        const arrayMetadata = Analyzer.computeColMeta(
          data.map((x) => {
            return { arrayValue: x[name][0] };
          }),
          [],
          { ignoredDataTypes: IGNORE_DATA_TYPES },
        );

        // Only push if array is non-empty
        if (arrayMetadata.length > 0) {
          result.push({
            name,
            format,
            type: `array<${analyzerTypeToFieldType(arrayMetadata[0].type)}>`,
            analyzerType: type,
          });
        }
      }
      // (x|X) is a timestamp format and convert analyzerType to DATETIME
      else if (
        fieldType === ALL_FIELD_TYPES.time &&
        (format === 'x' || format === 'X')
      ) {
        result.push({
          name,
          format,
          type: ALL_FIELD_TYPES.timestamp,
          analyzerType: AnalyzerDatatypes.DATETIME,
        });
      } else {
        result.push({
          name,
          format,
          type: fieldType,
          analyzerType: type,
        });
      }
    }
  });

  return result;
};

/**
 * pass in an array of field names, rename duplicated one
 * and return a map from old field index to new name
 *
 * @param {Array} fieldOrder
 * @returns {Object} new field name by index
 */
export const renameDuplicateFields = (fieldOrder: string[]) => {
  return fieldOrder.reduce(
    (accu, field, i) => {
      const { allNames } = accu;
      let fieldName = field;

      // add a counter to duplicated names
      if (allNames.includes(field)) {
        let counter = 0;
        while (allNames.includes(`${field}-${counter}`)) {
          counter++;
        }
        fieldName = `${field}-${counter}`;
      }

      accu.fieldByIndex[i] = fieldName;
      accu.allNames.push(fieldName);

      return accu;
    },
    { allNames: [], fieldByIndex: {} },
  );
};

/**
 * Convert type-analyzer output to field types
 *
 * @param aType
 * @returns corresponding type in `ALL_FIELD_TYPES`
 */
/* eslint-disable complexity */
export const analyzerTypeToFieldType = (aType: string): string => {
  const {
    DATE,
    TIME,
    DATETIME,
    NUMBER,
    INT,
    FLOAT,
    BOOLEAN,
    STRING,
    GEOMETRY,
    GEOMETRY_FROM_STRING,
    PAIR_GEOMETRY_FROM_STRING,
    ZIPCODE,
    ARRAY,
    OBJECT,
  } = AnalyzerDatatypes;

  // unrecognized types
  // CURRENCY PERCENT NONE
  switch (aType) {
    case DATE:
      return ALL_FIELD_TYPES.date;
    case TIME:
      return ALL_FIELD_TYPES.time;
    case DATETIME:
      return ALL_FIELD_TYPES.timestamp;
    case FLOAT:
      return ALL_FIELD_TYPES.real;
    case INT:
      return ALL_FIELD_TYPES.integer;
    case BOOLEAN:
      return ALL_FIELD_TYPES.boolean;
    case ARRAY:
      return ALL_FIELD_TYPES.array;
    case GEOMETRY:
    case GEOMETRY_FROM_STRING:
    case PAIR_GEOMETRY_FROM_STRING:
    case OBJECT: // return ALL_FIELD_TYPES.geojson;
    case NUMBER:
    case STRING:
    case ZIPCODE:
      return ALL_FIELD_TYPES.string;
    default:
      // eslint-disable-next-line no-console
      console.warn(`Unsupported analyzer type: ${aType}`);
      return ALL_FIELD_TYPES.string;
  }
};

/**
 * Applies group edge onto metadata on every single imports.
 *
 * @param toggle
 * @param nodeJson
 * @param edgeJson
 * @return {void}
 */
export const applyGroupEdges = (
  toggle: boolean,
  nodeJson: Node[],
  edgeJson: Edge[],
): GroupEdges => {
  // identify whether graph edges contain duplicate connectivity.
  const graphData: GraphData = { nodes: nodeJson, edges: edgeJson };
  const duplicateConnectivity: GroupEdgeCandidates = duplicateDictionary(
    graphData,
  );
  const isDatasetCanGroupEdge = !isEmpty(duplicateConnectivity);

  if (isDatasetCanGroupEdge === false) {
    return {
      toggle: false,
      availability: false,
    };
  }

  const groupEdgeConfig: GroupEdges = {
    toggle,
    availability: true,
  };

  if (toggle) {
    groupEdgeConfig.type = 'all';
  }

  return groupEdgeConfig;
};

export const verifySourceAndTargetExistence = (
  nodes: Node[],
  edges: Edge[],
) => {
  const nodeIds: string[] = nodes.map((node: Node) => node.id);
  const uniqueNodeIds: string[] = uniq(nodeIds as string[]);

  edges.forEach((edge: Edge) => {
    const { source, target, id } = edge;

    const isPossessSource = uniqueNodeIds.includes(source);
    if (!isPossessSource) {
      throw new Error(
        `The source or target node of edge ${id} does not exist.`,
      );
    }

    const isPossessTarget = uniqueNodeIds.includes(target);
    if (!isPossessTarget) {
      throw new Error(
        `The source or target node of edge ${id} does not exist.`,
      );
    }
  });
};
