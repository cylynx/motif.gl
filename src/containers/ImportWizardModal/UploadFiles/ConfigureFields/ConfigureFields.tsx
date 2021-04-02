import React, { BaseSyntheticEvent } from 'react';
import { Block } from 'baseui/block';
import { isEmpty } from 'lodash';
import { OnChangeParams } from 'baseui/select';
import { useForm, UnpackNestedValue, SubmitHandler } from 'react-hook-form';
import { Button, KIND, SIZE } from 'baseui/button';
import { useDispatch } from 'react-redux';

import DataPreview from './DataPreview';
import GroupEdgeConfiguration from './GroupEdgeConfiguration';
import AccessorFields from './AccessorFields';

import useFileContents from '../hooks/useFileContents';
import useImportData from '../hooks/useImportData';

import * as Icon from '../../../../components/Icons';
import { ConfigureFieldsForm } from '../../../../redux/import/fileUpload';
import { UISlices } from '../../../../redux/ui';

const ConfigureFields = () => {
  const {
    fileUpload: { accessors, groupEdge, isEdgeGroupable, dataType },
    setAccessors,
    setGroupEdge,
  } = useFileContents();

  const { importJson } = useImportData();

  const {
    watch,
    control,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    getValues,
  } = useForm<ConfigureFieldsForm>({
    defaultValues: {
      nodeID: accessors.nodeID,
      edgeID: accessors.edgeID,
      edgeSource: accessors.edgeSource,
      edgeTarget: accessors.edgeTarget,
      groupEdge,
    },
  });

  const dispatch = useDispatch();
  const isSubmitDisabled = isEmpty(errors) === false;

  const onSelectChange = (params: OnChangeParams, onChange: any) => {
    const [selectedOption] = params.value;
    onChange(selectedOption.id as string);
  };

  const importLocalFile: SubmitHandler<ConfigureFieldsForm> = (
    data: UnpackNestedValue<ConfigureFieldsForm>,
    e: BaseSyntheticEvent,
  ) => {
    e.preventDefault();
    const { groupEdge, ...accessors } = data;
    setAccessors(accessors);
    setGroupEdge(groupEdge);

    if (dataType === 'json') {
      importJson();
      dispatch(UISlices.closeModal());
      return;
    }
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
        />
        <DataPreview isEdgeGroupable={isEdgeGroupable} />
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

/**
 * <ConfirmationModal
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
 */
