import { MouseEventHandler } from 'react';

export type LegendProps = {
  data: { [_: string]: string };
  colorMap: string[];
  kind: 'node' | 'edge';
  maxSize?: number;
  label?: string;
};

export type GraphAttributeColourProps = {
  onClick: MouseEventHandler<HTMLDivElement>;
  backgroundColor: string;
};

export type ObjectColourProps = GraphAttributeColourProps &
  Pick<LegendProps, 'kind'> & { value: string };
