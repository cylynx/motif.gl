import React, { FC, useMemo } from 'react';
import * as JsonError from '../../ErrorCollections/JsonErrors';

export type ImportErrorDisplayProps = { error: Error };
const ImportErrorDisplay: FC<ImportErrorDisplayProps> = ({ error }) => {
  const errorMessage = useMemo(() => {
    const errorName = error?.name ?? '';

    if (errorName === 'edge-source-value-undefined') {
      return <JsonError.EdgeSourceValueUndefined />;
    }

    if (errorName === 'edge-target-value-undefined') {
      return <JsonError.EdgeTargetValueUndefined />;
    }

    if (errorName === 'node-edge-id-conflicts') {
      const conflictIds = JSON.parse(error.message);
      return <JsonError.ConflictNodeEdgeID conflictIds={conflictIds} />;
    }

    return null;
  }, [error]);

  return errorMessage;
};

export default ImportErrorDisplay;
