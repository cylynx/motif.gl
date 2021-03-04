import React from 'react';
import { OnChangeParams, Value } from 'baseui/select';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import BatchSingleSelect from '../../../../components/BatchSingleSelect';

type StringSelectType = {
  onChange?: (params: OnChangeParams) => void;
  value: Value;
  options: Value;
  placeholder?: string;
};

const StringSelect = ({
  options,
  value,
  onChange,
  placeholder,
}: StringSelectType) => {
  return (
    <Block padding='scale400' width='auto' backgroundColor='backgroundTertiary'>
      <LabelXSmall
        marginBottom='scale100'
        overrides={{
          Block: {
            style: () => ({
              textTransform: 'capitalize',
            }),
          },
        }}
      >
        values in
      </LabelXSmall>
      <BatchSingleSelect
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={onChange}
      />
    </Block>
  );
};

export default StringSelect;
