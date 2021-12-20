import React, { useMemo, useRef, useState } from 'react';

import { LabelSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { LegendProps } from './type';
import ObjectColours from './ObjectColours';
import ObjectColourPicker from './ObjectColourPicker';

const Legend = ({
  data,
  colorMap,
  kind,
  maxSize = 8,
  label,
  onChangeColor,
  isAllowChangeColor = true,
}: LegendProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const selectedAttrRef = useRef<[string, string]>([undefined, undefined]);

  const collections = useMemo(() => {
    const colorMaps = Object.entries(data);

    if (colorMaps.length > maxSize) {
      const sliceMaps = colorMaps.slice(0, maxSize);
      const lastColorHex = colorMap[maxSize - 1];

      sliceMaps[maxSize] = ['Others', data.Others ?? lastColorHex];
      return sliceMaps;
    }

    return colorMaps;
  }, [data, colorMap, maxSize, onChangeColor]);

  const openColourPicker = (attrLabel: string, colorHex: string) => {
    const selectedAttr = [attrLabel, colorHex] as [string, string];
    selectedAttrRef.current = selectedAttr;
    setShowPicker(true);
  };

  const closeColourPicker = () => {
    selectedAttrRef.current = [undefined, undefined];
    setShowPicker(false);
  };

  return (
    <div>
      <Block display={showPicker ? 'none' : 'block'}>
        {label && (
          <LabelSmall
            marginBottom='scale100'
            marginTop='scale200'
            marginRight='scale200'
            color='contentInverseSecondary'
          >
            {label}
          </LabelSmall>
        )}
        {collections.map((data) => {
          const [attrKey, colorHex] = data;

          return (
            <ObjectColours
              key={attrKey}
              label={attrKey}
              kind={kind}
              onClick={() => openColourPicker(attrKey, colorHex)}
              backgroundColor={colorHex}
              disableClick={!isAllowChangeColor}
            />
          );
        })}
      </Block>

      {showPicker && (
        <ObjectColourPicker
          selectedAttr={selectedAttrRef.current}
          onCancel={(defaultColor) => {
            onChangeColor(defaultColor);
            closeColourPicker();
          }}
          onChangeColor={onChangeColor}
          onComplete={() => {
            closeColourPicker();
          }}
        />
      )}
    </div>
  );
};

export default Legend;
