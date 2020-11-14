/* eslint-disable no-shadow */
import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { Input } from 'baseui/input';
import { SimpleSlider } from '../ui';

export type SimpleFormData = {
  id: string;
  label: string;
  value: any;
  type: 'input' | 'slider' | 'select';
  callback: (data: any) => void;
  [optionId: string]: any;
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
     type: 'slider',
     min: 5,
     max: 15,
     callback: (data) => console.log(data),
  };
 * @param {{ data: NestedFormData }} { data = testData }
 * @return {*}
 */
const SimpleForm = ({ data }: { data: SimpleFormData }) => {
  const { id, label, value, type, callback, ...rest } = data;
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
    type === 'select'
      ? data.options.find((x: any) => x.id === value)
        ? [data.options.find((x: any) => x.id === value)]
        : []
      : value;
  parsedValue =
    type === 'slider' && !Array.isArray(value) ? [value] : parsedValue;

  return (
    <Fragment>
      <form>
        <FormControl label={label}>
          <Controller
            name={id}
            control={control}
            defaultValue={parsedValue}
            render={({ value, onChange }) => {
              let component;
              if (type === 'select') {
                component = (
                  <Select
                    onChange={(params) => handleChange(params.value, onChange)}
                    value={value}
                    size='compact'
                    clearable={false}
                    {...rest}
                  />
                );
              }
              if (type === 'input') {
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
              if (type === 'slider') {
                component = (
                  <SimpleSlider
                    // eslint-disable-next-line no-shadow
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
        </FormControl>
      </form>
    </Fragment>
  );
};

export default SimpleForm;