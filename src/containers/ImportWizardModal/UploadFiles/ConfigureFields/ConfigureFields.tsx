import React from 'react';
import { Block } from 'baseui/block';
import { isEmpty } from 'lodash';

import { OnChangeParams } from 'baseui/select';
import { useForm } from 'react-hook-form';

import { Button, KIND, SIZE } from 'baseui/button';
import DataPreview from './DataPreview';
import GroupEdgeConfiguration from './GroupEdgeConfiguration';
import * as Icon from '../../../../components/Icons';
import useFileContents from '../hooks/useFileContents';
import AccessorFields from './AccessorFields';

const ConfigureFields = () => {
  const { fileUpload } = useFileContents();
  const { accessors, groupEdge, isEdgeGroupable } = fileUpload;

  const {
    watch,
    control,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    getValues,
  } = useForm({
    defaultValues: {
      nodeID: accessors.nodeID,
      edgeID: accessors.edgeID,
      edgeSource: accessors.edgeSource,
      edgeTarget: accessors.edgeTarget,
      groupEdges: groupEdge,
    },
  });

  const isSubmitDisabled = isEmpty(errors) === false;

  const onSelectChange = (params: OnChangeParams, onChange: any) => {
    const [selectedOption] = params.value;
    onChange(selectedOption.id as string);
  };

  return (
    <Block marginTop='scale200'>
      <form>
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
