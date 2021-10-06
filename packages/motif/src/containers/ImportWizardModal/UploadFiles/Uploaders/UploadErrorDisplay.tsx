import React, { FC, useMemo } from 'react';

import * as JsonError from '../../ErrorCollections/JsonErrors';
import * as CsvError from '../../ErrorCollections/CsvErrors';
import * as NodeEdgeCsvError from '../../ErrorCollections/NodeEdgeCsvErrors';

export type UploadErrorDisplayProps = { error: Error };
const UploadErrorDisplay: FC<UploadErrorDisplayProps> = ({ error }) => {
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

    if (errorName === 'invalid-node-csv-format') {
      return <NodeEdgeCsvError.InvalidNodeCsvFormat />;
    }

    if (errorName === 'invalid-edge-csv-format') {
      return <NodeEdgeCsvError.InvalidEdgeCsvFormat />;
    }

    if (errorName === 'empty-node-csv-row') {
      return <NodeEdgeCsvError.EmptyNodeCsvRow />;
    }

    if (errorName === 'empty-edge-csv-row') {
      return <NodeEdgeCsvError.EmptyEdgeCsvRow />;
    }

    return null;
  }, [error]);

  return errorMessage;
};

export default UploadErrorDisplay;
