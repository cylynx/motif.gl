import React, { FC } from 'react';
import { Select, TYPE } from 'baseui/select';
import { SingleStringSelectProps } from './types';

const RootStyle = () => ({
  ':focus': {
    outline: 'none',
  },
});

const SingleStringSelect: FC<SingleStringSelectProps> = ({
  options,
  labelKey,
  valueKey,
  onChange,
  value,
  placeholder = '',
}) => {
  return (
    <Select
      options={options}
      labelKey={labelKey}
      valueKey={valueKey}
      placeholder={placeholder}
      maxDropdownHeight='300px'
      type={TYPE.search}
      onChange={onChange}
      value={value}
      overrides={{
        Root: {
          style: RootStyle,
        },
      }}
      size='compact'
    />
  );
};

export default SingleStringSelect;
