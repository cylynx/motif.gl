import { ReactNode } from 'react';

export type WidgetItem = WidgetProp & {
  icon: ReactNode;
  widget: ReactNode;
};

export type WidgetProp = {
  id: string;
  group: string;
  position: 'top' | 'bottom';
  active: boolean;
};
