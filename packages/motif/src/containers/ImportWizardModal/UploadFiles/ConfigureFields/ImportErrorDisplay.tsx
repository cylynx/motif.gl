import React, { FC, useMemo } from 'react';
import * as JsonError from '../../ErrorCollections/JsonErrors';
import * as MotifError from '../../ErrorCollections/MotifErrors';

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

    if (errorName === 'edge-source-not-exist') {
      const edgeId = error.message;
      return <MotifError.EdgeSourceNotExist edgeId={edgeId} />;
    }

    if (errorName === 'edge-target-not-exist') {
      const edgeId = error.message;
      return <MotifError.EdgeTargetNotExist edgeId={edgeId} />;
    }

    return null;
  }, [error]);

  return errorMessage;
};

export default ImportErrorDisplay;
