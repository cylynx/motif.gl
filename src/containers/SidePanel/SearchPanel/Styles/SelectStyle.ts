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

export const MiniRootStyle = () => ({
  width: '75px',
});

export const IconContainerStyle = ({ $theme }: { $theme: Theme }) => ({
  paddingRight: $theme.sizing.scale0,
});

export const MiniDropdownListItemStyle = ({ $theme }: { $theme: Theme }) => ({
  borderTopLeftRadius: $theme.sizing.scale300,
  borderTopRightRadius: $theme.sizing.scale300,
  borderBottomLeftRadius: $theme.sizing.scale300,
  borderBottomRightRadius: $theme.sizing.scale300,
  marginLeft: $theme.sizing.scale100,
  marginRight: $theme.sizing.scale100,
  fontSize: '12px',
  paddingLeft: $theme.sizing.scale300,
  paddingRight: $theme.sizing.scale300,
  paddingTop: $theme.sizing.scale200,
  paddingBottom: $theme.sizing.scale200,
});
