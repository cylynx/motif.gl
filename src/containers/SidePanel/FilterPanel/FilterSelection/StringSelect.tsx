import React, { FC } from 'react';
import { Value } from 'baseui/select';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import MultiStringSelect from '../../../../components/MultiStringSelect';

type StringSelectType = {
  onChange?: (params: Value) => void;
  value: Value;
  options: Value;
  placeholder?: string;
};

const StringSelect: FC<StringSelectType> = ({
  options,
  value,
  onChange,
  placeholder,
}) => {
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
      <MultiStringSelect
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={onChange}
      />
    </Block>
  );
};

export default StringSelect;
