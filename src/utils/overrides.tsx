// @ts-nocheck
import React from 'react';
import has from 'lodash/has';
import { TooltipProps } from '../containers/Graph';
import { WidgetItem } from '../containers/widgets';
import { ImportWizardProps, Tab } from '../containers/ImportWizard';

export interface Overrides {
  Tabs?: Tab[];
  Tooltip?: React.ComponentType<{ tooltip: TooltipProps }>;
  widgetList?: WidgetItem[];
}

export const getTabsOverride = (
  overrides: Overrides,
  Component: React.ComponentType<ImportWizardProps>,
): React.ComponentType<any> => {
  if (overrides?.Tabs) {
    const tabsObj = overrides.Tabs;
    const tabs = [];
    for (const title in tabsObj) {
      if (has(tabsObj, title)) {
        tabs.push({
          title,
          idx: tabs.length + 2,
          component: tabsObj[title],
        });
      }
    }
    return React.forwardRef<any, any>((props, ref) => (
      <Component ref={ref} tabs={tabs} {...props} />
    ));
  }
  return Component;
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
