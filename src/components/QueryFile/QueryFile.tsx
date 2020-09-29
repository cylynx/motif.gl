import React, { useState, MouseEvent, FormEvent, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import { Block } from 'baseui/block';
import { FileUploader } from 'baseui/file-uploader';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { Show, Hide } from 'baseui/icon';
import {
  OPTIONS as IMPORT_OPTIONS,
  ImportFormat,
} from '../../processors/import-data';
import * as Graph from '../../types/Graph';

import * as DATA from '../../constants/sample-data';
import { addData, closeImportModal, fetchError } from '../../redux';

const importOptions = Object.values(IMPORT_OPTIONS);

/**
 * remove \r and use \n as new line delimiter and strip whitespace
 */
const cleanInput = (file: string) => file.replace(/\r/g, '').trim();

const QueryFile = () => {
  const dispatch = useDispatch();

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileNames, setFileNames] = useState<string[]>(null);
  const [files, setFiles] = useState<ImportFormat>(null);
  const { register, watch, control, handleSubmit } = useForm({
    defaultValues: {
      dataType: [importOptions[0]],
      source: 'source',
      target: 'target',
    },
  });

  const watchDataType = watch('dataType');

  const onCancel = () => {
    setIsUploading(false);
  };

  const onRetry = () => {
    setErrorMessage('');
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    setIsUploading(true);
    const acceptedFileNames = acceptedFiles.map((f) => f.name);
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
        if (fileExts[0] === 'json' && watchDataType[0].id === 'json') {
          const fileList = fileContents.map((content) =>
            JSON.parse(content as string),
          );
          for (const file of fileList) {
            setFiles({ data: file as Graph.GraphList, type: 'json' });
            setFileNames(acceptedFileNames);
          }
        } else if (
          fileExts[0] === 'csv' &&
          watchDataType[0].id === 'edgeListCsv'
        ) {
          for (const file of fileContents) {
            const cleanedFile = cleanInput(file as string);
            setFiles({ data: cleanedFile, type: 'edgeListCsv' });
            setFileNames(acceptedFileNames);
          }
        } else if (
          fileExts[0] === 'csv' &&
          fileExts.length === 2 &&
          watchDataType[0].id === 'nodeEdgeCsv'
        ) {
          if (
            acceptedFileNames[0].includes('node') &&
            acceptedFileNames[1].includes('edge')
          ) {
            const nodeFile = cleanInput(fileContents[0] as string);
            const edgeFile = cleanInput(fileContents[1] as string);
            setFiles({
              data: { nodeData: nodeFile, edgeData: edgeFile },
              type: 'nodeEdgeCsv',
            });
            setFileNames(acceptedFileNames);
          } else if (
            acceptedFileNames[1].includes('node') &&
            acceptedFileNames[0].includes('edge')
          ) {
            const nodeFile = cleanInput(fileContents[1] as string);
            const edgeFile = cleanInput(fileContents[0] as string);
            setFiles({
              data: { nodeData: nodeFile, edgeData: edgeFile },
              type: 'nodeEdgeCsv',
            });
            setFileNames(acceptedFileNames);
          } else {
            setErrorMessage(
              `Please ensure the node file includes 'node' and edge file 'edge'`,
            );
          }
        } else {
          setErrorMessage(
            'Please ensure the correct number of files are uploaded and correctly labelled',
          );
        }
      })
      .catch((err) => dispatch(fetchError(err)));
    setIsUploading(false);
  };

  const onDropRejected = () => {
    const correctType = watchDataType[0].id === 'json' ? 'JSON' : 'CSV';
    setErrorMessage(
      `Invalid file type. Please upload a ${correctType} file or select the correct data type in the dropdown box.`,
    );
  };

  const trySampleData = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(closeImportModal());
    dispatch(addData({ data: DATA.TwoDataArray, type: 'json' }));
  };

  const onChangeDropdown = ([data]: any[]) => data.value;

  const onSubmitForm = (_data: any, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(addData(files));
    dispatch(closeImportModal());
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <FormControl label='Data Type'>
          <Controller
            as={Select}
            name='dataType'
            size='compact'
            control={control}
            options={importOptions}
            clearable={false}
            onChange={onChangeDropdown}
            placeholder='Select Import Data Type'
          />
        </FormControl>
        <FileUploader
          accept={watchDataType[0].id === 'json' ? '.json' : '.csv'}
          multiple
          onCancel={onCancel}
          onRetry={onRetry}
          onDropAccepted={onDropAccepted}
          onDropRejected={onDropRejected}
          progressMessage={isUploading && 'Uploading... Hang tight'}
          errorMessage={errorMessage}
        />
        <Block>
          {fileNames &&
            fileNames.map((name) => <Block key={name}>{name}</Block>)}
        </Block>

        <AdditionalOptions register={register} />
        <Block marginTop='10px' display='flex' justifyContent='flex-end'>
          <Button type='submit' disabled={!files}>
            Import Data
          </Button>
          {/* <Button onClick={trySampleData}>Try Sample Data</Button> */}
        </Block>
      </form>
    </Fragment>
  );
};

const AdditionalOptions = ({ register }: { register: any }) => {
  const [showOptions, setshowOptions] = useState(false);
  const icon = showOptions ? <Hide /> : <Show />;
  const buttonContents = showOptions
    ? 'Hide options'
    : 'Configure Id, Source, Target mapping';
  return (
    <Block marginTop='12px'>
      <Button
        onClick={() => setshowOptions((value) => !value)}
        startEnhancer={icon}
        kind='minimal'
        size='mini'
        type='button'
      >
        {buttonContents}
      </Button>
      <Block marginTop='12px' display={showOptions ? 'block' : 'none'}>
        <Block display='flex' justifyContent='space-between'>
          <Block width='48%'>
            <FormControl label='Node ID Field'>
              <Input
                name='nodeId'
                size='compact'
                inputRef={register}
                placeholder='id'
              />
            </FormControl>
          </Block>
          <Block width='48%'>
            <FormControl label='Edge ID Field'>
              <Input
                name='edgeId'
                size='compact'
                inputRef={register}
                placeholder='id'
              />
            </FormControl>
          </Block>
        </Block>
        <Block display='flex' justifyContent='space-between'>
          <Block width='48%'>
            <FormControl label='Source Field'>
              <Input
                name='source'
                size='compact'
                inputRef={register}
                placeholder='source'
                required
              />
            </FormControl>
          </Block>
          <Block width='48%'>
            <FormControl label='Target Field'>
              <Input
                name='target'
                size='compact'
                inputRef={register}
                placeholder='target'
                required
              />
            </FormControl>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default QueryFile;
