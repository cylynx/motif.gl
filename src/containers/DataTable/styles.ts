import { Theme } from 'baseui/theme';

const TabContentStyle = ({ $theme }: { $theme: Theme }) => ({
  paddingTop: $theme.sizing.scale100,
  paddingBottom: $theme.sizing.scale100,
  paddingLeft: 0,
  paddingRight: 0,
});

const TabStyle = ({
  $theme,
  $active,
}: {
  $theme: Theme;
  $active: boolean;
}) => ({
  paddingTop: $theme.sizing.scale100,
  paddingBottom: $theme.sizing.scale100,
  textAlign: 'center',
  borderBottom: `2px solid ${$active ? '#06a2a2' : 'transparent'}`,
});

const TabBarStyle = () => ({
  width: '140px',
});

export { TabContentStyle, TabStyle, TabBarStyle };
