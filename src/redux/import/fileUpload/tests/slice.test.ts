import fileUploadSlice, {
  initialState,
  resetState,
  setAttachments,
  setDataType,
  setAccessors,
  setGroupEdge,
  setDataPreview,
  setIsEdgeGroupable,
  setStep,
  resetDataPreview,
} from '../slice';
import { TFileContent, TFileContentState } from '../types';
import { SimpleEdge } from '../../../../constants/sample-data';

describe('File Upload Slices', () => {
  afterEach(() => {
    fileUploadSlice(initialState, resetState());
  });

  describe('setAttachments', () => {
    it('should dispatch successfully', () => {
      const simpleGraph = SimpleEdge();
      const fileAttachment: TFileContent[] = [
        {
          fileName: 'test-1',
          content: simpleGraph,
        },
      ];
      const results = fileUploadSlice(
        initialState,
        setAttachments(fileAttachment),
      );
      expect(results.attachments).toEqual(fileAttachment);
    });
  });

  describe('setDataType', () => {
    it('should dispatch nodeEdgeCsv successfully', () => {
      const dataType: TFileContentState['dataType'] = 'nodeEdgeCsv';

      const results = fileUploadSlice(initialState, setDataType(dataType));
      expect(results.dataType).toEqual(dataType);
    });

    it('should dispatch edgeListCsv successfully', () => {
      const dataType: TFileContentState['dataType'] = 'edgeListCsv';

      const results = fileUploadSlice(initialState, setDataType(dataType));
      expect(results.dataType).toEqual(dataType);
    });

    it('should dispatch json successfully', () => {
      const dataType: TFileContentState['dataType'] = 'json';

      const results = fileUploadSlice(initialState, setDataType(dataType));
      expect(results.dataType).toEqual(dataType);
    });
  });

  describe('setAccessors', () => {
    it('should dispatch accessors successfully', () => {
      const accessors: TFileContentState['accessors'] = {
        nodeID: 'auto-generated',
        edgeID: 'id',
        edgeSource: 'from',
        edgeTarget: 'to',
      };

      const results = fileUploadSlice(initialState, setAccessors(accessors));
      expect(results.accessors).toEqual(accessors);
    });
  });

  describe('setGroupEdge', () => {
    it('should dispatch true successfully', () => {
      const groupEdge: TFileContentState['groupEdge'] = true;

      const results = fileUploadSlice(initialState, setGroupEdge(groupEdge));
      expect(results.groupEdge).toEqual(true);
    });

    it('should dispatch false successfully', () => {
      const groupEdge: TFileContentState['groupEdge'] = false;

      const results = fileUploadSlice(initialState, setGroupEdge(groupEdge));
      expect(results.groupEdge).toEqual(false);
    });
  });

  describe('setDataPreview', () => {
    it('should dispatch GraphData successfully', () => {
      const simpleGraph = SimpleEdge();
      const dataPreview: TFileContentState['dataPreview'] = simpleGraph;

      const results = fileUploadSlice(
        initialState,
        setDataPreview(dataPreview),
      );
      expect(results.dataPreview).toEqual(dataPreview);
    });
  });

  describe('setIsEdgeGroupable', () => {
    it('should dispatch false successfully', () => {
      const isEdgeGroupable: TFileContentState['isEdgeGroupable'] = false;

      const results = fileUploadSlice(
        initialState,
        setIsEdgeGroupable(isEdgeGroupable),
      );
      expect(results.isEdgeGroupable).toEqual(false);
    });

    it('should dispatch true successfully', () => {
      const isEdgeGroupable: TFileContentState['isEdgeGroupable'] = true;

      const results = fileUploadSlice(
        initialState,
        setIsEdgeGroupable(isEdgeGroupable),
      );
      expect(results.isEdgeGroupable).toEqual(true);
    });
  });

  describe('setStep', () => {
    it('should dispatch number successfully', () => {
      const step: TFileContentState['step'] = 2;

      const results = fileUploadSlice(initialState, setStep(step));
      expect(results.step).toEqual(2);
    });
  });

  describe('resetDataPreview', () => {
    it('should dispatch successfully', () => {
      const modifiedState: TFileContentState = {
        ...initialState,
        dataPreview: {
          nodes: [],
          edges: [],
          metadata: {
            key: '123',
          },
        },
      };
      const results = fileUploadSlice(modifiedState, resetDataPreview());
      expect(results.dataPreview).toEqual(initialState.dataPreview);
    });
  });
});
