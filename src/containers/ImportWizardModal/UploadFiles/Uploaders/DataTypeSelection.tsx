import React, { useState } from 'react';
import { Block } from 'baseui/block';
import { FormControl } from 'baseui/form-control';
import { OnChangeParams, Option, Select } from 'baseui/select';
import JsonFiles from './JsonFiles';
import EdgeListCsv from './EdgeListCsv';
import NodeEdgeCsv from './NodeEdgeCsv';
import { UIConstants } from '../../../../redux/ui';

const importOptions = Object.values(UIConstants.OPTIONS);

const DataTypeSelection = () => {
  const [dataType, setDataType] = useState<Option>(importOptions[0]);

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
            setDataType(option as Option);
          }}
          placeholder='Select Import Data Type'
        />
      </FormControl>

      {dataType.id === 'json' && <JsonFiles />}
      {dataType.id === 'edgeListCsv' && <EdgeListCsv />}
      {dataType.id === 'nodeEdgeCsv' && <NodeEdgeCsv />}
    </Block>
  );
};

export default DataTypeSelection;
