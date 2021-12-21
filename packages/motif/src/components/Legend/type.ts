import { MouseEventHandler } from 'react';

export type ColorMaps = [string, string];
export type LegendProps = {
  data: Record<string, string>;
  colorMap: string[];
  kind: 'node' | 'edge';

  // maximum number of graph attribute for display
  maxSize?: number;

  // graph attribute's label text for display
  label?: string;

  // perform graph attributes colour changes
  onChangeColor?: (target: ColorMaps) => void;

  // prevent legend popover to change graph attribute colour
  isAllowChangeColor?: boolean;

  // changing the edge/node variable in style panel shall trigger re-render
  variable?: string;
};
export type GraphAttributeColourProps = {
  onClick: MouseEventHandler<HTMLDivElement>;
  backgroundColor: string;
  disableClick?: boolean;
};

export type ObjectColourProps = GraphAttributeColourProps &
  Pick<LegendProps, 'kind'> & { label: string };

export type ObjectColourPickerProps = {
  // only allow one graph attribute to perform changes in one-time.
  // selected graph attribute (node/edge) to modify the color when user clicked on the element.
  selectedAttr: ColorMaps;

  // function provided to change the selected node/edge color
  onChangeColor: (target: ColorMaps) => void;

  // confirm the graph attribute colour changes.
  onComplete: (confirmedColor: ColorMaps) => void;

  // revert the default colour when user decided to discard the changes.
  onCancel: (defaultColor: ColorMaps) => void;
};
