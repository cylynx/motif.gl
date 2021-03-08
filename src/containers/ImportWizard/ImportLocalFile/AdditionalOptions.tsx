import React, { FormEvent, useState } from 'react';
import { Hide, Show } from 'baseui/icon';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Input } from 'baseui/input';
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from 'baseui/checkbox';
import useGroupEdges from '../../SidePanel/LayersPanel/hooks/useGroupEdges';

type AdditionalOptionsProps = { register: any };
const AdditionalOptions = ({ register }: AdditionalOptionsProps) => {
  const [showOptions, setshowOptions] = useState(false);
  const { groupEdges, toggle } = useGroupEdges();

  const icon = showOptions ? <Hide /> : <Show />;

  const onCheckboxChange = (_: FormEvent<HTMLInputElement>) => {
    toggle();
  };

  const buttonContents = showOptions
    ? 'Hide options'
    : 'Configure Id, Source, Target mapping';
  return (
    <Block marginTop='12px'>
      <Block display='flex' justifyContent='space-between'>
        <Block>
          <Button
            onClick={() => setshowOptions((value) => !value)}
            startEnhancer={icon}
            kind='minimal'
            size='mini'
            type='button'
          >
            {buttonContents}
          </Button>
        </Block>

        <Block paddingTop='scale100'>
          <Checkbox
            checked={groupEdges}
            onChange={onCheckboxChange}
            checkmarkType={STYLE_TYPE.toggle_round}
            labelPlacement={LABEL_PLACEMENT.left}
            overrides={{
              Label: {
                style: ({ $theme }) => ({
                  fontSize: $theme.sizing.scale500,
                  paddingRight: $theme.sizing.scale0,
                }),
              },
            }}
          >
            Group Edge
          </Checkbox>
        </Block>
      </Block>
      <Block marginTop='12px' display={showOptions ? 'block' : 'none'}>
        <Block display='flex' justifyContent='space-between'>
          <Block width='48%'>
            <FormControl label='Node ID Field'>
              <Input
                name='nodeID'
                size='compact'
                inputRef={register}
                placeholder='id'
              />
            </FormControl>
          </Block>
          <Block width='48%'>
            <FormControl label='Edge ID Field'>
              <Input
                name='edgeID'
                size='compact'
                inputRef={register}
                placeholder='id'
              />
            </FormControl>
          </Block>
        </Block>
        <Block display='flex' justifyContent='space-between'>
          <Block width='48%'>
            <FormControl label='Source Field'>
              <Input
                name='edgeSource'
                size='compact'
                inputRef={register}
                placeholder='source'
                required
              />
            </FormControl>
          </Block>
          <Block width='48%'>
            <FormControl label='Target Field'>
              <Input
                name='edgeTarget'
                size='compact'
                inputRef={register}
                placeholder='target'
                required
              />
            </FormControl>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default AdditionalOptions;
