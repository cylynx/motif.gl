import { ColorPicker, useColor } from 'react-color-palette';
import React, { FC, useEffect, useMemo } from 'react';
import 'react-color-palette/lib/css/styles.css';
import './ObjectColourPicker.css';
import debounce from 'lodash/debounce';

import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { OnChangeCallback } from 'react-color-palette/lib/interfaces/ColorPicker.interface';
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

  const onCancelClick = () => {
    const defaultColor = [attrKey, defaultHex] as ColorMaps;

    onCancel(defaultColor);
  };

  const onConfirmClick = () => {
    const targetChange = [attrKey, color.hex] as ColorMaps;
    onComplete(targetChange);
  };

  const onChange: OnChangeCallback = (color) => {
    setColor(color);
    onColorChangeDebounce(color);
  };

  /**
   * Execute the function after a cooling period
   */
  const onColorChangeDebounce = useMemo(
    () =>
      debounce((color) => {
        setColor(color);
        const targetChange = [attrKey, color.hex] as ColorMaps;
        onChangeColor(targetChange);
      }, 100),
    [attrKey],
  );

  /**
   * cancel the debounced function when the component unmounts.
   */
  useEffect(() => {
    return () => {
      onColorChangeDebounce.cancel();
    };
  }, []);

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
        onChange={onChange}
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

const ButtonText = ({ children }) => {
  return (
    <span style={{ marginLeft: '4px', paddingTop: '2px' }}>{children}</span>
  );
};

export default ObjectColourPicker;
