import React, { BaseSyntheticEvent, FC, useMemo } from 'react';
import {
  SubmitHandler,
  UnpackNestedValue,
  useForm,
  Controller,
} from 'react-hook-form';
import { FileUploader } from 'baseui/file-uploader';
import { Block } from 'baseui/block';
import { Button, KIND, SIZE } from 'baseui/button';
import {
  TFileContent,
  TFileReaderResponse,
  MultipleFileForms,
} from '../../../../redux/import/fileUpload';
import * as Icon from '../../../../components/Icons';
import AttachmentLists from '../../../../components/AttachmentLists';
import useFileContents from '../hooks/useFileContents';
import useDataPreview from '../hooks/useDataPreview';

const JsonFiles: FC = () => {
  const { fileUpload, setAttachments, setErrorMessage } = useFileContents();
  const { previewJson } = useDataPreview();

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useForm<MultipleFileForms>({
    defaultValues: {
      attachments: fileUpload.attachments,
    },
  });

  const onSubmitForm: SubmitHandler<MultipleFileForms> = (
    _: UnpackNestedValue<MultipleFileForms>,
    e: BaseSyntheticEvent,
  ) => {
    e.preventDefault();

    const attachments = getValues('attachments') as TFileContent[];
    setAttachments(attachments);
    previewJson(attachments);
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
    }) as Promise<TFileReaderResponse>[];

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

  /*  tslint:disable-next-line  */
  const isEmptyAttachments: boolean =
    (watch('attachments') as TFileContent[]).length === 0;

  const onDeleteBtnClick = (index: number) => {
    setErrorMessage(null);
    const fileAttachments = getValues('attachments') as TFileContent[];
    const cloneFileAttachments = [...fileAttachments];
    cloneFileAttachments.splice(index, 1);
    setValue('attachments', cloneFileAttachments);
  };

  const isButtonDisabled = useMemo(() => {
    if (fileUpload.error !== null) {
      return true;
    }

    if (isEmptyAttachments) {
      return true;
    }

    return false;
  }, [isEmptyAttachments, fileUpload.error]);

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Controller
        name='attachments'
        control={control}
        render={({ field: { onChange } }) =>
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

      <Block position='absolute' bottom='scale300' right='0'>
        <Button
          type='submit'
          disabled={isButtonDisabled}
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
