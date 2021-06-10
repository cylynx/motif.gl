import React from 'react';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { ButtonGroup, SHAPE, SIZE, MODE } from 'baseui/button-group';
import { getIcon } from '../TagData';

export type ToggleTokensProps = {
  options: {
    label: string;
    id: string;
    type: string;
    selected: boolean;
  }[];
  onClick: (index: number, status: boolean) => void;
  shape?: keyof typeof SHAPE;
};

/**
 * @example
 * Example options: 
 * 
 * const sampleOptions = [
    { label: 'data.id', id: 'data.id', type: 'string', selected: true },
    { label: 'dataStr', id: 'datastr', type: 'boolean', selected: true },
    { label: 'value', id: 'value', type: 'real', selected: true },
    { label: 'start_dt', id: 'start_dt', type: 'timestamp', selected: true },
];
 *
 * @param {ToggleTokensProps} { options, onClick }
 * @return {*} 
 */
const ToggleTokens = ({
  options,
  onClick,
  shape = SHAPE.default,
}: ToggleTokensProps) => {
  return (
    <ButtonGroup
      mode={MODE.checkbox}
      shape={shape}
      size={SIZE.compact}
      selected={
        options
          .map((o, idx) => (o.selected === true ? idx : ''))
          .filter(String) as number[]
      }
      onClick={(_, index) => {
        onClick(index, !options[index].selected);
      }}
      overrides={{
        Root: {
          style: {
            display: 'flex',
            flexWrap: 'wrap',
          },
        },
      }}
    >
      {options.map((o) => (
        <Button
          key={o.id}
          overrides={{
            BaseButton: {
              style: ({ $theme, $isSelected }) => {
                return {
                  backgroundColor: $theme.colors.backgroundTertiary,
                  color: $isSelected
                    ? $theme.colors.primary
                    : $theme.colors.contentInverseSecondary,
                  paddingLeft: $theme.sizing.scale100,
                  paddingBottom: $theme.sizing.scale100,
                  paddingRight: $theme.sizing.scale100,
                  paddingTop: $theme.sizing.scale100,
                  marginLeft: $theme.sizing.scale100,
                  marginBottom: $theme.sizing.scale100,
                  marginRight: $theme.sizing.scale100,
                  marginTop: $theme.sizing.scale100,
                  borderTopStyle: 'solid',
                  borderLeftStyle: 'solid',
                  borderRightStyle: 'solid',
                  borderBottomStyle: 'solid',
                  borderTopWidth: '1px',
                  borderLeftWidth: '1px',
                  borderRightWidth: '1px',
                  borderBottomWidth: '1px',
                  borderTopColor: $theme.colors.inputBorder,
                  borderLeftColor: $theme.colors.inputBorder,
                  borderRightColor: $theme.colors.inputBorder,
                  borderBottomColor: $theme.colors.inputBorder,
                };
              },
            },
          }}
        >
          <Block display='flex' alignItems='center'>
            {o.type && getIcon(o.type)}
            {o.label}
          </Block>
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ToggleTokens;
