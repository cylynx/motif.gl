/* eslint-disable @typescript-eslint/no-shadow */
import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { Select } from 'baseui/select';
import { Input } from 'baseui/input';
import { Slider } from '../ui';

export type SimpleFormData = {
  id: string;
  label: string;
  labelPosition?: 'left' | 'top';
  value: any;
  kind: 'input' | 'slider' | 'select';
  callback: (data: any) => void;
  [optionId: string]: any;
};

const SelectFieldPopoverOverrides = {
  props: {
    overrides: {
      Body: {
        style: () => ({ zIndex: 1 }),
      },
    },
  },
};

const cleanGetValues = (obj: any) => {
  const results = {};
  Object.entries(obj).forEach(([key, value]: any[]) => {
    if (Array.isArray(value) && value[0]?.id) {
      // select
      results[key] = value[0].id;
    } else if (
      Array.isArray(value) &&
      typeof value[0] === 'number' &&
      value.length === 1
    ) {
      // slider [50]
      // eslint-disable-next-line prefer-destructuring
      results[key] = value[0];
    } else if (
      Array.isArray(value) &&
      typeof value[0] === 'number' &&
      value.length === 2
    ) {
      // Slider [25, 75]
      results[key] = value;
    } else {
      // input
      results[key] = value;
    }
  });
  return results;
};

/**
 * Simple form generator component
 * type supported - "select" | "input" | "slider"
 * @example
 * const exampleSlider: SimpleFormData = {
     id: 'name',
     label: 'Test Slider',
     value: 10,
     kind: 'slider',
     min: 5,
     max: 15,
     callback: (data) => console.log(data),
  };
 * @param {{ data: SimpleFormData }} { data = testData }
 * @return {*}
 */
const SimpleForm = ({ data }: { data: SimpleFormData }) => {
  const { id, label, labelPosition, value, kind, callback, ...rest } = data;
  const { control, getValues } = useForm();

  const handleChange = (value: any, onChange: (v: any) => void) => {
    onChange(value);
    callback(cleanGetValues(getValues()));
  };

  const handleFinalChange = () => {
    callback(cleanGetValues(getValues()));
  };

  // Select needs to have an options
  let parsedValue =
    // eslint-disable-next-line no-nested-ternary
    kind === 'select'
      ? data.options.find((x: any) => x.id === value)
        ? [data.options.find((x: any) => x.id === value)]
        : []
      : value;
  parsedValue =
    kind === 'slider' && !Array.isArray(value) ? [value] : parsedValue;

  return (
    <Fragment>
      <Block
        display={labelPosition === 'left' ? 'flex' : 'block'}
        marginBottom={labelPosition === 'left' ? 'scale200' : 0}
        marginTop={labelPosition === 'left' ? 'scale200' : 0}
        alignItems='center'
        justifyContent='space-between'
      >
        <LabelSmall
          marginBottom='scale300'
          marginTop='scale300'
          marginRight='scale200'
          width='100px'
        >
          {label}
        </LabelSmall>
        <Controller
          name={id}
          control={control}
          defaultValue={parsedValue}
          render={({ field: { value, onChange } }) => {
            let component;
            if (kind === 'select') {
              component = (
                <Select
                  onChange={(params) => handleChange(params.value, onChange)}
                  value={value}
                  size='compact'
                  clearable={false}
                  maxDropdownHeight='300px'
                  overrides={{
                    Popover: SelectFieldPopoverOverrides,
                  }}
                  {...rest}
                />
              );
            }
            if (kind === 'input') {
              component = (
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e.target.value, onChange)
                  }
                  value={value}
                  size='compact'
                  {...rest}
                />
              );
            }
            if (kind === 'slider') {
              component = (
                <Slider
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  onChange={({ value }) => value && onChange(value)}
                  onFinalChange={handleFinalChange}
                  value={value}
                  {...rest}
                />
              );
            }
            return component;
          }}
        />
      </Block>
    </Fragment>
  );
};

export default SimpleForm;
