import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from 'baseui/button';
import { Input } from 'baseui/input';
import { Block } from 'baseui/block';
import { FileUploader } from 'baseui/file-uploader';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { Hide, Show } from 'baseui/icon';
import {
  EdgeListCsv,
  ImportFormat,
  JsonImport,
  NodeEdgeCsv,
  NodeEdgeDataType,
  OPTIONS as IMPORT_OPTIONS,
} from '../../../processors/import-data';

import * as Graph from '../../Graph/types';

import {
  importEdgeListData,
  importJsonData,
  importNodeEdgeData,
} from '../../../redux/graph/thunk';

import { UISlices, UIActions } from '../../../redux/ui';

type FormValues = {
  dataType: { label: string; id: string }[];
  nodeID?: string;
  edgeID?: string;
  edgeSource: string;
  edgeTarget: string;
};

const importOptions = Object.values(IMPORT_OPTIONS);

/**
 * remove \r and use \n as new line delimiter and strip whitespace
 */
const cleanInput = (file: string) => file.replace(/\r/g, '').trim();

const ImportLocalFile = () => {
  const dispatch = useDispatch();
  const batchFileRef = useRef<ImportFormat[]>(null);
  const singleFileRef = useRef<ImportFormat>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileNames, setFileNames] = useState<string[]>(null);
  const { register, watch, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      dataType: [importOptions[0]],
      edgeSource: 'source',
      edgeTarget: 'target',
    },
  });

  const watchDataType = watch('dataType');
  const isButtonDisabled =
    batchFileRef.current === null && singleFileRef.current === null;

  /**
   * Reset the file content when data type selection changes
   */
  useEffect(() => {
    batchFileRef.current = null;
    singleFileRef.current = null;
    setFileNames(null);
  }, [watchDataType]);

  const onCancel = () => {
    setIsUploading(false);
  };

  const onRetry = () => {
    setErrorMessage('');
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
    setIsUploading(true);
    const acceptedFileNames: string[] = acceptedFiles.map((f) => f.name);
    const fileExts = acceptedFiles.map((f) => f.name.split('.').pop());

    const fileReaderPromises = acceptedFiles.map((file: File) => {
      const filePromise = new Promise((resolve) => {
        const reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result);
      });

      return filePromise;
    });

    Promise.all(fileReaderPromises)
      .then((fileContents) => {
        const selectedDataType: string = watchDataType[0].id;
        const [fileExtension]: string[] = fileExts;

        if (fileExtension === 'json' && selectedDataType === 'json') {
          const jsonFileContents: JsonImport[] = fileContents.map(
            (content: string) => {
              const jsonGraphList: Graph.GraphList = JSON.parse(content);
              return {
                data: jsonGraphList,
                type: 'json',
              };
            },
          );

          batchFileRef.current = jsonFileContents;
          setFileNames(acceptedFileNames);
          return;
        }

        if (fileExtension === 'csv' && selectedDataType === 'edgeListCsv') {
          const csvFileContents: EdgeListCsv[] = fileContents.map(
            (file: string) => {
              const cleanedFile: string = cleanInput(file);
              return {
                data: cleanedFile,
                type: 'edgeListCsv',
              };
            },
          );

          batchFileRef.current = csvFileContents;
          setFileNames(acceptedFileNames);
          return;
        }

        if (
          fileExtension === 'csv' &&
          acceptedFiles.length === 2 &&
          selectedDataType === 'nodeEdgeCsv'
        ) {
          const [firstFileName, secondFileName]: string[] = acceptedFileNames;

          if (
            firstFileName.includes('node') &&
            secondFileName.includes('edge')
          ) {
            const nodeData: string = cleanInput(fileContents[0] as string);
            const edgeData: string = cleanInput(fileContents[1] as string);
            const nodeEdgeContent: NodeEdgeCsv = {
              data: {
                nodeData,
                edgeData,
              },
              type: 'nodeEdgeCsv',
            };

            singleFileRef.current = nodeEdgeContent;
            setFileNames(acceptedFileNames);
            return;
          }

          if (
            secondFileName.includes('node') &&
            firstFileName.includes('edge')
          ) {
            const nodeData: string = cleanInput(fileContents[1] as string);
            const edgeData: string = cleanInput(fileContents[0] as string);
            const nodeEdgeContent: NodeEdgeCsv = {
              data: { nodeData, edgeData } as NodeEdgeDataType,
              type: 'nodeEdgeCsv',
            };

            singleFileRef.current = nodeEdgeContent;
            setFileNames(acceptedFileNames);
            return;
          }

          setErrorMessage(
            `Please ensure the node file includes 'node' and edge file 'edge'`,
          );
          return;
        }

        setErrorMessage(
          'Please ensure the correct number of files are uploaded and correctly labelled',
        );
      })
      .catch(() =>
        dispatch(
          UIActions.show('The file provided is not readable', 'negative'),
        ),
      );
    setIsUploading(false);
  };

  const onDropRejected = () => {
    const correctType = watchDataType[0].id === 'json' ? 'JSON' : 'CSV';
    setErrorMessage(
      `Invalid file type. Please upload a ${correctType} file or select the correct data type in the dropdown box.`,
    );
  };

  const onSubmitForm: SubmitHandler<FormValues> = (data, e) => {
    e.preventDefault();
    const { dataType, ...accessors } = data;

    // remove accessor keys with empty string
    Object.keys(accessors as Graph.Accessors)
      .filter((k) => accessors[k] === '')
      .map((k) => delete accessors[k]);

    const selectedDataType: string = watchDataType[0].id;
    if (selectedDataType === 'nodeEdgeCsv') {
      dispatch(importNodeEdgeData(singleFileRef.current, accessors));
    }

    if (selectedDataType === 'edgeListCsv') {
      dispatch(importEdgeListData(batchFileRef.current, accessors));
    }

    if (selectedDataType === 'json') {
      dispatch(importJsonData(batchFileRef.current, accessors));
    }

    dispatch(UISlices.closeModal());
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <FormControl label='Data Type'>
          <Controller
            name='dataType'
            control={control}
            render={({ value, onChange }) => (
              <Select
                size='compact'
                value={value}
                options={importOptions}
                clearable={false}
                onChange={(data: any) => onChange(data.value)}
                placeholder='Select Import Data Type'
              />
            )}
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
          <Button type='submit' disabled={isButtonDisabled}>
            Import Data
          </Button>
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
                name='nodeID'
                size='compact'
                inputRef={register}
                placeholder='id'
              />
            </FormControl>
          </Block>
          <Block width='48%'>
            <FormControl label='Edge ID Field'>
              <Input
                name='edgeID'
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
                name='edgeSource'
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
                name='edgeTarget'
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

export default ImportLocalFile;
