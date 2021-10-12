import edgeSourceUndefined from './constants/negative/json/08-edge-source-undefined.json';
import edgeTargetUndefined from './constants/negative/json/07-edge-target-undefined.json';
import duplicateNodeEdgeID from './constants/negative/json/01-duplicate-node-edge-key.json';
import invalidEdgeSource from './constants/negative/json/05-invalid-edge-source.json';
import invalidEdgeTarget from './constants/negative/json/12-invalid-edge-target.json';
import duplicateNodeID from './constants/negative/json/06-duplicate-node-id.json';
import duplicateEdgeID from './constants/negative/json/13-duplicate-edge-id.json';

import * as edgeListCsv from './constants/negative/edgeListCsv';
import { importEdgeListCsv, importJson } from '../processors/import';
import { MotifImportError } from '../../../components/ImportErrorMessage';
import * as T from '../types';

describe('Import Errors', () => {
  describe('JSON', () => {
    // edge source attribute is missing in the data.
    it('Missing Edge Source Attributes', (done) => {
      const input = edgeSourceUndefined.data as never as T.GraphList;
      const groupEdge = false;
      const accessors = {
        nodeID: 'id',
        edgeID: 'id',
        edgeSource: 'source',
        edgeTarget: 'target',
      };

      importJson(input, accessors, groupEdge).catch((err) => {
        expect(err).toBeInstanceOf(MotifImportError);
        expect(err.name).toEqual('edge-source-value-undefined');
        expect(err.message).toEqual('');

        done();
      });
    });

    // edge target attribute is missing in the data.
    it('Missing Edge Target Attributes', (done) => {
      const input = edgeTargetUndefined.data as never as T.GraphList;
      const groupEdge = false;
      const accessors = {
        nodeID: 'id',
        edgeID: 'id',
        edgeSource: 'source',
        edgeTarget: 'target',
      };

      importJson(input, accessors, groupEdge).catch((err) => {
        expect(err).toBeInstanceOf(MotifImportError);
        expect(err.name).toEqual('edge-target-value-undefined');
        expect(err.message).toEqual('');

        done();
      });
    });

    // node id and edge id are found conflicting with each others.
    it('Conflicting ID between Nodes and Edges', (done) => {
      const input = duplicateNodeEdgeID.data as never as T.GraphList;
      const groupEdge = false;
      const accessors = {
        nodeID: 'id',
        edgeID: 'id',
        edgeSource: 'source',
        edgeTarget: 'target',
      };

      importJson(input, accessors, groupEdge).catch((err) => {
        const conflictId = JSON.stringify(['two']);
        expect(err).toBeInstanceOf(MotifImportError);
        expect(err.name).toEqual('node-edge-id-conflicts');
        expect(err.message).toEqual(conflictId);

        done();
      });
    });

    // edge source pointing to non-existence node id.
    it('Invalid Edge Source', (done) => {
      const input = invalidEdgeSource.data as never as T.GraphList;
      const groupEdge = false;
      const accessors = {
        nodeID: 'id',
        edgeID: 'id',
        edgeSource: 'source',
        edgeTarget: 'target',
      };

      importJson(input, accessors, groupEdge).catch((err) => {
        const invalidEdgeSource = 'two';
        expect(err).toBeInstanceOf(MotifImportError);
        expect(err.name).toEqual('edge-source-not-exist');
        expect(err.message).toEqual(invalidEdgeSource);

        done();
      });
    });

    // edge target pointing to non-existence node id.
    it('Invalid Edge Target', (done) => {
      const input = invalidEdgeTarget.data as never as T.GraphList;
      const groupEdge = false;
      const accessors = {
        nodeID: 'id',
        edgeID: 'id',
        edgeSource: 'source',
        edgeTarget: 'target',
      };

      importJson(input, accessors, groupEdge).catch((err) => {
        const invalidEdgeSource = 'two';
        expect(err).toBeInstanceOf(MotifImportError);
        expect(err.name).toEqual('edge-target-not-exist');
        expect(err.message).toEqual(invalidEdgeSource);

        done();
      });
    });

    // Node ID are conflicting with each others.
    it('Duplicate Node ID', (done) => {
      const input = duplicateNodeID.data as never as T.GraphList;

      const groupEdge = false;
      const accessors = {
        nodeID: 'id',
        edgeID: 'id',
        edgeSource: 'source',
        edgeTarget: 'target',
      };

      importJson(input, accessors, groupEdge).catch((err) => {
        const invalidIds = JSON.stringify(['node-two']);
        expect(err).toBeInstanceOf(MotifImportError);
        expect(err.name).toEqual('conflict-node-id');
        expect(err.message).toEqual(invalidIds);

        done();
      });
    });

    // Node ID are conflicting with each others.
    it('Duplicate Edge ID', (done) => {
      const input = duplicateEdgeID.data as never as T.GraphList;

      const groupEdge = false;
      const accessors = {
        nodeID: 'id',
        edgeID: 'id',
        edgeSource: 'source',
        edgeTarget: 'target',
      };

      importJson(input, accessors, groupEdge).catch((err) => {
        const invalidIds = JSON.stringify(['edge-two']);
        expect(err).toBeInstanceOf(MotifImportError);
        expect(err.name).toEqual('conflict-edge-id');
        expect(err.message).toEqual(invalidIds);

        done();
      });
    });
  });

  describe('Edge List CSV', () => {
    // edge source attribute is missing in the data.
    it('Missing Edge Source Attributes', (done) => {
      const input = edgeListCsv.missingSource as string;
      const accessors = {
        nodeID: 'auto-generate',
        edgeID: 'id',
        edgeSource: 'custom-source',
        edgeTarget: 'custom-target',
      };

      importEdgeListCsv(input, accessors, false).catch((err) => {
        expect(err).toBeInstanceOf(MotifImportError);
        expect(err.name).toEqual('edge-source-value-undefined');
        expect(err.message).toEqual('');

        done();
      });
    });

    // edge target attribute is missing in the data.
    it('Missing Edge Target Attributes', (done) => {
      const input = edgeListCsv.missingTarget as string;
      const accessors = {
        nodeID: 'auto-generate',
        edgeID: 'id',
        edgeSource: 'custom-source',
        edgeTarget: 'custom-target',
      };

      importEdgeListCsv(input, accessors, false).catch((err) => {
        expect(err).toBeInstanceOf(MotifImportError);
        expect(err.name).toEqual('edge-target-value-undefined');
        expect(err.message).toEqual('');

        done();
      });
    });

    // node id and edge id are found conflicting with each others.
    it('Conflicting ID between Nodes and Edges', (done) => {
      const input = edgeListCsv.conflictIds as string;
      const accessors = {
        nodeID: 'auto-generate',
        edgeID: 'id',
        edgeSource: 'custom-source',
        edgeTarget: 'custom-target',
      };

      importEdgeListCsv(input, accessors, false).catch((err) => {
        const conflictIds = JSON.stringify(['two', 'three']);
        expect(err).toBeInstanceOf(MotifImportError);
        expect(err.name).toEqual('node-edge-id-conflicts');
        expect(err.message).toEqual(conflictIds);

        done();
      });
    });
  });
  describe('Node Edge CSV', () => {
    // edge source attribute is missing in the data.
    it('Missing Edge Source Attributes', () => {});

    // edge target attribute is missing in the data.
    it('Missing Edge Target Attributes', () => {});

    // node id and edge id are found conflicting with each others.
    it('Conflicting ID between Nodes and Edges', () => {});

    // edge source pointing to non-existence node id.
    it('Invalid Edge Source', () => {});

    // edge target pointing to non-existence node id.
    it('Invalid Edge Target', () => {});
  });
});
