import { desaturate, lighten, transparentize } from 'polished';

export interface NormalizedColor {
  dark: string;
  normal: string;
  reflect: string;
}

export const normalizeColor = (
  rgb: string | [number, number, number] | NormalizedColor,
): NormalizedColor => {
  if (Array.isArray(rgb)) {
    const color = `rgba(${rgb.join(',')}, 1)`;
    return {
      dark: desaturate(0.1, lighten(0.1, color)),
      normal: color,
      reflect: transparentize(0.9, color),
    };
  }
  if (typeof rgb === 'string') {
    return {
      dark: desaturate(0.1, lighten(0.1, rgb)),
      normal: rgb,
      reflect: transparentize(0.9, rgb),
    };
  }
  return rgb as NormalizedColor;
};
