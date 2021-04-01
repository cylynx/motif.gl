import { useDispatch, useSelector } from 'react-redux';
import { Value } from 'baseui/select';
import { useMemo } from 'react';
import {
  TFileContentState,
  FileUploadSlices,
  FileUploadSelectors,
} from '../../../../redux/import/fileUpload';
import { Field, GraphData } from '../../../../redux/graph';

const UseFileContent = () => {
  const dispatch = useDispatch();
  const fileUpload = useSelector((state) =>
    FileUploadSelectors.getFileUpload(state),
  );

  const nodeFieldOptions: Value = useMemo(() => {
    const { nodes } = fileUpload.dataPreview.metadata.fields;

    if (nodes.length === 0) {
      return [{ id: '-', label: '-' }];
    }

    const nodeFields = nodes.map((nodeField: Field) => {
      const { name } = nodeField;
      return {
        id: name,
        label: name,
      };
    });

    return nodeFields;
  }, [fileUpload.dataPreview]);

  const edgeFieldOptions: Value = useMemo(() => {
    const { edges } = fileUpload.dataPreview.metadata.fields;

    if (edges.length === 0) {
      return [{ id: '-', label: '-' }];
    }

    const edgeFields = edges.map((edgeField: Field) => {
      const { name } = edgeField;
      return {
        id: name,
        label: name,
      };
    });

    return edgeFields;
  }, [fileUpload.dataPreview]);

  const setAttachments = (attachments: TFileContentState['attachments']) => {
    dispatch(FileUploadSlices.setAttachments(attachments));
  };

  const setDataType = (dataType: TFileContentState['dataType']) => {
    dispatch(FileUploadSlices.setDataType(dataType));
  };

  const setAccessors = (accessors: TFileContentState['accessors']) => {
    dispatch(FileUploadSlices.setAccessors(accessors));
  };

  const setGroupEdge = (groupEdge: TFileContentState['groupEdge']) => {
    dispatch(FileUploadSlices.setGroupEdge(groupEdge));
  };

  const setDataPreview = (graphData: GraphData) => {
    dispatch(FileUploadSlices.setDataPreview(graphData));
  };

  const resetState = () => {
    dispatch(FileUploadSlices.resetState());
  };

  return {
    fileUpload,
    nodeFieldOptions,
    edgeFieldOptions,
    setAttachments,
    setDataType,
    setAccessors,
    setGroupEdge,
    setDataPreview,
    resetState,
  };
};

export default UseFileContent;
