import { useDispatch, useSelector } from 'react-redux';
import {
  TFileContentState,
  FileUploadSlices,
  FileUploadSelectors,
} from '../../../../redux/import/fileUpload';
import { GraphData } from '../../../../redux/graph';

const UseFileContent = () => {
  const dispatch = useDispatch();
  const fileUpload = useSelector((state) =>
    FileUploadSelectors.getFileUpload(state),
  );

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
    setAttachments,
    setDataType,
    setAccessors,
    setGroupEdge,
    setDataPreview,
    resetState,
  };
};

export default UseFileContent;
