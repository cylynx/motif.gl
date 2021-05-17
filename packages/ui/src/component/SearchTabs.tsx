import React from 'react';
import { Tab, StatefulTabs, FILL } from 'baseui/tabs-motion';
import { Theme } from 'baseui/theme';

const TabHighlight = ({ $theme }: { $theme: Theme }) => ({
  backgroundColor: $theme.colors.accent500,
  height: '3px',
  borderRadius: '6px',
});

const TabBorder = ({ $theme }: { $theme: Theme }) => ({
  backgroundColor: $theme.colors.backgroundTertiary,
  borderRadius: '6px',
});

const TabList = ({ $theme }: { $theme: Theme }) => ({
  backgroundColor: $theme.colors.backgroundSecondary,
});

const SearchTabs = () => {
  return (
    <StatefulTabs
      fill={FILL.fixed}
      overrides={{
        TabHighlight: {
          style: TabHighlight,
        },
        TabList: {
          style: TabList,
        },
        TabBorder: {
          style: TabBorder,
        },
      }}
    >
      <Tab title='First'>I must not fear.</Tab>
      <Tab title='Second'>Fear is the mind-killer.</Tab>
      <Tab title='Third'>
        Fear is the little-death that brings total obliteration.
      </Tab>
    </StatefulTabs>
  );
};

export default SearchTabs;
