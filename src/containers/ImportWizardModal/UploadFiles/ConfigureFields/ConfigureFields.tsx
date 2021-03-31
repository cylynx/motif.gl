import React from 'react';
import { Block } from 'baseui/block';

import { OnChangeParams } from 'baseui/select';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { useForm, Controller } from 'react-hook-form';

import { Button, KIND, SIZE } from 'baseui/button';
import FormSelectWithTooltip from '../../components/FormSelectWithTooltip';
import DataPreview from './DataPreview';
import GroupEdgeConfiguration from './GroupEdgeConfiguration';
import * as Icon from '../../../../components/Icons';

const ConfigureFields = () => {
  const {
    watch,
    control,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      nodeID: '123',
      edgeID: '123',
      edgeSource: '123',
      edgeTarget: '123',
      groupEdges: false,
    },
  });

  return (
    <Block marginTop='scale300'>
      <form>
        <FlexGrid flexGridColumnGap='scale300' flexGridColumnCount={4}>
          <FlexGridItem>
            <Controller
              name='nodeID'
              control={control}
              render={({ onChange, name }) => (
                <FormSelectWithTooltip
                  name={name}
                  onChange={(params: OnChangeParams) => {
                    onChange(params.value[0].id);
                  }}
                  tooltipText='Node ID'
                  options={[
                    {
                      id: '123',
                      label: '123',
                    },
                  ]}
                  value={[{ id: '123', label: '123' }]}
                />
              )}
            />
          </FlexGridItem>
          <FlexGridItem>
            <Controller
              name='edgeID'
              control={control}
              render={({ onChange, name }) => (
                <FormSelectWithTooltip
                  name={name}
                  onChange={(params: OnChangeParams) => {
                    onChange(params.value[0].id);
                  }}
                  tooltipText='Edge ID'
                  options={[
                    {
                      id: '123',
                      label: '123',
                    },
                  ]}
                  value={[{ id: '123', label: '123' }]}
                />
              )}
            />
          </FlexGridItem>

          <FlexGridItem>
            <Controller
              name='edgeSource'
              control={control}
              render={({ onChange, name }) => (
                <FormSelectWithTooltip
                  name={name}
                  onChange={(params: OnChangeParams) => {
                    onChange(params.value[0].id);
                  }}
                  tooltipText='Source'
                  options={[
                    {
                      id: '123',
                      label: '123',
                    },
                  ]}
                  value={[{ id: '123', label: '123' }]}
                />
              )}
            />
          </FlexGridItem>

          <FlexGridItem>
            <Controller
              name='edgeTarget'
              control={control}
              render={({ onChange, name }) => (
                <FormSelectWithTooltip
                  name={name}
                  onChange={(params: OnChangeParams) => {
                    onChange(params.value[0].id);
                  }}
                  tooltipText='Target'
                  options={[
                    {
                      id: '123',
                      label: '123',
                    },
                  ]}
                  value={[{ id: '123', label: '123' }]}
                />
              )}
            />
          </FlexGridItem>
        </FlexGrid>

        <DataPreview />
        <GroupEdgeConfiguration control={control} />

        <Block position='absolute' bottom='0' right='0'>
          <Button
            type='submit'
            disabled={false}
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
