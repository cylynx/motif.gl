import React, { FC, SyntheticEvent, useState } from 'react';

import {
  TYPE,
  OnChangeParams,
  Value,
  Option,
  SelectOverrides,
} from 'baseui/select';
import debounce from 'lodash/debounce';
import { Dropdown } from '../ui';

export type AsyncSingleSelectProps = {
  options: Value;
  onChange: (params: OnChangeParams) => any;
  value: Value;
  labelKey?: string;
  valueKey?: string;
  placeholder?: string;
  overrides?: SelectOverrides;
  type?: TYPE[keyof TYPE];
};

const AsyncSingleSelect: FC<AsyncSingleSelectProps> = ({
  options,
  labelKey,
  valueKey,
  onChange,
  value,
  placeholder = '',
  overrides,
  type = TYPE.search,
  ...rest
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
        const nextOptions = options
          .filter((option: Option) => {
            const optionLabel = option.label as string;
            return optionLabel.toLowerCase().includes(term.toLowerCase());
          })
          .slice(0, 10);
        setAsyncOptions(nextOptions);
        setIsLoading(false);
      }, 500);
    }, 500);

    const target = event.target as HTMLInputElement;
    handleInputChange(target.value);
  };

  return (
    <Dropdown
      isLoading={isLoading}
      options={asyncOptions}
      labelKey={labelKey}
      valueKey={valueKey}
      placeholder={placeholder}
      maxDropdownHeight='300px'
      type={type}
      onChange={onChange}
      value={value}
      onInputChange={onInputChange}
      openOnClick={false}
      overrides={overrides}
      size='compact'
      {...rest}
    />
  );
};

export default AsyncSingleSelect;
