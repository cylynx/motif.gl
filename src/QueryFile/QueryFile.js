import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { FileUploader } from 'baseui/file-uploader';
import { InfoNotification } from '@blocklynx/ui';

import addData from '../API';
import { sampleJSONData } from '../Utilities/graphUtils';
import { closeImportModal } from '../redux';

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
      dispatch(closeImportModal());
      dispatch(addData(json));
    };
    fileReader.readAsText(acceptedFiles[0]);
    setIsUploading(false);
  };

  const onDropRejected = () => {
    setErrorMessage('Please upload JSON file');
  };

  const trySampleData = e => {
    e.preventDefault();
    dispatch(closeImportModal());
    dispatch(addData(sampleJSONData));
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
      <Block padding="5px" />
      <Button onClick={trySampleData}>Try Sample Data</Button>
    </>
  );
};

export default QueryFile;
