import { ColorPicker, useColor } from 'react-color-palette';
import React, { FC } from 'react';
import 'react-color-palette/lib/css/styles.css';
import './ObjectColourPicker.css';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { Button } from '../ui';
import * as Icons from '../Icons';
import { ColorMaps, ObjectColourPickerProps } from './type';

const ObjectColourPicker: FC<ObjectColourPickerProps> = ({
  selectedAttr,
  onChangeColor,
  onCancel,
  onComplete,
}) => {
  const [attrKey, defaultHex] = selectedAttr;
  const [color, setColor] = useColor('hex', defaultHex);

  const onChangeComplete = () => {
    const targetChange = [attrKey, color.hex] as ColorMaps;
    onChangeColor(targetChange);
  };

  const onCancelClick = () => {
    const defaultColor = [attrKey, defaultHex] as ColorMaps;

    onCancel(defaultColor);
  };

  const onConfirmClick = () => {
    const targetChange = [attrKey, color.hex] as ColorMaps;
    onComplete(targetChange);
  };

  return (
    <Block>
      <LabelSmall
        marginBottom='scale100'
        marginTop='scale300'
        marginRight='scale200'
        color='contentInverseSecondary'
      >
        Change <span style={{ textTransform: 'capitalize' }}>{attrKey}</span>{' '}
        Color
      </LabelSmall>
      <ColorPicker
        width={260}
        height={200}
        color={color}
        onChange={setColor}
        onChangeComplete={onChangeComplete}
        hideHSV
        hideRGB
        dark
      />

      <Block marginTop='scale300' display='flex' gridGap='scale200'>
        <Button kind='secondary' onClick={onCancelClick} width='100%'>
          <Icons.Cross size={10} />
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button kind='primary' onClick={onConfirmClick} width='100%'>
          <Icons.CheckCircle size={14} />
          <ButtonText>Apply</ButtonText>
        </Button>
      </Block>
    </Block>
  );
};

const ButtonText: FC = ({ children }) => {
  return (
    <span style={{ marginLeft: '4px', paddingTop: '2px' }}>{children}</span>
  );
};

export default ObjectColourPicker;
