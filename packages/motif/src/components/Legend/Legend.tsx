import React from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';

type LegendProps = {
  data: { [_: string]: string };
  colorMap: string[];
  kind: 'node' | 'edge';
  maxSize?: number;
  label?: string;
};

const Legend = ({ data, colorMap, kind, maxSize = 8, label }: LegendProps) => {
  const [css] = useStyletron();
  let valueArr = Object.keys(data);
  let colorArr = Object.values(data);
  if (valueArr.length > maxSize) {
    valueArr = valueArr.slice(0, maxSize);
    valueArr.push('Others');
    colorArr = colorArr.slice(0, maxSize);
    colorArr.push(colorMap[maxSize - 1]);
  }
  return (
    <>
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
        <Block key={value} display='flex' alignItems='center' height='24px'>
          {kind === 'node' && (
            <div
              className={css({
                height: '16px',
                width: '16px',
                marginRight: '6px',
                marginTop: '4px',
                marginBottom: '4px',
                backgroundColor: colorArr[i],
                borderRadius: '50%',
              })}
            />
          )}
          {kind === 'edge' && (
            <div
              className={css({
                height: '8px',
                width: '24px',
                marginRight: '6px',
                marginTop: '4px',
                marginBottom: '4px',
                backgroundColor: colorArr[i],
              })}
            />
          )}
          <LabelSmall>{value}</LabelSmall>
        </Block>
      ))}
    </>
  );
};

export default Legend;
