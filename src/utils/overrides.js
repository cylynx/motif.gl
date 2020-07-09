import React from 'react';
import has from 'lodash/has';

// interface Overrides {
//   Tabs: React.FC[],
//   NodeMenu: React.FC,
//   score: number[]
// }

export const getTabsOverride = (overrides, Component) => {
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
    return React.forwardRef((props, ref) => {
      return <Component ref={ref} tabs={tabs} {...props} />;
    });
  }
  return Component;
};

export const getNodeMenuOverride = (overrides, Component) => {
  if (overrides.NodeMenu) {
    return overrides.NodeMenu;
  }
  return Component;
};
