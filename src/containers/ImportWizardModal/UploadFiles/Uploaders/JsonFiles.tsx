import React, { BaseSyntheticEvent, FC } from 'react';
import {
  SubmitHandler,
  UnpackNestedValue,
  useForm,
  Controller,
} from 'react-hook-form';
import { FileUploader } from 'baseui/file-uploader';
import { Block } from 'baseui/block';
import { ParagraphXSmall } from 'baseui/typography';
import { Button, KIND, SIZE } from 'baseui/button';
import {
  TFileContent,
  TFileReaderResponse,
  MultipleFileForms,
} from '../../../../redux/import/fileUpload';
import * as Icon from '../../../../components/Icons';
import AttachmentLists from '../../components/AttachmentLists';
import useFileContents from '../hooks/useFileContents';
import { SimpleTooltip } from '../../../../components/ui';

type JsonFilesProps = { nextStep: () => void };
const JsonFiles: FC<JsonFilesProps> = ({ nextStep }) => {
  const {
    watch,
    control,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useForm<MultipleFileForms>({
    defaultValues: {
      attachments: [],
    },
  });

  const { setAttachments } = useFileContents();

  const onSubmitForm: SubmitHandler<MultipleFileForms> = (
    data: UnpackNestedValue<MultipleFileForms>,
    e: BaseSyntheticEvent,
  ) => {
    e.preventDefault();

    const { attachments } = data;
    setAttachments(attachments);
    nextStep();
  };

  const onRetry = () => {
    clearErrors('attachments');
  };

  const onDropRejected = () => {
    setError('attachments', {
      type: 'manual',
      message:
        'Invalid file type. Please upload a JSON file or select the correct data type in the dropdown box.',
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
        const jsonGraphList: TFileContent[] = fileResponses.map((response) => {
          const { name, results } = response;
          const fileContent: TFileContent = {
            fileName: name,
            content: JSON.parse(results as string),
          };

          return fileContent;
        });

        onChange(jsonGraphList);
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
    fileAttachments.splice(index, 1);
    setValue('attachments', fileAttachments);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Controller
        name='attachments'
        control={control}
        render={({ onChange }) =>
          isEmptyAttachments && (
            <FileUploader
              accept='.json'
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

      <Block position='absolute' bottom='0' right='0'>
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

export default JsonFiles;
