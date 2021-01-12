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
  if (overrides?.Tabs) {
    const allTabs: Tab[] = [];
    overrides.Tabs.forEach((overrideTab) => {
      // if overrideTab only contains key without intention to override title / component...
      const defaultTab = defaultTabs.filter(
        (t) =>
          t.key === overrideTab.key &&
          !overrideTab.component &&
          !overrideTab.title,
      );
      if (defaultTab.length) {
        allTabs.push(defaultTab[0]);
      } else {
        allTabs.push(overrideTab);
      }
    });
    return allTabs;
  }
  return defaultTabs;
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
