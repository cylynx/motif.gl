import React, { ReactNode } from 'react';

import { TooltipProps } from '../containers/Tooltip';
import { WidgetItem } from '../redux/widget';
import { ImportTabs } from '../containers/ImportWizardModal';

export interface Overrides {
  Tabs?: ImportTabs[];
  Tooltip?: React.ComponentType<{ tooltip: TooltipProps }>;
  widgetList?: WidgetItem[];
  SidePanelHeader?: ReactNode;
}

export const getTabsOverride = (
  overrides: Overrides,
  defaultTabs: ImportTabs[],
): ImportTabs[] => {
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

export const getSidePanelHeaderOverride = (
  overrides: Overrides,
): ReactNode | undefined => {
  return overrides?.SidePanelHeader;
};
