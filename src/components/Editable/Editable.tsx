import React, { useState, Fragment } from 'react';

import { LabelLarge } from 'baseui/typography';
import { Input } from 'baseui/input';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

export type EditableProps = {
  text: string;
  placeholder?: string;
  iconPosition: 'left' | 'right';
  onSubmit?: (editedText: string) => any;
};

export type ButtonGroupProps = {
  onSubmit: () => any;
  onCancel: () => any;
};

export const ButtonGroup = ({ onSubmit, onCancel }: ButtonGroupProps) => (
  <Fragment>
    <Button shape='round' onClick={onSubmit} kind='tertiary' size='mini'>
      <CheckOutlined style={{ fontSize: '16px' }} />
    </Button>
    <Button shape='round' onClick={onCancel} kind='tertiary' size='mini'>
      <CloseOutlined style={{ fontSize: '16px' }} />
    </Button>
  </Fragment>
);

const Editable = ({
  text,
  placeholder = '...',
  iconPosition = 'left',
  onSubmit,
}: EditableProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [value, setValue] = useState(text);

  const onClickEdit = () => {
    setIsEdit(true);
  };

  const onCancel = () => {
    setValue(text);
    setIsEdit(false);
  };

  const onConfirmSubmit = () => {
    onSubmit(value);
    setIsEdit(false);
  };

  return (
    <Fragment>
      {!isEdit && (
        <Block
          display='flex'
          paddingTop='4px'
          paddingBottom='4px'
          alignItems='center'
        >
          {iconPosition === 'right' && (
            <LabelLarge marginRight='8px'>{value}</LabelLarge>
          )}
          <Button
            shape='round'
            onClick={onClickEdit}
            kind='minimal'
            size='mini'
          >
            <EditOutlined style={{ fontSize: '16px' }} />
          </Button>
          {iconPosition === 'left' && (
            <LabelLarge marginLeft='8px'>{value}</LabelLarge>
          )}
        </Block>
      )}
      {isEdit && (
        <Input
          value={value}
          autoFocus
          // @ts-ignore
          onChange={(e) => setValue(e.target.value)}
          size='compact'
          placeholder={placeholder}
          endEnhancer={
            <ButtonGroup onSubmit={onConfirmSubmit} onCancel={onCancel} />
          }
          overrides={{
            Root: {
              style: { backgroundColor: 'transparent' },
            },
            EndEnhancer: {
              style: { backgroundColor: 'transparent' },
            },
          }}
        />
      )}
    </Fragment>
  );
};

export default Editable;
