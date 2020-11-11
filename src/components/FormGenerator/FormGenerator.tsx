import React, { Fragment, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { FormControl } from 'baseui/form-control';
import { Button } from 'baseui/button';
import { Select } from 'baseui/select';
import { Input } from 'baseui/input';
import { SimpleSlider } from '../ui';

export type FormGeneratorData = {
  id: string;
  label: string;
  value: string;
  options: {
    label: string;
    id: string;
  }[];
  [optionId: string]:
    | {
        id: string;
        label: string;
        type: 'select' | 'input' | 'slider';
        value: any;
        [rest: string]: any;
      }[]
    | string
    | {
        label: string;
        id: string;
      }[];
};

const testData: FormGeneratorData = {
  id: 'name',
  label: 'The Two Gentlemen of Verona',
  value: 'AliceBlue',
  options: [
    { label: 'AliceBlue', id: 'AliceBlue' },
    { label: 'AntiqueWhite', id: 'AntiqueWhite' },
    { label: 'Aqua', id: 'Aqua' },
  ],
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
      value: [30],
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
      value: [30],
      max: 50,
    },
  ],
};
 * @param {{ data: FormGeneratorData }} { data = testData }
 * @return {*} 
 */
const FormGenerator = ({ data = testData }: { data: FormGeneratorData }) => {
  const { watch, control } = useForm();
  const watchSelection = watch(data.id, [
    { label: 'AliceBlue', id: 'AliceBlue' },
  ]);

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
                onChange={(params: any) => onChange(params.value)}
                size='compact'
                clearable={false}
                value={value}
              />
            )}
          />
        </FormControl>
        {(data[watchSelection[0].id] as []).map((d: any) => {
          const { id, label, type, value, ...rest } = d;
          const parsedValue =
            type === 'select'
              ? [d.options.find((x: any) => x.id === value)]
              : value;
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
                        onChange={(params) => onChange(params.value)}
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
                          onChange(e.target.value)
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
                        onChange={({ val }: { val: any }) =>
                          val && onChange(val)
                        }
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
        <Button type='submit'>Submit</Button>
      </form>
    </Fragment>
  );
};

export default FormGenerator;
