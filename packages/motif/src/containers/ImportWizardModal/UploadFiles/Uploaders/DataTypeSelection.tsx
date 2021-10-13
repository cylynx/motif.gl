import React, { FC, useMemo } from 'react';
import { Block } from 'baseui/block';
import { FormControl } from 'baseui/form-control';
import { OnChangeParams, Option } from 'baseui/select';

import JsonFiles from './JsonFiles';
import EdgeListCsv from './EdgeListCsv';
import NodeEdgeCsv from './NodeEdgeCsv';
import { UIConstants } from '../../../../redux/ui';
import useFileContents from '../hooks/useFileContents';
import { TFileContentState } from '../../../../redux/import/fileUpload';
import { Dropdown } from '../../../../components/ui/Dropdown';
import UploadErrorDisplay from './UploadErrorDisplay';

const importOptions = Object.values(UIConstants.OPTIONS);

type DataTypeSelectionProps = {};
const DataTypeSelection: FC<DataTypeSelectionProps> = () => {
  const { fileUpload, setDataType, resetState } = useFileContents();
  const { error } = fileUpload;

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
        <Dropdown
          transparent /* show without transparency in pr */
          id='DataTypeSelection'
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

      <Block marginBottom='4px' />
      {dataType.id === 'json' && <JsonFiles />}
      {dataType.id === 'edgeListCsv' && <EdgeListCsv />}
      {dataType.id === 'nodeEdgeCsv' && <NodeEdgeCsv />}

      <UploadErrorDisplay error={error} />
    </Block>
  );
};

export default DataTypeSelection;
