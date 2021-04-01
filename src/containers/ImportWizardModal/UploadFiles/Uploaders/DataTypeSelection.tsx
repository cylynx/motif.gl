import React, { FC, useMemo } from 'react';
import { styled } from 'baseui';
import { Block } from 'baseui/block';
import { FormControl } from 'baseui/form-control';
import { OnChangeParams, Option, Select } from 'baseui/select';

import JsonFiles from './JsonFiles';
import EdgeListCsv from './EdgeListCsv';
import NodeEdgeCsv from './NodeEdgeCsv';
import { UIConstants } from '../../../../redux/ui';
import useFileContents from '../hooks/useFileContents';
import { TFileContentState } from '../../../../redux/import/fileUpload';

const importOptions = Object.values(UIConstants.OPTIONS);

const StyledHr = styled('hr', ({ $theme }) => ({
  borderColor: '#E2E2E2',
  borderWidth: '1px',
  borderStyle: 'solid',
  marginTop: $theme.sizing.scale300,
}));

type DataTypeSelectionProps = { nextStep: () => void };
const DataTypeSelection: FC<DataTypeSelectionProps> = ({ nextStep }) => {
  const { fileUpload, setDataType, resetState } = useFileContents();

  const dataType: Option = useMemo(() => {
    const selectedDataType = importOptions.find(
      (option: Option) => option.id === fileUpload.dataType,
    );

    if (selectedDataType === undefined) {
      return importOptions[0];
    }

    return selectedDataType;
  }, [fileUpload.dataType]);

  return (
    <Block marginTop='scale600'>
      <FormControl
        label='Data Type'
        overrides={{ ControlContainer: { style: { marginBottom: 0 } } }}
      >
        <Select
          size='compact'
          value={[dataType]}
          options={importOptions}
          clearable={false}
          searchable={false}
          onChange={(data: OnChangeParams) => {
            const [option] = data.value;
            const { id } = option as Option;
            resetState();
            setDataType(id as TFileContentState['dataType']);
          }}
          placeholder='Select Import Data Type'
        />
      </FormControl>

      <StyledHr />

      {dataType.id === 'json' && <JsonFiles nextStep={nextStep} />}
      {dataType.id === 'edgeListCsv' && <EdgeListCsv nextStep={nextStep} />}
      {dataType.id === 'nodeEdgeCsv' && <NodeEdgeCsv nextStep={nextStep} />}
    </Block>
  );
};

export default DataTypeSelection;
