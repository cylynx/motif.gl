import { MouseEventHandler } from 'react';

export type ColorMaps = [string, string];
export type LegendProps = {
  data: { [_: string]: string };
  colorMap: string[];
  kind: 'node' | 'edge';
  maxSize?: number;
  label?: string;
  onChangeColor?: (target: ColorMaps) => void;
  isAllowChangeColor?: boolean;
};

export type GraphAttributeColourProps = {
  onClick: MouseEventHandler<HTMLDivElement>;
  backgroundColor: string;
  disableClick?: boolean;
};

export type ObjectColourProps = GraphAttributeColourProps &
  Pick<LegendProps, 'kind'> & { label: string };
