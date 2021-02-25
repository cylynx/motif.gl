import { Theme } from 'baseui/theme';

export const ControlContainerStyle = ({ $theme }: { $theme: Theme }) => ({
  backgroundColor: $theme.colors.backgroundTertiary,
});

export const DropdownStyle = ({ $theme }: { $theme: Theme }) => ({
  backgroundColor: $theme.colors.backgroundTertiary,
  color: $theme.colors.backgroundPrimary,
});

export const DropdownContainer = ({ $theme }: { $theme: Theme }) => ({
  borderBottomLeftRadius: $theme.sizing.scale500,
  borderBottomRightRadius: $theme.sizing.scale500,
});

export const DropdownListItem = ({ $theme }: { $theme: Theme }) => ({
  marginLeft: $theme.sizing.scale100,
  marginRight: $theme.sizing.scale100,
});

export const IconContainerStyle = ({ $theme }: { $theme: Theme }) => ({
  paddingRight: $theme.sizing.scale0,
});
