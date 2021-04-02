import React, { ChangeEvent, FC } from 'react';
import { Block } from 'baseui/block';
import { ParagraphSmall } from 'baseui/typography';
import { Controller, ControllerRenderProps } from 'react-hook-form';
import { Checkbox, LABEL_PLACEMENT, STYLE_TYPE } from 'baseui/checkbox';
import { Theme } from 'baseui/theme';
import * as Icons from '../../../../components/Icons';

type GroupEdgeConfigurationProps = { control: any };
const GroupEdgeConfiguration: FC<GroupEdgeConfigurationProps> = ({
  control,
}) => {
  const groupEdgeToggle = (
    props: ControllerRenderProps<Record<string, any>>,
  ) => {
    const { onChange, value, name } = props;
    const onCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.checked);
    };

    return (
      <Checkbox
        ariaLabel='Group Edges'
        name={name}
        checked={value}
        onChange={onCheckboxChange}
        checkmarkType={STYLE_TYPE.toggle_round}
        labelPlacement={LABEL_PLACEMENT.right}
        overrides={{
          Label: {
            style: ({ $theme }) => ({
              fontSize: $theme.sizing.scale500,
              paddingRight: $theme.sizing.scale0,
            }),
          },
        }}
      >
        Group Edges
      </Checkbox>
    );
  };

  return (
    <Block
      display='flex'
      padding='scale300'
      marginTop='scale300'
      overrides={{
        Block: {
          style: ({ $theme }: { $theme: Theme }) => ({
            border: `1px solid ${$theme.colors.contentPrimary}`,
          }),
        },
      }}
    >
      <Block>
        <Icons.WarningSign color='#FF7A00' size={18} />
      </Block>
      <Block marginLeft='scale300' marginTop='0'>
        <ParagraphSmall marginTop='0' marginBottom='0'>
          We have detected that your graph has multiple edges. You can group
          similar edges to make graph visualization more accessible. You will be
          able to ungroup them later if needed.
        </ParagraphSmall>

        <Block marginTop='scale200' marginBottom='0'>
          <Controller
            control={control}
            name='groupEdge'
            render={groupEdgeToggle}
          />
        </Block>
      </Block>
    </Block>
  );
};

export default GroupEdgeConfiguration;
