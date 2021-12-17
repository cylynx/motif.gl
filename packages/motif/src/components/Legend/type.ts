import { MouseEventHandler } from 'react';

export type ColorMaps = [string, string];
export type LegendProps = {
  data: Record<string, string>;
  colorMap: string[];
  kind: 'node' | 'edge';
  maxSize?: number;
  label?: string;

  // perform attributes colour changes
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

export type ObjectColourPickerProps = {
  // selected attribute (node/edge) to modify the color when user clicked on the element.
  selectedAttr: ColorMaps;

  // function provided to change the node/edge color
  onChangeColor: (target: ColorMaps) => void;

  // confirm the current colour changes.
  onComplete: (confirmedColor: ColorMaps) => void;

  // revert the default colour when user decided to discard the changes.
  onCancel: (defaultColor: ColorMaps) => void;
};
