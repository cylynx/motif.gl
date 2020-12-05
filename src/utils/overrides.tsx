// @ts-nocheck
import React from 'react';
import { TooltipProps } from '../containers/Graph';
import { WidgetItem } from '../containers/widgets';
import { Tab } from '../containers/ImportWizard';

export interface Overrides {
  Tabs?: Tab[];
  Tooltip?: React.ComponentType<{ tooltip: TooltipProps }>;
  widgetList?: WidgetItem[];
}

export const getTabsOverride = (
  overrides: Overrides,
  defaultTabs: Tab[],
): Tab[] => {
  return overrides?.Tabs || defaultTabs;
};

export const getTooltipOverride = (
  overrides: Overrides,
  defaultTooltip: React.ComponentType<{ tooltip: TooltipProps }>,
): React.ComponentType<{ tooltip: TooltipProps }> => {
  return overrides?.Tooltip || defaultTooltip;
};

export const getWidgetOverride = (
  overrides: Overrides,
  defaultWidgetList: WidgetItem[],
): WidgetItem[] => {
  return overrides?.widgetList || defaultWidgetList;
};
