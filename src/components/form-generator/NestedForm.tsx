import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { Input } from 'baseui/input';
import { SimpleSlider } from '../ui';

export type NestedFormData = {
  id: string;
  label: string;
  value: string;
  options: {
    label: string;
    id: string;
  }[];
  callback: (data: any) => void;
  [optionId: string]: any;
};

const cleanGetValues = (obj: any) => {
  const results = {};
  Object.entries(obj).forEach(([key, value]) => {
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

const testData: NestedFormData = {
  id: 'name',
  label: 'The Two Gentlemen of Verona',
  value: 'AliceBlue',
  options: [
    { label: 'AliceBlue', id: 'AliceBlue' },
    { label: 'AntiqueWhite', id: 'AntiqueWhite' },
    { label: 'Aqua', id: 'Aqua' },
  ],
  callback: (data) => console.log(data),
  AliceBlue: [
    {
      id: 'animal',
      label: 'Duke of Milan',
      type: 'select',
      value: 'Dog',
      options: [
        { label: 'Cat', id: 'Cat' },
        { label: 'Dog', id: 'Dog' },
      ],
    },
    {
      id: 'customInput',
      label: 'Hello World',
      type: 'input',
      value: 'Hello',
    },
  ],
  AntiqueWhite: [
    {
      id: 'animal',
      label: 'Duke of Milan',
      type: 'select',
      value: 'Dog',
      options: [
        { label: 'Cat', id: 'Cat' },
        { label: 'Dog', id: 'Dog' },
      ],
    },
    {
      id: 'number',
      label: 'Slippery Snakes',
      type: 'slider',
      value: 30,
      max: 50,
    },
  ],
  Aqua: [
    {
      id: 'animal',
      label: 'Duke of Milan',
      type: 'select',
      value: 'Cat',
      options: [
        { label: 'Cat', id: 'Cat' },
        { label: 'Dog', id: 'Dog' },
      ],
    },
  ],
};

/**
 * An form generator component that renders subsequent child controls depending on the parent selection
 * Additional keys should correspond to the id in the main options array
 * type supported - "select" | "input" | "slider"
 * @example
 * const testData: FormGeneratorData = {
  id: 'name',
  label: 'My name',
  value: 'AliceBlue',
  options: [
    { label: 'AliceBlue', id: 'AliceBlue' },
    { label: 'AntiqueWhite', id: 'AntiqueWhite' },
  ],
  callback: (data) => console.log(data),
  AliceBlue: [
    {
      id: 'customInput',
      label: 'Hello World',
      type: 'input',
      value: 'Hello',
    },
  ],
  AntiqueWhite: [
    {
      id: 'number',
      label: 'Slippery Snakes',
      type: 'slider',
      value: 30,
      max: 50,
    },
  ],
};
 * @param {{ data: NestedFormData }} { data = testData }
 * @return {*} 
 */
const NestedForm = ({ data = testData }: { data: NestedFormData }) => {
  const { callback } = data;
  const { watch, control, getValues } = useForm();
  const watchSelection = watch(data.id, [
    data.options.find((x: any) => x.id === data.value),
  ]);

  // Triggers react-hook-form onChange and custom callback
  const handleChange = (value: any, onChange: (v: any) => void) => {
    onChange(value);
    callback(cleanGetValues(getValues()));
  };

  const handleFinalChange = () => {
    callback(cleanGetValues(getValues()));
  };

  // For parent component, need to return new child defaults
  const handleChangeParent = (value: any, onChange: (v: any) => void) => {
    onChange(value);
    const results = {};
    results[data.id] = value[0].id;
    // child might not exist
    if (data[value[0].id]) {
      data[value[0].id].forEach((o: any) => {
        results[o.id] = o.value;
      });
    }
    callback(results);
  };

  return (
    <Fragment>
      <form>
        <FormControl label={data.label}>
          <Controller
            name={data.id}
            control={control}
            defaultValue={[data.options.find((x: any) => x.id === data.value)]}
            render={({ value, onChange }) => (
              <Select
                options={data.options}
                onChange={(params) =>
                  handleChangeParent(params.value, onChange)
                }
                size='compact'
                clearable={false}
                value={value}
              />
            )}
          />
        </FormControl>
        {data[watchSelection[0].id] &&
          data[watchSelection[0].id].map((d: any) => {
            const { id, label, type, value, ...rest } = d;
            let parsedValue =
              type === 'select'
                ? [d.options.find((x: any) => x.id === value)]
                : value;
            parsedValue =
              type === 'slider' && !Array.isArray(value)
                ? [value]
                : parsedValue;
            return (
              <FormControl
                key={`${data[watchSelection[0].id]}_${id}`}
                label={label}
              >
                <Controller
                  name={id}
                  control={control}
                  defaultValue={parsedValue}
                  // eslint-disable-next-line no-shadow
                  render={({ value, onChange }) => {
                    let component;
                    if (type === 'select') {
                      component = (
                        <Select
                          onChange={(params) =>
                            handleChange(params.value, onChange)
                          }
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
            );
          })}
      </form>
    </Fragment>
  );
};

export default NestedForm;
