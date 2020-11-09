import { ReactNode, RefObject, MouseEvent } from 'react';
import { GraphData, ChartData } from './Graph';

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

// Prop Types for InvestigateChartLegend
export interface GraphLegend {
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
