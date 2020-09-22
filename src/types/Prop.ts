import { ReactNode, RefObject, MouseEvent, FC, ComponentType } from 'react';
import { Accessors, GraphData, ChartData } from './Graph';

// Prop Types for Tab Override
export interface Tab {
  title: string;
  idx: string;
  component: FC<any>;
}

// Prop Types for Investigate Component
export interface Overrides {
  Tabs: Tab[];
  NodeMenu: Tooltip | null;
  score: number[];
}

// Prop Types for ImportWizard
export interface ImportWizard {
  tabs: Tab[];
}

// Prop Types for NodeMenu
export interface Tooltip {
  x: number;
  y: number;
  selected: {
    type: 'node' | 'edge';
    obj: {
      id: string;
    };
  };
}

export interface TooltipComponent {
  info: Tooltip;
}

// Prop Types for Investigate Explorer
export interface InvestigateExplorer {
  name: string;
  currency: string;
  accessors: Accessors;
  overrides: Overrides;
}

// Prop Types for Bottom and Side Layer
export interface Layer {
  children: ReactNode;
}

// Prop Types for Toggle Button
export interface ToggleButton {
  onClick: (event: MouseEvent<HTMLButtonElement>) => any;
  isOpen: boolean;
}

// Prop Types for Wrapper
export interface Wrapper {
  offset?: string;
  color?: string;
  children: ReactNode;
  forwardedRef?: RefObject<any>;
}

// Prop Types for ImportDataButton
export interface ImportDataButton {
  onClick: (event: MouseEvent<HTMLButtonElement>) => any;
}

// Prop Types for EventChart
export interface ItemStyle {
  color?: string;
}

export interface TimeBarData {
  value: any;
  itemStyle: ItemStyle;
}

export interface EventChart {
  min: number;
  max: number;
  data: TimeBarData[];
}

// Prop Types for ToolbarItem
export interface ToolbarItem {
  key: number;
  item: {
    name: string;
    icon: JSX.Element;
    isDisabled: boolean;
    popoverContent: () => JSX.Element;
    onClick: () => void | null;
  };
}

// Prop Types for PopoverOption
export interface Layout {
  label: string;
  id: string;
}

// Prop Types for QueryFile
export interface QueryFile {
  info: string;
  tooltip: string;
}

// Prop Types for InvestigateChart
export interface InvestigateChart {
  Tooltip: ComponentType<TooltipComponent>;
}

// Prop Types for InvestigateGraph
export interface InvestigateGraph {
  setTooltip: (tooltip: Tooltip | boolean) => void;
}

// Prop Types for InvestigateChartLegend
export interface InvestigateChartLegend {
  data: GraphData;
}

// Prop Types for Chart
export interface Chart {
  data: ChartData[];
  title: string;
}

// Prop Types for YAxisChart
export interface YAxisChart extends Chart {
  yLabel: string;
}
