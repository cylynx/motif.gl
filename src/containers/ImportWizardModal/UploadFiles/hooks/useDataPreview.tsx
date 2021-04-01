import React from 'react';
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

  return { previewJson };
};

export default UseDataPreview;
