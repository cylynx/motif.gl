import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Controller,
  SubmitHandler,
  UnpackNestedValue,
  useForm,
} from 'react-hook-form';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { FileUploader } from 'baseui/file-uploader';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import isEqual from 'lodash/isEqual';

import {
  EdgeListCsv,
  ImportFormat,
  JsonImport,
  NodeEdgeCsv,
  NodeEdgeDataType,
  Accessors,
  GraphThunks,
  GraphSelectors,
  GraphSlices,
  TLoadFormat,
  StyleOptions,
  NodeStyleOptions,
} from '../../../redux/graph';
import { UISlices, UIThunks, UIConstants } from '../../../redux/ui';
import useNodeStyle from '../../../redux/graph/hooks/useNodeStyle';
import ConfirmationModal from '../../../components/ConfirmationModal';
import AdditionalOptions from './AdditionalOptions';

type FormValues = {
  dataType: { label: string; id: string }[];
  nodeID?: string;
  edgeID?: string;
  groupEdges: boolean;
  edgeSource: string;
  edgeTarget: string;
};

const importOptions = Object.values(UIConstants.OPTIONS);

/**
 * remove \r and use \n as new line delimiter and strip whitespace
 */
const cleanInput = (file: string) => file.replace(/\r/g, '').trim();

const ImportLocalFile = () => {
  const dispatch = useDispatch();
  const batchFileRef = useRef<ImportFormat[]>(null);
  const singleFileRef = useRef<ImportFormat>(null);
  const dataContainStyleRef = useRef<boolean>(false);
  const formValueRef = useRef<UnpackNestedValue<FormValues>>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const { switchToFixNodeColor } = useNodeStyle();

  const styleOptions: StyleOptions = useSelector((state) =>
    GraphSelectors.getStyleOptions(state),
  );

  const isStyleOptionModified: boolean = useMemo(() => {
    return !isEqual(GraphSlices.initialState.styleOptions, styleOptions);
  }, [styleOptions, GraphSlices.initialState.styleOptions]);

  const [errorMessage, setErrorMessage] = useState('');
  const [fileNames, setFileNames] = useState<string[]>(null);
  const { register, watch, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      dataType: [importOptions[0]],
      edgeSource: 'source',
      edgeTarget: 'target',

      // always default group edges with true for better experiences.
      groupEdges: true,
    },
  });

  const nodeOptions: NodeStyleOptions = styleOptions.nodeStyle;

  const watchDataType = watch('dataType');
  const isButtonDisabled =
    batchFileRef.current === null && singleFileRef.current === null;

  /**
   * Reset the file content when data type selection changes
   */
  useEffect(() => {
    batchFileRef.current = null;
    singleFileRef.current = null;
    formValueRef.current = null;
    dataContainStyleRef.current = null;
    setFileNames(null);
  }, [watchDataType]);

  const onRetry = () => {
    setErrorMessage('');
  };

  const onDropAccepted = (acceptedFiles: File[]) => {
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
              const jsonGraphList: TLoadFormat = JSON.parse(content);

              if (jsonGraphList.style) {
                dataContainStyleRef.current = true;
              }

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
          UIThunks.show('The file provided is not readable', 'negative'),
        ),
      );
  };

  const onDropRejected = () => {
    const correctType = watchDataType[0].id === 'json' ? 'JSON' : 'CSV';
    setErrorMessage(
      `Invalid file type. Please upload a ${correctType} file or select the correct data type in the dropdown box.`,
    );
  };

  const onSubmitForm: SubmitHandler<FormValues> = (data, e) => {
    e.preventDefault();

    if (nodeOptions.color.id === 'legend') {
      switchToFixNodeColor();
    }

    formValueRef.current = data;
    if (isStyleOptionModified && dataContainStyleRef.current) {
      setConfirmModalOpen(true);
      return;
    }

    if (
      isStyleOptionModified === false &&
      dataContainStyleRef.current === true
    ) {
      performImportData(true);
      return;
    }

    performImportData(false);
  };

  const performImportData = (overwriteStyle: boolean) => {
    const {
      dataType,
      groupEdges,
      ...accessors
    } = formValueRef.current as UnpackNestedValue<FormValues>;

    Object.keys(accessors as Accessors)
      .filter((k) => accessors[k] === '')
      .map((k) => delete accessors[k]);

    const selectedDataType: string = watchDataType[0].id;
    if (selectedDataType === 'nodeEdgeCsv') {
      dispatch(
        GraphThunks.importNodeEdgeData(singleFileRef.current, accessors),
      );
    }

    if (selectedDataType === 'edgeListCsv') {
      dispatch(
        GraphThunks.importEdgeListData(
          batchFileRef.current,
          groupEdges,
          accessors,
        ),
      );
    }

    if (selectedDataType === 'json') {
      dispatch(
        GraphThunks.importJsonData(
          batchFileRef.current,
          groupEdges,
          accessors,
          overwriteStyle,
        ),
      );
    }

    dispatch(UISlices.closeModal());
  };

  const onConfirmModalReject = () => {
    setConfirmModalOpen(false);
    performImportData(false);
  };

  const onConfirmModalApprove = () => {
    setConfirmModalOpen(false);
    performImportData(true);
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
                searchable={false}
                onChange={(data: any) => onChange(data.value)}
                placeholder='Select Import Data Type'
              />
            )}
          />
        </FormControl>
        <FileUploader
          accept={watchDataType[0].id === 'json' ? '.json' : '.csv'}
          multiple
          onRetry={onRetry}
          onDropAccepted={onDropAccepted}
          onDropRejected={onDropRejected}
          errorMessage={errorMessage}
        />
        <Block>
          {fileNames &&
            fileNames.map((name) => <Block key={name}>{name}</Block>)}
        </Block>
        {fileNames && (
          <AdditionalOptions register={register} control={control} />
        )}
        <Block marginTop='10px' display='flex' justifyContent='flex-end'>
          <Button type='submit' disabled={isButtonDisabled}>
            Import Data
          </Button>
        </Block>
      </form>
      <ConfirmationModal
        onClose={onConfirmModalReject}
        isOpen={confirmModalOpen}
        onReject={onConfirmModalReject}
        onAccept={onConfirmModalApprove}
        header={
          <Block
            as='span'
            overrides={{
              Block: {
                style: {
                  textTransform: 'capitalize',
                },
              },
            }}
          >
            Overwrite existing styles?
          </Block>
        }
        body={
          <Block as='span'>
            Import file styles differ from currently applied styles.
          </Block>
        }
      />
    </Fragment>
  );
};

export default ImportLocalFile;
