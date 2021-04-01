import React, { useEffect, useMemo } from 'react';
import { Block } from 'baseui/block';
import { isEmpty } from 'lodash';

import { OnChangeParams } from 'baseui/select';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { useForm, Controller } from 'react-hook-form';

import { Button, KIND, SIZE } from 'baseui/button';
import FormSelectWithTooltip from '../../components/FormSelectWithTooltip';
import DataPreview from './DataPreview';
import GroupEdgeConfiguration from './GroupEdgeConfiguration';
import * as Icon from '../../../../components/Icons';
import useFileContents from '../hooks/useFileContents';

const ConfigureFields = () => {
  const { fileUpload, nodeFieldOptions, edgeFieldOptions } = useFileContents();
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

  useEffect(() => {
    clearErrors();
    const edgeSource = getValues('edgeSource');
    const edgeTarget = getValues('edgeTarget');
    const edgeID = getValues('edgeID');

    const isSameWithSource = edgeSource === edgeID;
    if (isSameWithSource) {
      setError('edgeID', {
        type: 'manual',
        message: 'Value must different with Source',
      });
      setError('edgeSource', {
        type: 'manual',
        message: 'Value must different with Edge ID',
      });
    }

    const isSameWithTarget = edgeTarget === edgeID;
    if (isSameWithTarget) {
      setError('edgeTarget', {
        type: 'manual',
        message: 'Value must different with Edge ID',
      });
      setError('edgeID', {
        type: 'manual',
        message: 'Value must different with Target',
      });
    }

    const isSameSourceAndTarget = edgeTarget === edgeID;
    if (isSameSourceAndTarget) {
      setError('edgeID', {
        type: 'manual',
        message: 'Value must different with Target',
      });
      setError('edgeTarget', {
        type: 'manual',
        message: 'Value must different with Edge ID',
      });
    }
  }, [watch('edgeID'), watch('edgeSource'), watch('edgeTarget')]);

  const onNodeIDChange = (params: OnChangeParams, onChange: any) => {
    const [selectedOption] = params.value;
    onChange(selectedOption.id as string);
  };

  const onEdgeIDChange = (params: OnChangeParams, onChange: any) => {
    const [selectedOption] = params.value;
    const { id: edgeID } = selectedOption;
    onChange(edgeID as string);
  };

  const onEdgeSourceChange = (params: OnChangeParams, onChange: any) => {
    const [selectedOption] = params.value;
    const { id: edgeSource } = selectedOption;
    onChange(edgeSource as string);
  };

  const onEdgeTargetChange = (params: OnChangeParams, onChange: any) => {
    const [selectedOption] = params.value;
    const { id: edgeTarget } = selectedOption;
    onChange(edgeTarget as string);
  };

  return (
    <Block marginTop='scale200'>
      <form>
        <FlexGrid flexGridColumnGap='scale300' flexGridColumnCount={4}>
          <FlexGridItem>
            <Controller
              name='nodeID'
              control={control}
              render={({ onChange, name, value }) => (
                <FormSelectWithTooltip
                  name={name}
                  onChange={(params: OnChangeParams) =>
                    onNodeIDChange(params, onChange)
                  }
                  tooltipText='Node ID'
                  options={nodeFieldOptions}
                  value={value}
                />
              )}
            />
          </FlexGridItem>
          <FlexGridItem>
            <Controller
              name='edgeID'
              control={control}
              render={({ onChange, name, value }) => (
                <FormSelectWithTooltip
                  name={name}
                  onChange={(params: OnChangeParams) =>
                    onEdgeIDChange(params, onChange)
                  }
                  tooltipText='Edge ID'
                  options={edgeFieldOptions}
                  value={value}
                  error={errors[name] && (errors[name] as any).message}
                />
              )}
            />
          </FlexGridItem>

          <FlexGridItem>
            <Controller
              name='edgeSource'
              control={control}
              render={({ onChange, name, value }) => (
                <FormSelectWithTooltip
                  name={name}
                  onChange={(params: OnChangeParams) => {
                    onEdgeSourceChange(params, onChange);
                  }}
                  tooltipText='Source'
                  options={edgeFieldOptions}
                  value={value}
                  error={errors[name] && (errors[name] as any).message}
                />
              )}
            />
          </FlexGridItem>

          <FlexGridItem>
            <Controller
              name='edgeTarget'
              control={control}
              render={({ onChange, name, value }) => (
                <FormSelectWithTooltip
                  name={name}
                  onChange={(params: OnChangeParams) =>
                    onEdgeTargetChange(params, onChange)
                  }
                  tooltipText='Target'
                  options={edgeFieldOptions}
                  value={value}
                  error={errors[name] && (errors[name] as any).message}
                />
              )}
            />
          </FlexGridItem>
        </FlexGrid>

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
