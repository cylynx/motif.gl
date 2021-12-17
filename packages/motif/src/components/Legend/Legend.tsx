import React, { useState } from 'react';

import { LabelSmall } from 'baseui/typography';
import { Block } from 'baseui/block';
import { LegendProps } from './type';
import ObjectColours from './ObjectColours';
import ObjectColourPicker from './ObjectColourPicker';

const Legend = ({ data, colorMap, kind, maxSize = 8, label }: LegendProps) => {
  const [showPicker, setShowPicker] = useState(false);
  let valueArr = Object.keys(data);
  let colorArr = Object.values(data);
  if (valueArr.length > maxSize) {
    valueArr = valueArr.slice(0, maxSize);
    valueArr.push('Others');
    colorArr = colorArr.slice(0, maxSize);
    colorArr.push(colorMap[maxSize - 1]);
  }

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
        {valueArr.map((value, i) => (
          <ObjectColours
            key={value}
            value={value}
            kind={kind}
            onClick={() => setShowPicker(true)}
            backgroundColor={colorArr[i]}
          />
        ))}
      </Block>

      {showPicker && (
        <>
          <LabelSmall
            marginBottom='scale100'
            marginTop='scale200'
            marginRight='scale200'
            color='contentInverseSecondary'
          >
            Change a <span style={{ textTransform: 'capitalize' }}>{kind}</span>{' '}
            Color
          </LabelSmall>

          <ObjectColourPicker
            onComplete={() => {
              setShowPicker(false);
            }}
          />
        </>
      )}
    </div>
  );
};

export default Legend;
