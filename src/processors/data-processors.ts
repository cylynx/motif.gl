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

export const json2csv = async (json: any) => {
  const csv = converter
    .json2csvAsync(json)
    .then()
    .catch((err) => console.log(`ERROR: ${err.message}`));
  return csv;
};

export const csv2json = async (csv: string) => {
  const json = converter
    .csv2jsonAsync(csv)
    .then()
    .catch((err) => console.log(`ERROR: ${err.message}`));
  return json;
};

/**
 * Recursively loop through json object and cast `'', 'null', 'NULL', 'Null', 'NaN'` to `null`,
 * so that type-analyzer won't detect it as string
 *
 * @param {Array<Array>} rows
 */
export const cleanUpFalsyValue = (obj: any) => {
  const re = new RegExp(CSV_NULLS, 'g');
  for (const k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      cleanUpFalsyValue(obj[k]);
    } else if (
      // eslint-disable-next-line no-prototype-builtins
      obj.hasOwnProperty(k) &&
      typeof obj[k] === 'string' &&
      obj[k].match(re)
    ) {
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
 * Process csv data, output a data object with `{fields: [], rows: []}`.
 * The data object can be wrapped in a `dataset` and pass to addData
 * @param rawData raw csv string
 * @returns  data object `{fields: [], rows: []}` can be passed to addDataToMaps
 * @type {typeof import('./data-processor').processCsvData}
 * @public
 * @example
 * import {processCsvData} from 'kepler.gl/processors';
 *
 * const testData = `gps_data.utc_timestamp,gps_data.lat,gps_data.lng,gps_data.types,epoch,has_result,id,time,begintrip_ts_utc,begintrip_ts_local,date
 * 2016-09-17 00:09:55,29.9900937,31.2590542,driver_analytics,1472688000000,False,1,2016-09-23T00:00:00.000Z,2016-10-01 09:41:39+00:00,2016-10-01 09:41:39+00:00,2016-09-23
 * 2016-09-17 00:10:56,29.9927699,31.2461142,driver_analytics,1472688000000,False,2,2016-09-23T00:00:00.000Z,2016-10-01 09:46:37+00:00,2016-10-01 16:46:37+00:00,2016-09-23
 * 2016-09-17 00:11:56,29.9907261,31.2312742,driver_analytics,1472688000000,False,3,2016-09-23T00:00:00.000Z,,,2016-09-23
 * 2016-09-17 00:12:58,29.9870074,31.2175827,driver_analytics,1472688000000,False,4,2016-09-23T00:00:00.000Z,,,2016-09-23`
 *
 * const dataset = {
 *  info: {id: 'test_data', label: 'My Csv'},
 *  data: processCsvData(testData)
 * };
 *
 * dispatch(addDataToMap({
 *  datasets: [dataset],
 *  options: {centerMap: true, readOnly: true}
 * }));
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

  cleanUpFalsyValue(parsedJson);
  // here we get a list of none null values to run analyze on
  const sample = getSampleForTypeAnalyze(headerRow, parsedJson);
  const fields = getFieldsFromData(sample, headerRow);
  const cleanedJson = parseJsonByFields(parsedJson, fields);

  // return {fields, rows: parsedRows};
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
 * Assign `type`, `tableFieldIndex` and `format` (timestamp only) to each field
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
 * // {name: 'time', format: 'YYYY-M-D H:m:s', tableFieldIndex: 1, type: 'timestamp'},
 * // {name: 'value', format: '', tableFieldIndex: 4, type: 'integer'},
 * // {name: 'surge', format: '', tableFieldIndex: 5, type: 'real'},
 * // {name: 'isTrip', format: '', tableFieldIndex: 6, type: 'boolean'},
 * // {name: 'zeroOnes', format: '', tableFieldIndex: 7, type: 'integer'}];
 *
 */
export const getFieldsFromData = (
  data: RowData,
  fieldOrder: string[],
): Field[] => {
  // add a check for epoch timestamp
  const metadata = Analyzer.computeColMeta(
    data,
    [{ regex: /.*geojson|all_points/g, dataType: 'GEOMETRY' }],
    { ignoredDataTypes: IGNORE_DATA_TYPES },
  );

  const { fieldByIndex } = renameDuplicateFields(fieldOrder);
  const result: Field[] = [];

  fieldOrder.forEach((field, index) => {
    if (!RESTRICTED_FIELDS.includes(fieldByIndex[index])) {
      const name = fieldByIndex[index];

      const fieldMeta = metadata.find((m: any) => m.key === field);
      const { type, format } = fieldMeta || {};

      result.push({
        name,
        format,
        type: analyzerTypeToFieldType(type),
        analyzerType: type,
      });
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
    case GEOMETRY:
    case GEOMETRY_FROM_STRING:
    case PAIR_GEOMETRY_FROM_STRING:
    case ARRAY:
    case OBJECT: // return ALL_FIELD_TYPES.geojson;
    case NUMBER:
    case STRING:
    case ZIPCODE:
      return ALL_FIELD_TYPES.string;
    default:
      console.warn(`Unsupported analyzer type: ${aType}`);
      return ALL_FIELD_TYPES.string;
  }
};
/* eslint-enable complexity */

// /**
//  * Process data where each row is an object, output can be passed to [`addDataToMap`](../actions/actions.md#adddatatomap)
//  * @param rawData an array of row object, each object should have the same number of keys
//  * @returns dataset containing `fields` and `rows`
//  * @type {typeof import('./data-processor').processRowObject}
//  * @public
//  * @example
//  * import {addDataToMap} from 'kepler.gl/actions';
//  * import {processRowObject} from 'kepler.gl/processors';
//  *
//  * const data = [
//  *  {lat: 31.27, lng: 127.56, value: 3},
//  *  {lat: 31.22, lng: 126.26, value: 1}
//  * ];
//  *
//  * dispatch(addDataToMap({
//  *  datasets: {
//  *    info: {label: 'My Data', id: 'my_data'},
//  *    data: processRowObject(data)
//  *  }
//  * }));
//  */
// export function processRowObject(rawData) {
//   if (!Array.isArray(rawData) || !rawData.length) {
//     return null;
//   }

//   const keys = Object.keys(rawData[0]);
//   const rows = rawData.map((d) => keys.map((key) => d[key]));

//   // row object an still contain values like `Null` or `N/A`
//   cleanUpFalsyCsvValue(rows);

//   return processCsvData(rows, keys);
// }

// /**
//  * Process GeoJSON [`FeatureCollection`](http://wiki.geojson.org/GeoJSON_draft_version_6#FeatureCollection),
//  * output a data object with `{fields: [], rows: []}`.
//  * The data object can be wrapped in a `dataset` and pass to [`addDataToMap`](../actions/actions.md#adddatatomap)
//  *
//  * @param  rawData raw geojson feature collection
//  * @returns  dataset containing `fields` and `rows`
//  * @type {typeof import('./data-processor').processGeojson}
//  * @public
//  * @example
//  * import {addDataToMap} from 'kepler.gl/actions';
//  * import {processGeojson} from 'kepler.gl/processors';
//  *
//  * const geojson = {
//  * 	"type" : "FeatureCollection",
//  * 	"features" : [{
//  * 		"type" : "Feature",
//  * 		"properties" : {
//  * 			"capacity" : "10",
//  * 			"type" : "U-Rack"
//  * 		},
//  * 		"geometry" : {
//  * 			"type" : "Point",
//  * 			"coordinates" : [ -71.073283, 42.417500 ]
//  * 		}
//  * 	}]
//  * };
//  *
//  * dispatch(addDataToMap({
//  *  datasets: {
//  *    info: {
//  *      label: 'Sample Taxi Trips in New York City',
//  *      id: 'test_trip_data'
//  *    },
//  *    data: processGeojson(geojson)
//  *  }
//  * }));
//  */
// export function processGeojson(rawData) {
//   const normalizedGeojson = normalize(rawData);

//   if (!normalizedGeojson || !Array.isArray(normalizedGeojson.features)) {
//     const error = new Error(
//       `Read File Failed: File is not a valid GeoJSON.`,
//     );
//     throw error;
//     // fail to normalize geojson
//   }

//   // getting all feature fields
//   const allDataRows = [];
//   for (let i = 0; i < normalizedGeojson.features.length; i++) {
//     const f = normalizedGeojson.features[i];
//     if (f.geometry) {
//       allDataRows.push({
//         // add feature to _geojson field
//         _geojson: f,
//         ...(f.properties || {}),
//       });
//     }
//   }
//   // get all the field
//   const fields = allDataRows.reduce((prev, curr) => {
//     Object.keys(curr).forEach((key) => {
//       if (!prev.includes(key)) {
//         prev.push(key);
//       }
//     });
//     return prev;
//   }, []);

//   // make sure each feature has exact same fields
//   allDataRows.forEach((d) => {
//     fields.forEach((f) => {
//       if (!(f in d)) {
//         d[f] = null;
//         d._geojson.properties[f] = null;
//       }
//     });
//   });

//   return processRowObject(allDataRows);
// }

// /**
//  * On export data to csv
//  * @param {Array<Array>} data `dataset.allData` or filtered data `dataset.data`
//  * @param {Array<Object>} fields `dataset.fields`
//  * @returns {string} csv string
//  */
// export function formatCsv(data, fields) {
//   const columns = fields.map((f) => f.name);
//   const formattedData = [columns];

//   // parse geojson object as string
//   data.forEach((row) => {
//     formattedData.push(row.map((d, i) => parseFieldValue(d, fields[i].type)));
//   });

//   return csvFormatRows(formattedData);
// }

// /**
//  * Validate input data, adding missing field types, rename duplicate columns
//  * @type {typeof import('./data-processor').validateInputData}
//  */
// export function validateInputData(data) {
//   if (!isPlainObject(data)) {
//     assert('addDataToMap Error: dataset.data cannot be null');
//     return null;
//   } if (!Array.isArray(data.fields)) {
//     assert('addDataToMap Error: expect dataset.data.fields to be an array');
//     return null;
//   } if (!Array.isArray(data.rows)) {
//     assert('addDataToMap Error: expect dataset.data.rows to be an array');
//     return null;
//   }

//   const {fields, rows} = data;

//   // check if all fields has name, format and type
//   const allValid = fields.every((f, i) => {
//     if (!isPlainObject(f)) {
//       assert(`fields needs to be an array of object, but find ${typeof f}`);
//       fields[i] = {};
//     }

//     if (!f.name) {
//       assert(`field.name is required but missing in ${JSON.stringify(f)}`);
//       // assign a name
//       fields[i].name = `column_${i}`;
//     }

//     if (!ALL_FIELD_TYPES[f.type]) {
//       assert(`unknown field type ${f.type}`);
//       return false;
//     }

//     if (!fields.every((field) => field.analyzerType)) {
//       assert('field missing analyzerType');
//       return false;
//     }

//     // check time format is correct based on first 10 not empty element
//     if (f.type === ALL_FIELD_TYPES.timestamp) {
//       const sample = findNonEmptyRowsAtField(rows, i, 10).map((r) => ({ts: r[i]}));
//       const analyzedType = Analyzer.computeColMeta(sample)[0];
//       return analyzedType.category === 'TIME' && analyzedType.format === f.format;
//     }

//     return true;
//   });

//   if (allValid) {
//     return {rows, fields};
//   }

//   // if any field has missing type, recalculate it for everyone
//   // because we simply lost faith in humanity
//   const sampleData = getSampleForTypeAnalyze({
//     fields: fields.map((f) => f.name),
//     allData: rows,
//   });
//   const fieldOrder = fields.map((f) => f.name);
//   const meta = getFieldsFromData(sampleData, fieldOrder);
//   const updatedFields = fields.map((f, i) => ({
//     ...f,
//     type: meta[i].type,
//     format: meta[i].format,
//     analyzerType: meta[i].analyzerType,
//   }));

//   return {fields: updatedFields, rows};
// }

// function findNonEmptyRowsAtField(rows, fieldIdx, total) {
//   const sample = [];
//   let i = 0;
//   while (sample.length < total && i < rows.length) {
//     if (notNullorUndefined(rows[i][fieldIdx])) {
//       sample.push(rows[i]);
//     }
//     i++;
//   }
//   return sample;
// }

// export const DATASET_HANDLERS = {
//   [DATASET_FORMATS.json]: processJson,
//   [DATASET_FORMATS.csv]: processCsvData,
// };

// export const Processors = {
//   processGeojson,
//   processCsvData,
//   processRowObject,
//   analyzerTypeToFieldType,
//   getFieldsFromData,
//   parseCsvRowsByFieldType,
//   formatCsv,
// };