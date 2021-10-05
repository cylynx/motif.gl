import React, { FC, useMemo } from 'react';

import * as JsonError from '../../ErrorCollections/JsonErrors';
import * as CsvError from '../../ErrorCollections/CsvErrors';

export type ImportErrorDisplayProps = { error: Error };
const ImportErrorDisplay: FC<ImportErrorDisplayProps> = ({ error }) => {
  const errorMessage = useMemo(() => {
    const errorName = error?.name ?? '';
    if (errorName === 'restricted-words') {
      return <JsonError.RestrictedDataType />;
    }

    if (errorName === 'empty-dataset') {
      return <JsonError.EmptyData />;
    }

    if (errorName === 'missing-nodes-or-edges') {
      return <JsonError.MissingNodeOrEdge />;
    }

    if (errorName === 'invalid-json-format') {
      return <JsonError.InvalidJsonFormat />;
    }

    if (errorName === 'invalid-csv-format') {
      return <CsvError.InvalidCsvFormat />;
    }

    if (errorName === 'empty-csv-row') {
      return <CsvError.EmptyCsvRow />;
    }

    return null;
  }, [error]);

  return errorMessage;
};

export default ImportErrorDisplay;
