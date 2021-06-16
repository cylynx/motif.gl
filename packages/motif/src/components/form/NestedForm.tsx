import React, { Fragment } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { TYPE } from 'baseui/select';
import { Input } from 'baseui/input';
import { Slider, Dropdown } from '../ui';
import BatchSingleSelect from '../BatchSingleSelect';

export type NestedFormData = {
  id: string;
  label: string;
  labelPosition?: 'left' | 'top';
  value: string;
  options: {
    label: string;
    id: string;
  }[];
  callback: (data: any) => void;
  [optionId: string]: any;
};
type NestedFormProps = { id?: string; data: NestedFormData };

const SelectFieldPopoverOverrides = {
  props: {
    overrides: {
      Body: {
        style: () => ({ zIndex: 1 }),
      },
    },
  },
};

const cleanGetValues = (obj: any, mainKey: string) => {
  const results: any = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (Array.isArray(value) && value[0]?.id) {
      // if multi-select return array [field1, field2]
      // else return string e.g. "field1"
      results[key] =
        value.length === 1 ? value[0].id : value.map((opt) => opt.id);
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

  results.id = results[mainKey];
  delete results[mainKey];

  return { [mainKey]: results };
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
 * @return {JSX.Element}
 */
const NestedForm = ({ data }: NestedFormProps): JSX.Element => {
  const { callback, labelPosition } = data;
  const { watch, control, getValues } = useForm();
  const watchSelection = watch(data.id, [
    data.options.find((x: any) => x.id === data.value),
  ]);

  // Triggers react-hook-form onChange and custom callback
  const handleChange = (value: any, onChange: (v: any) => void) => {
    onChange(value);
    callback(cleanGetValues(getValues(), data.id));
  };

  const handleFinalChange = () => {
    callback(cleanGetValues(getValues(), data.id));
  };

  // For parent component, need to return new child defaults
  const handleChangeParent = (value: any, onChange: (v: any) => void) => {
    if (value.length === 0) {
      return;
    }

    onChange(value);
    const results: any = {};
    results.id = value[0].id;
    // child might not exist
    if (data[value[0].id]) {
      data[value[0].id].forEach((o: any) => {
        results[o.id] = o.value;
      });
    }
    callback({ [data.id]: results });
  };

  return (
    <Fragment>
      <form>
        <Block
          display={labelPosition === 'left' ? 'flex' : 'block'}
          marginBottom={labelPosition === 'left' ? 'scale100' : 0}
          marginTop={labelPosition === 'left' ? 'scale100' : 0}
          alignItems='center'
          justifyContent='space-between'
        >
          <LabelSmall
            marginBottom='scale100'
            marginTop='scale200'
            marginRight='scale200'
            color='contentInverseSecondary'
            width='100px'
          >
            {data.label}
          </LabelSmall>
          <Controller
            name={data.id}
            control={control}
            defaultValue={[data.options.find((x: any) => x.id === data.value)]}
            render={({ field: { value, onChange } }) => (
              <Dropdown
                options={data.options}
                onChange={(params) =>
                  handleChangeParent(params.value, onChange)
                }
                size='compact'
                clearable={false}
                value={value}
                maxDropdownHeight='300px'
                overrides={{
                  Popover: SelectFieldPopoverOverrides,
                }}
              />
            )}
          />
        </Block>
        {data[watchSelection[0].id] &&
          data[watchSelection[0].id].map((d: any) => {
            const { id, label, kind, value, ...rest } = d;
            let parsedValue;
            if (kind === 'slider' && !Array.isArray(value)) {
              parsedValue = [value];
            } else if (kind === 'select') {
              const arrayValue = Array.isArray(value) ? value : [value];
              // find id and filter out undefined values
              parsedValue = arrayValue
                .map((v) => d.options.find((x: any) => x.id === v))
                .filter((x) => x);
            } else {
              // input
              parsedValue = value;
            }

            return (
              <Block
                key={`${data.id}-${d.id}`}
                display={labelPosition === 'left' ? 'flex' : 'block'}
                marginBottom={labelPosition === 'left' ? 'scale200' : 0}
                marginTop={labelPosition === 'left' ? 'scale200' : 0}
                alignItems='center'
                justifyContent='space-between'
              >
                <LabelSmall
                  marginBottom='scale100'
                  marginTop='scale200'
                  marginRight='scale200'
                  color='contentInverseSecondary'
                  width='100px'
                >
                  {label}
                </LabelSmall>
                <Controller
                  name={id}
                  control={control}
                  defaultValue={parsedValue}
                  // eslint-disable-next-line no-shadow
                  render={({ field: { value, onChange } }) => {
                    let component;
                    if (kind === 'select') {
                      component = (
                        <Dropdown
                          onChange={(params) =>
                            handleChange(params.value, onChange)
                          }
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
                    if (kind === 'batchSelect') {
                      component = (
                        <BatchSingleSelect
                          onChange={(params) => {
                            if (params.value.length === 0) {
                              return;
                            }
                            handleChange(params.value, onChange);
                          }}
                          value={value}
                          clearable={false}
                          maxDropdownHeight='300px'
                          type={TYPE.select}
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
              </Block>
            );
          })}
      </form>
    </Fragment>
  );
};

export default NestedForm;
