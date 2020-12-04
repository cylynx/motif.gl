// @ts-nocheck
import React from 'react';
import has from 'lodash/has';
import { NodeMenu, ImportWizard } from '../types/Prop';

export const getTabsOverride = (
  overrides: Overrides,
  Component: React.ComponentType<ImportWizard>,
): React.ComponentType<any> => {
  if (overrides.Tabs) {
    const tabsObj = overrides.Tabs;
    const tabs = [];
    for (const title in tabsObj) {
      if (has(tabsObj, title)) {
        tabs.push({
          title,
          idx: tabs.length + 1,
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

export const getNodeMenuOverride = (
  overrides: Overrides,
  Component: ({ tooltip }: { tooltip: TooltipProps }) => JSX.Element,
): React.ComponentType<any> => {
  if (overrides.NodeMenu) {
    return overrides.NodeMenu;
  }
  return Component;
};
