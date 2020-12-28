import React, { FC } from 'react';
import { SelectOptions } from '../../../../components/SelectVariable/SelectVariable';
import FilterSelectionHeader from './FilterSelectionHeader';

export type FilterSelectionProps = {
  selectOptions: SelectOptions;
};

const FilterSelection: FC<FilterSelectionProps> = ({ selectOptions }) => {
  return <FilterSelectionHeader selectOptions={selectOptions} />;
};

export default FilterSelection;
