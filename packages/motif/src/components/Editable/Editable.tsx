/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, Fragment } from 'react';

import { useStyletron } from 'baseui';
import {
  LabelLarge,
  LabelMedium,
  LabelSmall,
  ParagraphLarge,
  ParagraphMedium,
  ParagraphSmall,
} from 'baseui/typography';
import { Input } from 'baseui/input';
import { Button } from 'baseui/button';
import * as Icon from '../Icons';

export type EditableProps = {
  text: string;
  textComponent?:
    | 'LabelLarge'
    | 'LabelMedium'
    | 'LabelSmall'
    | 'ParagraphLarge'
    | 'ParagraphMedium'
    | 'ParagraphSmall';
  placeholder?: string;
  editIcon?: boolean;
  onSubmit?: (editedText: string) => any;
  onChange?: (editedText: string) => any;
};

export type ButtonGroupProps = {
  onSubmit: () => any;
  onCancel: () => any;
};

const componentMapper = {
  LabelLarge,
  LabelMedium,
  LabelSmall,
  ParagraphLarge,
  ParagraphMedium,
  ParagraphSmall,
};

export const ButtonGroup = ({ onSubmit, onCancel }: ButtonGroupProps) => (
  <Fragment>
    <Button shape='square' onClick={onSubmit} kind='primary' size='mini'>
      <Icon.Tick />
    </Button>
    <Button shape='square' onClick={onCancel} kind='primary' size='mini'>
      <Icon.X />
    </Button>
  </Fragment>
);

/**
 * Use either onSubmit or onChange event handler.
 * If onSubmit is used, component will render a tick / cross button to confirm changes.
 * If onChange is used the new value is passed back to the parent component immediately.
 *
 */
const Editable = ({
  text,
  textComponent = 'LabelLarge',
  placeholder = '...',
  editIcon = false,
  onSubmit,
  onChange,
}: EditableProps) => {
  const [css, theme] = useStyletron();
  const [value, setValue] = useState(text);
  const [isEditing, setEditing] = useState(false);

  const onCancel = () => {
    setValue(text);
    setEditing(false);
  };

  // if using submit buttons do not use blur to control
  const onBlur = () => {
    if (onSubmit) return;

    setEditing(false);
  };

  const onConfirmSubmit = () => {
    onSubmit(value);
    setEditing(false);
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key } = event;
    const keys = ['Escape', 'Tab'];
    const enterKey = 'Enter';
    const allKeys = [...keys, enterKey];
    if (key === enterKey && onSubmit) {
      onConfirmSubmit();
    } else if (allKeys.indexOf(key) > -1) {
      setEditing(false);
    }
  };

  return (
    <div
      className={css({ height: theme.typography[textComponent].lineHeight })}
    >
      {isEditing ? (
        <div onBlur={onBlur} onKeyDown={(e) => handleKeyDown(e)}>
          <Input
            value={value}
            autoFocus
            onChange={onChangeInput}
            size={textComponent.includes('Small') ? 'mini' : 'compact'}
            placeholder={placeholder}
            endEnhancer={
              onSubmit && (
                <ButtonGroup onSubmit={onConfirmSubmit} onCancel={onCancel} />
              )
            }
            overrides={{
              Root: {
                style: { paddingBottom: 0 },
              },
              Input: {
                style: { paddingLeft: '8px', paddingRight: 0 },
              },
              EndEnhancer: {
                style: {
                  paddingRight: 0,
                },
              },
            }}
          />
        </div>
      ) : (
        <div
          className={css({ display: 'flex' })}
          onClick={() => setEditing(true)}
        >
          <div
            className={css({
              borderBottomStyle: 'dashed',
              borderBottomWidth: '1px',
              borderBottomColor: theme.colors.primary400,
              marginRight: editIcon ? '8px' : '0',
              ':hover': { borderBottomColor: theme.colors.primary },
            })}
          >
            {React.createElement(
              componentMapper[textComponent],
              {
                marginRight: '4px',
                marginTop: '0',
                marginBottom: '0',
              },
              text || placeholder || 'Editable',
            )}
          </div>
          {editIcon && (
            <Button
              shape='round'
              onClick={() => setEditing(true)}
              kind='tertiary'
              size='mini'
            >
              <Icon.Pencil />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Editable;
