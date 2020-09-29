import React, { useState, MouseEvent, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { FileUploader } from 'baseui/file-uploader';
import { InfoNotification } from '../ui';
import * as Prop from '../../types/Prop';
import * as Graph from '../../types/Graph';

import * as DATA from '../../constants/sample-data';
import { addData, closeImportModal, fetchError } from '../../redux';

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

  const testCsv = `id,value,source,target
txn a-b,100,a,b
txn b-c,200,b,c
txn c-b,300,c,a`;

  const onDropAccepted = (acceptedFiles: File[]) => {
    setIsUploading(true);
    const fileExts = acceptedFiles.map((f) => f.name.split('.').pop());
    const promises = [];
    for (const file of acceptedFiles) {
      // eslint-disable-next-line no-loop-func
      const filePromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result);
      });
      promises.push(filePromise);
    }
    Promise.all(promises)
      .then((fileContents) => {
        if (fileExts[0] === 'json') {
          const fileList = fileContents.map((content) =>
            JSON.parse(content as string),
          );
          for (const file of fileList) {
            dispatch(addData({ data: file as Graph.GraphList, type: 'json' }));
          }
        }
        if (fileExts[0] === 'csv') {
          for (const file of fileContents) {
            // use \n as new line delimiter
            const cleanedFile = (file as string).replace(/\r/g, '');
            dispatch(addData({ data: cleanedFile, type: 'edgeListCsv' }));
          }
        }

        dispatch(closeImportModal());
      })
      .catch((err) => dispatch(fetchError(err)));
    setIsUploading(false);
  };

  const onDropRejected = () => {
    setErrorMessage('Please upload JSON file');
  };

  const trySampleData = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(closeImportModal());
    dispatch(addData({ data: DATA.TwoDataArray, type: 'json' }));
  };

  return (
    <Fragment>
      {info && <InfoNotification info={info} tooltip={tooltip} />}
      <FileUploader
        accept='.json,.csv'
        multiple
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
