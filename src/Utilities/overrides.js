import React from 'react';

export const getTabsOverride = (overrides, Component) => {
  if (overrides.Tabs) { 
    const tabsObj = overrides.Tabs;
    const tabs = [];
    for (const title in tabsObj) {
      tabs.push({
        title: title,
        idx: tabs.length + 1,
        component: tabsObj[title],
      });      
    }
    return React.forwardRef((props, ref) => {
      return <Component ref={ref} tabs={tabs} {...props} />
    });
  } else {
    return importWizard;
  }  
};