import React, { BaseSyntheticEvent, useState } from 'react';
import {
  SubmitHandler,
  UnpackNestedValue,
  useForm,
  Controller,
} from 'react-hook-form';
import { FileUploader } from 'baseui/file-uploader';
import { useDispatch } from 'react-redux';
import { TFileContent, TFileReaderResponse } from '../types';
import { UIThunks } from '../../../../redux/ui';

const JsonFiles = () => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { watch, control, handleSubmit } = useForm({
    defaultValues: {
      dataType: 'json',
      attachments: [],
    },
  });

  const onSubmitForm: SubmitHandler<any> = (
    data: UnpackNestedValue<any>,
    e: BaseSyntheticEvent,
  ) => {
    e.preventDefault();

    console.log(data);
  };

  const onRetry = () => {
    setErrorMessage('');
  };

  const onDropRejected = () => {
    setErrorMessage(
      'Invalid file type. Please upload a JSON file or select the correct data type in the dropdown box.',
    );
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
      .catch(() =>
        dispatch(
          UIThunks.show('The file provided is not readable', 'negative'),
        ),
      );
  };

  const isEmptyAttachments: boolean = watch('attachments').length === 0;

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
              errorMessage={errorMessage}
            />
          )
        }
      />
    </form>
  );
};

export default JsonFiles;
