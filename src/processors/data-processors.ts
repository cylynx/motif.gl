/* eslint-disable no-param-reassign */
import converter from 'json-2-csv';
import { range } from 'd3-array';
import get from 'lodash/get';
import { Analyzer, DATA_TYPES as AnalyzerDATA_TYPES } from 'type-analyzer';
import { notNullorUndefined } from '../utils/data-utils';
import { Field } from '../types/Graph';

type RowData = {
  [key: string]: any;
}[];

type ProcessorResult = { fields: Field[]; rows: any[][] } | null;

// Type analyzer adapted from https://github.com/keplergl/kepler.gl/blob/master/src/processors/data-processor.js

export const ALL_FIELD_TYPES = {
  boolean: 'boolean',
  date: 'date',
  integer: 'integer',
  real: 'real',
  string: 'string',
  timestamp: 'timestamp',
  array: 'array',
};

export const DATASET_FORMATS = {
  json: 'json',
  csv: 'csv',
};

export const RESTRICTED_FIELDS = ['id', 'source', 'target'];

export const ACCEPTED_ANALYZER_TYPES = [
  AnalyzerDATA_TYPES.DATE,
  AnalyzerDATA_TYPES.TIME,
  AnalyzerDATA_TYPES.DATETIME,
  AnalyzerDATA_TYPES.NUMBER,
  AnalyzerDATA_TYPES.INT,
  AnalyzerDATA_TYPES.FLOAT,
  AnalyzerDATA_TYPES.BOOLEAN,
  AnalyzerDATA_TYPES.STRING,
  AnalyzerDATA_TYPES.ARRAY,
];

// if any of these value occurs in csv, parse it to null;
// const CSV_NULLS = ['', 'null', 'NULL', 'Null', 'NaN', '/N'];
// matches empty string
export const CSV_NULLS = /^(null|NULL|Null|NaN|\/N||)$/;

export const IGNORE_DATA_TYPES = Object.keys(AnalyzerDATA_TYPES).filter(
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
 * Converts a json object to csv and returns a promise.
 * Nested documents will have a '.' appended between the keys.
 * Arrays of objects will not not be expanded.
 *
 * @param {*} json
 * @return {*}
 */
export const json2csv = async (json: any) => {
  const csv = converter
    .json2csvAsync(json)
    .then()
    .catch((err) => console.log(`ERROR: ${err.message}`));
  return csv;
};

/**
 * Converts a csv object to json and returns a promise.
 * Column names with '.' will be treated as a nested object
 *
 * @param {string} csv
 * @return {*}
 */
export const csv2json = async (csv: string) => {
  const json = converter
    .csv2jsonAsync(csv)
    .then()
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

/**
 * Process csv data, output a promise data object with `{fields: [], json: []}`.
 *
 * @param rawCsv raw csv string
 * @returns  data object `{fields: [], json: []}`
 */
export async function processCsvData(rawCsv: string) {
  let parsedJson;
  if (typeof rawCsv === 'string') {
    parsedJson = await csv2json(rawCsv);

    if (!Array.isArray(parsedJson) || parsedJson.length < 2) {
      // looks like an empty file, throw error to be catch
      throw new Error('process Csv Data Failed: CSV is empty');
    }
  }

  const headerRow = rawCsv.split('\n')[0].split(',');

  if (!parsedJson || !headerRow) {
    throw new Error('invalid input passed to process Csv data');
  }

  // assume the csv file that people uploaded will have first row
  // header names seperated by a dot indexes to the json position

  cleanUpValue(parsedJson);
  // here we get a list of none null values to run analyze on
  const sample = getSampleForTypeAnalyze(headerRow, parsedJson);
  // TODO: might want to add validation on id, source, target and style fields.
  const fields = getFieldsFromData(sample, headerRow);
  const cleanedJson = parseJsonByFields(parsedJson, fields);

  return { fields, json: cleanedJson };
}

/**
 * Parse rows of csv by analyzed field types. So that `'1'` -> `1`, `'True'` -> `true`
 * @param {Array<Array>} rows
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
  const sample = range(0, total, 1).map((d) => ({}));

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
    if (!RESTRICTED_FIELDS.includes(fieldByIndex[index])) {
      const name = fieldByIndex[index];

      const fieldMeta = metadata.find((m: any) => m.key === field);
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
        result.push({
          name,
          format,
          type: `array<${analyzerTypeToFieldType(arrayMetadata[0].type)}>`,
          analyzerType: type,
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
  } = AnalyzerDATA_TYPES;

  // unrecognized types
  // CURRENCY PERCENT NONE
  switch (aType) {
    case DATE:
      return ALL_FIELD_TYPES.date;
    case TIME:
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
