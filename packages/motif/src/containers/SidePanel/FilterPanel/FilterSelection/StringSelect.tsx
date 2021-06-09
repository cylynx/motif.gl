import React from 'react';
import { OnChangeParams, Value } from 'baseui/select';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
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
    <Block width='auto'>
      <LabelSmall paddingBottom='scale100' color='contentInverseSecondary'>
        Value(s) of selected variable
      </LabelSmall>
      <BatchSingleSelect
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={onChange}
        multi
      />
    </Block>
  );
};

export default StringSelect;
