import { ReactNode } from 'react';

export interface UploadError {
  NODE_RESTRICTED_WORDS: 'node-restricted-words';
  EDGE_RESTRICTED_WORDS: 'edge-restricted-words';
  EMPTY_DATASET: 'empty-dataset';
  MISSING_NODES_OR_EDGES: 'missing-nodes-or-edges';

  // csv2json
  INVALID_CSV_FORMAT: 'invalid-csv-format';

  // json2csv
  INVALID_JSON_FORMAT: 'invalid-json-format';
  EMPTY_CSV_ROW: 'empty-csv-row';

  INVALID_NODE_CSV_FORMAT: 'invalid-node-csv-format';
  INVALID_EDGE_CSV_FORMAT: 'invalid-edge-csv-format';
  EMPTY_NODE_CSV_ROW: 'empty-node-csv-row';
  EMPTY_EDGE_CSV_ROW: 'empty-edge-csv-row';
  UNKNOWN_IMPORT_ERROR: 'unknown-import-error';
}

export interface ImportError {
  EDGE_SOURCE_VALUE_UNDEFINED: 'edge-source-value-undefined';
  EDGE_TARGET_VALUE_UNDEFINED: 'edge-target-value-undefined';
  EDGE_SOURCE_NOT_EXIST: 'edge-source-not-exist';
  EDGE_TARGET_NOT_EXIST: 'edge-target-not-exist';
  NODE_EDGE_ID_CONFLICTS: 'node-edge-id-conflicts';
  CONFLICT_NODE_ID: 'conflict-node-id';
  CONFLICT_EDGE_ID: 'conflict-edge-id';
  UNKNOWN_IMPORT_ERROR: 'unknown-import-error';
}

export type ErrorMessageProps = { title: ReactNode; content?: ReactNode };
