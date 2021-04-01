import { useDispatch } from 'react-redux';

import {
  FileUploadThunks,
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

  return { previewJson, previewEdgeList };
};

export default UseDataPreview;
