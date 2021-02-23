import React, { useMemo } from 'react';
import { Select, SIZE, OnChangeParams, Option } from 'baseui/select';
import {
  ControlContainerStyle,
  MiniRootStyle,
  IconContainerStyle,
  DropdownStyle,
  MiniDropdownListItemStyle,
} from '../Styles/SelectStyle';
import useSearchOption from '../hooks/useSearchOption';
import { IUseSearchOptions } from '../types';
import { SelectionDisplay } from '../../../../redux/graph';

const displayOptions: Option[] = [
  { label: 'All', id: 'all' },
  { label: 'Nodes', id: 'nodes' },
  { label: 'Edges', id: 'edges' },
];

const PropertyDisplaySelection = () => {
  const {
    searchOptions,
    updateSelectionDisplay,
  } = useSearchOption() as IUseSearchOptions;
  const { selectionDisplay } = searchOptions;

  const selectedOption: Option = useMemo(() => {
    return displayOptions.find(
      (option: Option) => option.id === selectionDisplay,
    );
  }, [selectionDisplay]);

  const onSelectChange = (params: OnChangeParams): void => {
    const [selectedOption] = params.value;
    const { id } = selectedOption as Option;
    updateSelectionDisplay(id as SelectionDisplay);
  };

  return (
    <Select
      size={SIZE.mini}
      options={displayOptions}
      value={[selectedOption]}
      backspaceRemoves={false}
      backspaceClearsInputValue={false}
      clearable={false}
      closeOnSelect
      escapeClearsValue={false}
      onCloseResetsInput={false}
      onBlurResetsInput={false}
      searchable={false}
      required
      onChange={onSelectChange}
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
