import React, { useState, MouseEvent, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { FileUploader } from 'baseui/file-uploader';
import { InfoNotification } from '../ui';
import * as Prop from '../../types/Prop';

import { addData } from '../../processors';
import { sampleJSONData } from '../../constants/sample-data';
import { closeImportModal, fetchError } from '../../redux';

const QueryFile: React.FC<Prop.QueryFile> = ({ info, tooltip }) => {
  const dispatch = useDispatch();

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onCancel = () => {
    setIsUploading(false);
  };

  const onRetry = () => {
    setErrorMessage('');
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    setIsUploading(true);
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result as string);
        dispatch(closeImportModal());
        dispatch(addData(json));
      } catch (err) {
        dispatch(fetchError(err));
      }
    };
    fileReader.readAsText(acceptedFiles[0]);
    setIsUploading(false);
  };

  const onDropRejected = () => {
    setErrorMessage('Please upload JSON file');
  };

  const trySampleData = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(closeImportModal());
    dispatch(addData(sampleJSONData));
  };

  return (
    <Fragment>
      {info && <InfoNotification info={info} tooltip={tooltip} />}
      <FileUploader
        accept='.json,.csv'
        onCancel={onCancel}
        onRetry={onRetry}
        onDropAccepted={onDropAccepted}
        onDropRejected={onDropRejected}
        progressMessage={isUploading && 'Uploading... Hang tight'}
        errorMessage={errorMessage}
      />
      <Block padding='5px' />
      <Button onClick={trySampleData}>Try Sample Data</Button>
    </Fragment>
  );
};

export default QueryFile;
