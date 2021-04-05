import React, { BaseSyntheticEvent } from 'react';
import { Block } from 'baseui/block';
import { isEmpty } from 'lodash';
import { OnChangeParams } from 'baseui/select';
import { useForm, UnpackNestedValue, SubmitHandler } from 'react-hook-form';
import { Button, KIND, SIZE } from 'baseui/button';

import DataPreview from './DataPreview';
import GroupEdgeConfiguration from './GroupEdgeConfiguration';
import AccessorFields from './AccessorFields';

import useFileContents from '../hooks/useFileContents';
import useImportData from '../hooks/useImportData';

import * as Icon from '../../../../components/Icons';
import {
  ConfigureFieldsForm,
  TFileContent,
  SingleFileForms,
} from '../../../../redux/import/fileUpload';

const ConfigureFields = () => {
  const {
    fileUpload: {
      accessors,
      groupEdge,
      isEdgeGroupable,
      dataType,
      attachments,
    },
    setAccessors,
  } = useFileContents();

  const { importJson, importEdgeList, importNodeEdge } = useImportData();

  const {
    watch,
    control,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useForm<ConfigureFieldsForm>({
    defaultValues: {
      nodeID: accessors.nodeID,
      edgeID: accessors.edgeID,
      edgeSource: accessors.edgeSource,
      edgeTarget: accessors.edgeTarget,
      groupEdge,
    },
  });

  const isSubmitDisabled = isEmpty(errors) === false;

  const onSelectChange = (params: OnChangeParams, onChange: any) => {
    const [selectedOption] = params.value;
    onChange(selectedOption.id as string);

    const { groupEdge, ...accessors } = getValues();
    setAccessors(accessors);
  };

  const importLocalFile: SubmitHandler<ConfigureFieldsForm> = (
    data: UnpackNestedValue<ConfigureFieldsForm>,
    e: BaseSyntheticEvent,
  ) => {
    e.preventDefault();
    const { groupEdge, ...accessors } = data;

    if (dataType === 'json') {
      // TODO: Overwrite Styles modal
      importJson(attachments as TFileContent[], groupEdge, accessors, true);
      return;
    }

    if (dataType === 'edgeListCsv') {
      importEdgeList(attachments as TFileContent[], groupEdge, accessors);
      return;
    }

    // nodeEdgeCsv
    importNodeEdge(attachments as SingleFileForms, groupEdge, accessors);
    return;
  };

  return (
    <Block marginTop='scale200'>
      <form onSubmit={handleSubmit(importLocalFile)}>
        <AccessorFields
          onSelectChange={onSelectChange}
          errors={errors}
          control={control}
          watch={watch}
          setError={setError}
          clearErrors={clearErrors}
          getValues={getValues}
          setValue={setValue}
        />
        <DataPreview isEdgeGroupable={isEdgeGroupable} dataType={dataType} />
        {isEdgeGroupable && <GroupEdgeConfiguration control={control} />}

        <Block position='absolute' bottom='0' right='0'>
          <Button
            type='submit'
            disabled={isSubmitDisabled}
            kind={KIND.primary}
            size={SIZE.compact}
            endEnhancer={<Icon.ChevronRight size={16} />}
          >
            Continue
          </Button>
        </Block>
      </form>
    </Block>
  );
};

export default ConfigureFields;
