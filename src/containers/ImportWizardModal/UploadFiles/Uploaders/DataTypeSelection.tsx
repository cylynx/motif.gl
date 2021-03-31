import React, { FC, useMemo, useState } from 'react';
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

type DataTypeSelectionProps = { nextStep: () => void };
const DataTypeSelection: FC<DataTypeSelectionProps> = ({ nextStep }) => {
  const { fileUpload, setDataType } = useFileContents();

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
      <FormControl label='Data Type'>
        <Select
          size='compact'
          value={[dataType]}
          options={importOptions}
          clearable={false}
          searchable={false}
          onChange={(data: OnChangeParams) => {
            const [option] = data.value;
            const { id } = option as Option;
            setDataType(id as TFileContentState['dataType']);
          }}
          placeholder='Select Import Data Type'
        />
      </FormControl>

      {dataType.id === 'json' && <JsonFiles nextStep={nextStep} />}
      {dataType.id === 'edgeListCsv' && <EdgeListCsv nextStep={nextStep} />}
      {dataType.id === 'nodeEdgeCsv' && <NodeEdgeCsv />}
    </Block>
  );
};

export default DataTypeSelection;
