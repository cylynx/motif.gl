import React, { BaseSyntheticEvent, FC } from 'react';
import {
  Controller,
  SubmitHandler,
  UnpackNestedValue,
  useForm,
} from 'react-hook-form';
import { FileUploader } from 'baseui/file-uploader';
import { Block } from 'baseui/block';
import { Button, KIND, SIZE } from 'baseui/button';
import useFileContents from '../hooks/useFileContents';
import {
  MultipleFileForms,
  TFileContent,
  TFileReaderResponse,
} from '../../../../redux/import/fileUpload';
import AttachmentLists from '../../../../components/AttachmentLists';
import * as Icon from '../../../../components/Icons';
import useDataPreview from '../hooks/useDataPreview';

const cleanInput = (file: string) => file.replace(/\r/g, '').trim();

const EdgeListCsv: FC = () => {
  const { fileUpload, setAttachments } = useFileContents();
  const { previewEdgeList } = useDataPreview();

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      attachments: fileUpload.attachments,
    },
  });

  const onSubmitForm: SubmitHandler<MultipleFileForms> = (
    data: UnpackNestedValue<MultipleFileForms>,
    e: BaseSyntheticEvent,
  ) => {
    e.preventDefault();

    const { attachments } = data;
    setAttachments(attachments as TFileContent[]);
    previewEdgeList(attachments as TFileContent[]);
  };

  const onRetry = () => {
    clearErrors('attachments');
  };

  const onDropRejected = () => {
    setError('attachments', {
      type: 'manual',
      message:
        'Invalid file type. Please upload a CSV file or select the correct data type in the dropdown box.',
    });
  };

  const onDropAccepted = (acceptedFiles: File[], onChange: any) => {
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
        setError('attachments', {
          type: 'manual',
          message: 'The file provided is not readable',
        });
      });
  };

  const isEmptyAttachments: boolean =
    (watch('attachments') as TFileContent[]).length === 0;

  const onDeleteBtnClick = (index: number) => {
    const fileAttachments = getValues('attachments') as TFileContent[];
    const cloneFileAttachments = [...fileAttachments];
    cloneFileAttachments.splice(index, 1);
    setValue('attachments', cloneFileAttachments);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Controller
        name='attachments'
        control={control}
        render={({ field: { onChange } }) =>
          isEmptyAttachments && (
            <FileUploader
              accept='.csv'
              multiple
              onRetry={onRetry}
              onDropAccepted={(acceptedOrRejected: File[]) =>
                onDropAccepted(acceptedOrRejected, onChange)
              }
              onDropRejected={onDropRejected}
              errorMessage={
                errors.attachments && (errors.attachments as any).message
              }
            />
          )
        }
      />

      {isEmptyAttachments === false && (
        <AttachmentLists
          attachments={watch('attachments') as TFileContent[]}
          onDeleteBtnClick={onDeleteBtnClick}
        />
      )}

      <Block position='absolute' bottom='scale300' right='0'>
        <Button
          type='submit'
          disabled={isEmptyAttachments}
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

export default EdgeListCsv;
