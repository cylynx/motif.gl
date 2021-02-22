import React, { useState } from 'react';
import { Select, SIZE, OnChangeParams, Value, Option } from 'baseui/select';
import {
  ControlContainerStyle,
  MiniRootStyle,
  IconContainerStyle,
  DropdownStyle,
  MiniDropdownListItemStyle,
} from '../Styles/SelectStyle';

const displayOptions: Option[] = [
  { label: 'All', id: 'all' },
  { label: 'Nodes', id: 'nodes' },
  { label: 'Edges', id: 'edges' },
];

const PropertyDisplaySelection = () => {
  const [value, setValue] = useState<Value>([{ label: 'All', id: 'all' }]);
  return (
    <Select
      size={SIZE.mini}
      options={displayOptions}
      value={value}
      backspaceRemoves={false}
      backspaceClearsInputValue={false}
      clearable={false}
      closeOnSelect
      escapeClearsValue={false}
      onCloseResetsInput={false}
      onBlurResetsInput={false}
      searchable={false}
      required
      onChange={(params: OnChangeParams) => setValue(params.value)}
      overrides={{
        Root: {
          style: MiniRootStyle,
        },
        ControlContainer: {
          style: ControlContainerStyle,
        },
        IconsContainer: {
          style: IconContainerStyle,
        },
        Dropdown: {
          style: DropdownStyle,
        },
        DropdownListItem: {
          style: MiniDropdownListItemStyle,
        },
      }}
    />
  );
};

export default PropertyDisplaySelection;
