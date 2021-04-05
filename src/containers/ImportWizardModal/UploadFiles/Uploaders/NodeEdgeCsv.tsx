import React, { BaseSyntheticEvent, FC } from 'react';
import {
  Controller,
  SubmitHandler,
  UnpackNestedValue,
  useForm,
} from 'react-hook-form';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { FileUploader } from 'baseui/file-uploader';
import { Button, KIND, SIZE } from 'baseui/button';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { colors } from 'baseui/tokens';
import {
  SingleFileForms,
  TFileContent,
  TFileReaderResponse,
} from '../../../../redux/import/fileUpload';
import useFileContents from '../hooks/useFileContents';
import AttachmentLists from '../../components/AttachmentLists';
import * as Icon from '../../../../components/Icons';
import useDataPreview from '../hooks/useDataPreview';

const cleanInput = (file: string) => file.replace(/\r/g, '').trim();

const NodeEdgeCsv: FC = () => {
  const { fileUpload, setAttachments } = useFileContents();
  const { previewNodeEdge } = useDataPreview();

  const {
    watch,
    control,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
  } = useForm<SingleFileForms>({
    defaultValues: {
      nodeCsv: (fileUpload.attachments as SingleFileForms).nodeCsv ?? null,
      edgeCsv: (fileUpload.attachments as SingleFileForms).edgeCsv ?? null,
    },
  });

  const onSubmitForm: SubmitHandler<SingleFileForms> = (
    data: UnpackNestedValue<SingleFileForms>,
    e: BaseSyntheticEvent,
  ) => {
    e.preventDefault();

    setAttachments(data);
    previewNodeEdge(data);
  };

  const onDropRejected = (name: keyof SingleFileForms) => {
    setError(name, {
      type: 'manual',
      message:
        'Invalid file type. Please upload a CSV file or select the correct data type in the dropdown box.',
    });
  };

  const onDropAccepted = (
    acceptedFiles: File[],
    onChange: any,
    name: keyof SingleFileForms,
  ) => {
    const fileReaderPromises = acceptedFiles.map((file: File) => {
      const filePromise = new Promise((resolve) => {
        const reader: FileReader = new FileReader();
        reader.readAsText(file);
        reader.onload = () =>
          resolve({
            name: file.name,
            results: reader.result,
          } as TFileReaderResponse);
      });

      return filePromise;
    });

    Promise.all(fileReaderPromises)
      .then((fileResponses: TFileReaderResponse[]) => {
        const edgeListCsv: TFileContent[] = fileResponses.map((response) => {
          const { name, results } = response;
          const fileContent: TFileContent = {
            fileName: name,
            content: cleanInput(results as string),
          };

          return fileContent;
        });

        onChange(edgeListCsv);
      })
      .catch(() => {
        setError(name, {
          type: 'manual',
          message: 'The file provided is not readable',
        });
      });
  };

  const isNodeCsvEmpty: boolean = watch('nodeCsv') === null;
  const isEdgeCsvEmpty: boolean = watch('edgeCsv') === null;

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <FlexGrid flexGridColumnCount={2} flexGridColumnGap='scale300'>
        <FlexGridItem>
          <Controller
            name='nodeCsv'
            control={control}
            render={({ onChange, name }) =>
              isNodeCsvEmpty && (
                <FileUploader
                  accept='.csv'
                  multiple
                  onRetry={() => {
                    clearErrors(name as keyof SingleFileForms);
                  }}
                  onDropAccepted={(files: File[]) =>
                    onDropAccepted(
                      files,
                      onChange,
                      name as keyof SingleFileForms,
                    )
                  }
                  onDropRejected={() =>
                    onDropRejected(name as keyof SingleFileForms)
                  }
                  overrides={{
                    ContentMessage: {
                      component: () => (
                        <LabelSmall color={colors.gray600}>
                          Drop Node CSV(s) here to upload...
                        </LabelSmall>
                      ),
                    },
                  }}
                  errorMessage={errors[name] && (errors[name] as any).message}
                />
              )
            }
          />

          {isNodeCsvEmpty === false && (
            <AttachmentLists
              attachments={watch('nodeCsv')}
              onDeleteBtnClick={() => {
                setValue('nodeCsv', null);
              }}
            />
          )}
        </FlexGridItem>
        <FlexGridItem>
          <Controller
            name='edgeCsv'
            control={control}
            render={({ onChange, name }) =>
              isEdgeCsvEmpty && (
                <FileUploader
                  accept='.csv'
                  multiple
                  onRetry={() => {
                    clearErrors(name as keyof SingleFileForms);
                  }}
                  onDropAccepted={(files: File[]) =>
                    onDropAccepted(
                      files,
                      onChange,
                      name as keyof SingleFileForms,
                    )
                  }
                  onDropRejected={() =>
                    onDropRejected(name as keyof SingleFileForms)
                  }
                  overrides={{
                    ContentMessage: {
                      component: () => (
                        <LabelSmall color={colors.gray600}>
                          Drop Edge CSV(s) here to upload...
                        </LabelSmall>
                      ),
                    },
                  }}
                  errorMessage={errors[name] && (errors[name] as any).message}
                />
              )
            }
          />

          {isEdgeCsvEmpty === false && (
            <AttachmentLists
              attachments={watch('edgeCsv')}
              onDeleteBtnClick={() => {
                setValue('edgeCsv', null);
              }}
            />
          )}
        </FlexGridItem>
      </FlexGrid>

      <Block position='absolute' bottom='0' right='0'>
        <Button
          type='submit'
          disabled={isNodeCsvEmpty || isEdgeCsvEmpty}
          kind={KIND.primary}
          size={SIZE.compact}
          endEnhancer={<Icon.ChevronRight size={16} />}
        >
          Continue
        </Button>
      </Block>
    </form>
  );
};

export default NodeEdgeCsv;
