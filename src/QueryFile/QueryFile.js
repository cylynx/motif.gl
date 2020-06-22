import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FileUploader } from 'baseui/file-uploader';
import { InfoNotification } from '@blocklynx/ui';
import { closeImportModal } from '../InvestigateExplorer/graphInitSlice';
import { uploadJSON } from '../API';

const QueryFile = ({ info, tooltip }) => {
  const dispatch = useDispatch();

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onCancel = () => {
    setIsUploading(false);
  };

  const onRetry = () => {
    setErrorMessage('');
  };

  const onDropAccepted = acceptedFiles => {
    setIsUploading(true);
    const fileReader = new FileReader();
    fileReader.onload = e => {
      const json = JSON.parse(e.target.result);
      uploadJSON(json);
    };
    fileReader.readAsText(acceptedFiles[0]);
    setIsUploading(false);
    dispatch(closeImportModal());
  };

  const onDropRejected = () => {
    setErrorMessage('Please upload JSON file');
  };

  return (
    <>
      {info && <InfoNotification info={info} tooltip={tooltip} />}
      <FileUploader
        accept=".json,.csv"
        onCancel={onCancel}
        onRetry={onRetry}
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        progressMessage={isUploading && 'Uploading... Hang tight'}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default QueryFile;
