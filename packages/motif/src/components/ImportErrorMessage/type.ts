import { ReactNode } from 'react';

export interface ImportError {
  RESTRICTED_WORDS: 'restricted-words';
  EMPTY_DATASET: 'empty-dataset';
  MISSING_NODES_OR_EDGES: 'missing-nodes-or-edges';

  // csv2json
  INVALID_CSV_FORMAT: 'invalid-csv-format';

  // json2csv
  INVALID_JSON_FORMAT: 'invalid-json-format';
  EMPTY_CSV_ROW: 'empty-csv-row';
}

export type ErrorMessageProps = { title: ReactNode; content?: ReactNode };
