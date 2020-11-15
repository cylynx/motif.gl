import * as React from 'react';
import { Slider as BaseSlider, SliderProps } from 'baseui/slider';

const SimpleSlider = (props: SliderProps) => {
  return (
    <BaseSlider
      {...props}
      overrides={{
        Thumb: {
          style: ({ $theme, $value, $thumbIndex }) => {
            let isLeft = $value.length === 2 && $thumbIndex === 0;
            let isRight = $value.length === 2 && $thumbIndex === 1;

            if ($theme.direction === 'rtl' && (isRight || isLeft)) {
              isLeft = !isLeft;
              isRight = !isRight;
            }
            return {
              height: '12px',
              width: isLeft || isRight ? '6px' : '12px',
              borderTopLeftRadius: isRight ? '1px' : '4px',
              borderTopRightRadius: isLeft ? '1px' : '4px',
              borderBottomLeftRadius: isRight ? '1px' : '4px',
              borderBottomRightRadius: isLeft ? '1px' : '4px',
              backgroundColor: $theme.colors.primary,
              color: $theme.colors.contentPrimary,
              display: 'flex',
              outline: 'none',
              justifyContent: 'center',
              alignItems: 'center',
              borderLeftWidth: '1px',
              borderRightWidth: '1px',
              borderTopWidth: '1px',
              borderBottomWidth: '1px',
              borderLeftStyle: 'solid',
              borderRightStyle: 'solid',
              borderTopStyle: 'solid',
              borderBottomStyle: 'solid',
              borderLeftColor: $theme.colors.mono400,
              borderRightColor: $theme.colors.mono400,
              borderTopColor: $theme.colors.mono400,
              borderBottomColor: $theme.colors.mono400,
            };
          },
        },
        ThumbValue: {
          style: ({ $theme }) => {
            return {
              position: 'absolute',
              backgroundColor: 'transparent',
              top: `-${$theme.sizing.scale700}`,
              ...$theme.typography.font200,
              color: $theme.colors.contentPrimary,
              paddingLeft: 0,
              paddingRight: 0,
              paddingTop: 0,
              paddingBottom: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            };
          },
        },
        InnerTrack: {
          style: () => {
            return {
              height: '2px',
            };
          },
        },
        Track: {
          style: ({ $theme }) => {
            return {
              paddingBottom: $theme.sizing.scale200,
            };
          },
        },
        TickBar: {
          style: () => {
            return {
              paddingBottom: 0,
            };
          },
        },
        InnerThumb: () => null,
      }}
    />
  );
};

export default SimpleSlider;
