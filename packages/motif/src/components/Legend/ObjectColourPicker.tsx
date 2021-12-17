import { Color, ColorPicker, useColor } from 'react-color-palette';
import React, { FC } from 'react';
import 'react-color-palette/lib/css/styles.css';
import './ObjectColourPicker.css';
import { Block } from 'baseui/block';
import { Button } from '../ui';
import * as Icons from '../Icons';

export type ObjectColourPickerProps = {
  onComplete: (color: Color) => void;
};

const ObjectColourPicker: FC<ObjectColourPickerProps> = ({ onComplete }) => {
  const [color, setColor] = useColor('hex', '#121212');

  return (
    <Block>
      <ColorPicker
        width={260}
        height={200}
        color={color}
        onChange={setColor}
        hideHSV
        hideRGB
        dark
      />

      <Block marginTop='scale300' display='flex' gridGap='scale200'>
        <Button kind='secondary' onClick={() => onComplete(color)} width='100%'>
          Cancel
        </Button>
        <Button kind='primary' onClick={() => onComplete(color)} width='100%'>
          <Icons.CheckCircle size={14} />
          <span style={{ marginLeft: '4px', paddingTop: '2px' }}>Done</span>
        </Button>
      </Block>
    </Block>
  );
};

export default ObjectColourPicker;
