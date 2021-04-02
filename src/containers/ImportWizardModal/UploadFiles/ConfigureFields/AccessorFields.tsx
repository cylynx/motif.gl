import React, { ReactNode, useMemo, FC, useEffect } from 'react';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { Controller, Control } from 'react-hook-form';
import { OnChangeParams, Value } from 'baseui/select';
import useFileContents from '../hooks/useFileContents';
import FormSelectWithTooltip from '../../components/FormSelectWithTooltip';

type AccessorField = {
  name: string;
  tooltipText: ReactNode;
  options: Value;
};
type AccessorsFieldsProps = {
  onSelectChange: (params: OnChangeParams, onChange: any) => any;
  control: Control<Record<string, any>>;
  watch: (names?: string | string[]) => any;
  setError: (
    name: string,
    error: {
      type?: string;
      types?: object;
      message?: string;
      shouldFocus?: boolean;
    },
  ) => void;
  clearErrors: (name?: string | string[]) => void;
  getValues: (payload?: string | string[]) => Object;
  errors: Record<string, Object>;
};
const AccessorFields: FC<AccessorsFieldsProps> = ({
  onSelectChange,
  control,
  watch,
  setError,
  clearErrors,
  getValues,
  errors,
}) => {
  const { nodeFieldOptions, edgeFieldOptions } = useFileContents();

  useEffect(() => {
    clearErrors();
    const edgeSource = getValues('edgeSource');
    const edgeTarget = getValues('edgeTarget');
    const edgeID = getValues('edgeID');

    const isSameWithSource = edgeSource === edgeID;
    if (isSameWithSource) {
      setError('edgeID', {
        type: 'manual',
        message: 'Value must differ with Source',
      });
      setError('edgeSource', {
        type: 'manual',
        message: 'Value must differ with Edge ID',
      });
    }

    const isSameWithTarget = edgeTarget === edgeID;
    if (isSameWithTarget) {
      setError('edgeTarget', {
        type: 'manual',
        message: 'Value must differ with Edge ID',
      });
      setError('edgeID', {
        type: 'manual',
        message: 'Value must differ with Target',
      });
    }

    const isSameSourceAndTarget = edgeTarget === edgeID;
    if (isSameSourceAndTarget) {
      setError('edgeID', {
        type: 'manual',
        message: 'Value must differ with Target',
      });
      setError('edgeTarget', {
        type: 'manual',
        message: 'Value must differ with Edge ID',
      });
    }
  }, [watch('edgeID'), watch('edgeSource'), watch('edgeTarget')]);

  const ACCESSOR_FIELDS: AccessorField[] = useMemo(
    () => [
      {
        name: 'nodeID',
        tooltipText: 'Node ID',
        options: nodeFieldOptions,
      },
      {
        name: 'edgeID',
        tooltipText: 'Edge ID',
        options: edgeFieldOptions,
      },
      {
        name: 'edgeSource',
        tooltipText: 'Source',
        options: edgeFieldOptions,
      },
      {
        name: 'edgeTarget',
        tooltipText: 'Target',
        options: edgeFieldOptions,
      },
    ],
    [nodeFieldOptions, edgeFieldOptions],
  );

  return (
    <FlexGrid flexGridColumnGap='scale300' flexGridColumnCount={4}>
      {ACCESSOR_FIELDS.map((field: AccessorField) => {
        const { name, tooltipText, options } = field;
        return (
          <FlexGridItem key={name}>
            <Controller
              name={name}
              control={control}
              render={({ onChange, name, value }) => (
                <FormSelectWithTooltip
                  name={name}
                  onChange={(params: OnChangeParams) =>
                    onSelectChange(params, onChange)
                  }
                  tooltipText={tooltipText}
                  options={options}
                  value={value}
                  error={errors[name] && (errors[name] as any).message}
                />
              )}
            />
          </FlexGridItem>
        );
      })}
    </FlexGrid>
  );
};

export default AccessorFields;
