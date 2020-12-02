import React, { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
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
  EdgeListCsv,
  JsonImport,
  NodeEdgeCsv,
} from '../../../processors/import-data';
import * as Graph from '../../Graph/types';
import { addData, closeModal, fetchError } from '../../../redux';

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

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fileNames, setFileNames] = useState<string[]>(null);
  const [files, setFiles] = useState<ImportFormat[]>(null);
  const { register, watch, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      dataType: [importOptions[0]],
      edgeSource: 'source',
      edgeTarget: 'target',
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
    const ACCEPTED_FILE_NAMES: string[] = acceptedFiles.map((f) => f.name);
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
          const JSON_FILE_CONTENTS: JsonImport[] = fileContents.map(
            (content: string) => {
              const jsonGraphList: Graph.GraphList = JSON.parse(content);
              return {
                data: jsonGraphList,
                type: 'json',
              };
            },
          );

          setFiles(JSON_FILE_CONTENTS);
          setFileNames(ACCEPTED_FILE_NAMES);
        } else if (
          fileExts[0] === 'csv' &&
          watchDataType[0].id === 'edgeListCsv'
        ) {
          const CSV_FILE_CONTENTS: EdgeListCsv[] = fileContents.map(
            (file: string) => {
              const cleanedFile: string = cleanInput(file);
              return {
                data: cleanedFile,
                type: 'edgeListCsv',
              };
            },
          );

          setFiles(CSV_FILE_CONTENTS);
          setFileNames(ACCEPTED_FILE_NAMES);
        } else if (
          fileExts[0] === 'csv' &&
          fileExts.length === 2 &&
          watchDataType[0].id === 'nodeEdgeCsv'
        ) {
          const [
            FIRST_FILE_NAME,
            SECOND_FILE_NAME,
          ]: string[] = ACCEPTED_FILE_NAMES;

          if (
            FIRST_FILE_NAME.includes('node') &&
            SECOND_FILE_NAME.includes('edge')
          ) {
            const NODE_DATA: string = cleanInput(fileContents[0] as string);
            const EDGE_DATA: string = cleanInput(fileContents[1] as string);
            const NODE_EDGE_CONTENT: NodeEdgeCsv = {
              data: {
                nodeData: NODE_DATA,
                edgeData: EDGE_DATA,
              },
              type: 'nodeEdgeCsv',
            };
            setFiles([NODE_EDGE_CONTENT]);
            setFileNames(ACCEPTED_FILE_NAMES);
          } else if (
            SECOND_FILE_NAME.includes('edge') &&
            FIRST_FILE_NAME.includes('node')
          ) {
            const NODE_DATA: string = cleanInput(fileContents[1] as string);
            const EDGE_DATA: string = cleanInput(fileContents[0] as string);
            const NODE_EDGE_CONTENT: NodeEdgeCsv = {
              data: {
                nodeData: NODE_DATA,
                edgeData: EDGE_DATA,
              },
              type: 'nodeEdgeCsv',
            };
            setFiles([NODE_EDGE_CONTENT]);
            setFileNames(ACCEPTED_FILE_NAMES);
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

  const onSubmitForm: SubmitHandler<FormValues> = (data, e) => {
    e.preventDefault();
    const { dataType, ...accessors } = data;
    // remove accessor keys with empty string
    Object.keys(accessors)
      .filter((k) => accessors[k] === '')
      .map((k) => delete accessors[k]);
    // dispatch(addData(files, accessors as Graph.Accessors));
    dispatch(closeModal());
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
          <Button type='submit' disabled={!files}>
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
