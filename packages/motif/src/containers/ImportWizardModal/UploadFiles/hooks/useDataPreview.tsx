import { useDispatch } from '../../../../redux/hooks';
import {
  FileUploadThunks,
  SingleFileForms,
  TFileContent,
} from '../../../../redux/import/fileUpload';

const UseDataPreview = () => {
  const dispatch = useDispatch();
  const previewJson = (attachments: TFileContent[]) => {
    dispatch(FileUploadThunks.previewJson(attachments));
  };

  const previewEdgeList = (attachments: TFileContent[]) => {
    dispatch(FileUploadThunks.previewEdgeList(attachments));
  };

  const previewNodeEdge = (attachments: SingleFileForms) => {
    dispatch(FileUploadThunks.previewNodeEdge(attachments));
  };

  return { previewJson, previewEdgeList, previewNodeEdge };
};

export default UseDataPreview;
