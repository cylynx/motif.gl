import React, { FC, SyntheticEvent, useState } from 'react';

import {
  Select,
  TYPE,
  OnChangeParams,
  Value,
  Option,
  SelectOverrides,
} from 'baseui/select';
import debounce from 'lodash/debounce';

export type AsyncSingleSelectProps = {
  options: Value;
  labelKey: string;
  valueKey: string;
  onChange: (params: OnChangeParams) => any;
  value: Value;
  placeholder?: string;
  overrides?: SelectOverrides;
};

const AsyncSingleSelect: FC<AsyncSingleSelectProps> = ({
  options,
  labelKey,
  valueKey,
  onChange,
  value,
  placeholder = '',
  overrides,
}) => {
  const [asyncOptions, setAsyncOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onInputChange = (event: SyntheticEvent) => {
    const handleInputChange = debounce((term: string) => {
      if (!term) {
        setAsyncOptions([]);
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        const nextOptions = options.filter((option: Option) => {
          const optionLabel = option.label as string;
          return optionLabel.toLowerCase().includes(term.toLowerCase());
        });
        setAsyncOptions(nextOptions);
        setIsLoading(false);
      }, 500);
    }, 500);

    const target = event.target as HTMLInputElement;
    handleInputChange(target.value);
  };

  return (
    <Select
      isLoading={isLoading}
      options={asyncOptions}
      labelKey={labelKey}
      valueKey={valueKey}
      placeholder={placeholder}
      maxDropdownHeight='300px'
      type={TYPE.search}
      onChange={onChange}
      value={value}
      onInputChange={onInputChange}
      openOnClick={false}
      overrides={overrides}
      size='compact'
    />
  );
};

export default AsyncSingleSelect;
