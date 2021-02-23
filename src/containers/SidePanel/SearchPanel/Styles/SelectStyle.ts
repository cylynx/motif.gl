import { Theme } from 'baseui/theme';

export const ControlContainerStyle = ({
  $theme,
  $isOpen,
}: {
  $theme: Theme;
  $isOpen: boolean;
}) => ({
  borderBottomLeftRadius: $isOpen ? 0 : $theme.sizing.scale500,
  borderBottomRightRadius: $isOpen ? 0 : $theme.sizing.scale500,
  borderTopLeftRadius: $theme.sizing.scale500,
  borderTopRightRadius: $theme.sizing.scale500,
  backgroundColor: $theme.colors.backgroundTertiary,
});

export const DropdownStyle = ({ $theme }: { $theme: Theme }) => ({
  backgroundColor: $theme.colors.backgroundTertiary,
  color: $theme.colors.backgroundPrimary,
  borderBottomLeftRadius: $theme.sizing.scale500,
  borderBottomRightRadius: $theme.sizing.scale500,
});

export const DropdownContainer = ({ $theme }: { $theme: Theme }) => ({
  borderBottomLeftRadius: $theme.sizing.scale500,
  borderBottomRightRadius: $theme.sizing.scale500,
});

export const DropdownListItem = ({ $theme }: { $theme: Theme }) => ({
  borderTopLeftRadius: $theme.sizing.scale500,
  borderTopRightRadius: $theme.sizing.scale500,
  borderBottomLeftRadius: $theme.sizing.scale500,
  borderBottomRightRadius: $theme.sizing.scale500,
  marginLeft: $theme.sizing.scale100,
  marginRight: $theme.sizing.scale100,
});

export const IconContainerStyle = ({ $theme }: { $theme: Theme }) => ({
  paddingRight: $theme.sizing.scale0,
});
