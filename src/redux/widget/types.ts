import { ReactNode } from 'react';

export type WidgetProp = {
  id: string;
  group: string;
  position: 'top' | 'bottom';
  active: boolean;
};

export interface WidgetState {
  [key: string]: string;
}

export type WidgetItem = WidgetProp & {
  icon: ReactNode;
  widget: ReactNode;
};
