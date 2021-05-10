import { createDarkTheme } from 'baseui';
import typography from './shared/typography'
import borders from './shared/borders'
import themeColors from './shared/themeColors'

const primitives = {
  // Primary Palette
  primaryA: '#FFFFFF',
  primaryB: '#24242A',
  primary: '#f8fafc',
  primary50: '#fafaff',
  primary100: '#f5f5fd',
  primary200: '#f0f0f8',
  primary300: '#e3e3eb',
  primary400: '#c1c1c9',
  primary500: '#a2a2aa',
  primary600: '#4b4b52',
  primary700: '#32323A',
  // Give a tint to the dark mono colors
  // mono300: '#4c5667',
  // mono400: '#3d4552',
  // mono500: '#2e3238',
  // mono600: '#292d32',
  // mono700: '#22262a',
  // mono800: '#3f3f40',
  // mono900: '#1e1e1f',
  // mono1000: "black", #default
};

const backgroundSecondary = '#292930';
const backgroundTertiary = primitives.primary700;
const textSecondary = '#8C8C97';
const borderColor = "rgba(140, 140, 151, 0.16)"
const hoverColor = "rgba(255, 255, 255, 0.08)"

const overrides = {
  colors: {
    // Ref: https://github.com/uber/baseweb/blob/master/src/themes/light-theme/color-semantic-tokens.js
    // Background
    backgroundPrimary: primitives.primaryB,
    backgroundSecondary,
    backgroundTertiary,
    backgroundInversePrimary: primitives.primaryA,
    backgroundInverseSecondary: primitives.primary300,

    // Replace accent palette with theme colors
    accent: themeColors.theme,
    accent50: themeColors.theme50,
    accent100: themeColors.theme100,
    accent200: themeColors.theme200,
    accent300: themeColors.theme300,
    accent400: themeColors.theme400,
    accent500: themeColors.theme500,
    accent600: themeColors.theme600,
    accent700: themeColors.theme700,

    // Map other accent colors to theme accent instead of default blue
    // https://github.com/uber/baseweb/blob/master/src/themes/dark-theme/color-semantic-tokens.js
    backgroundLightAccent: themeColors.theme700,
    contentAccent: themeColors.theme300,
    borderAccent: themeColors.theme400,
    borderAccentLight: themeColors.theme500,

    // Content
    contentPrimary: primitives.primaryA,
    contentSecondary: primitives.primary300,
    contentTertiary: primitives.primary400,
    contentInversePrimary: primitives.primaryB,
    contentInverseSecondary: primitives.primary600,
    contentInverseTertiary: primitives.primary500,

    // Change all non-disabled text with mono300 (gray500) to make the contrast higher
    // https://github.com/uber/baseweb/blob/master/src/themes/dark-theme/color-component-tokens.js
    modalCloseColor: primitives.primary300,
    tableFilterHeading: primitives.primary300,
    tickBorder: textSecondary,  
    inputPlaceholder: primitives.primary300,
    menuFontDefault: primitives.primary300,
    // Override tooltip
    // tooltipBackground: primitives.mono600,
    tooltipText: primitives.primaryA,
    

    // Components
    buttonPrimaryFill: themeColors.theme,
    buttonPrimaryHover: themeColors.theme300,
    buttonPrimaryActive: "rgba(72, 143, 128, 0.64)",
    buttonPrimarySelectedFill: "rgba(72, 143, 128, 0.64)",
    buttonPrimaryText: primitives.primaryA,
    buttonPrimarySelectedText: primitives.primaryA,
    buttonSecondaryFill: primitives.primary700,
    buttonSecondaryHover: primitives.primary600,
    buttonSecondaryActive: backgroundSecondary,
    buttonSecondarySelectedFill: backgroundSecondary,
    listHeaderFill: backgroundSecondary,
    listBodyFill: backgroundTertiary,
    inputBorder: borderColor,
    inputFill: primitives.primary700,
    inputFillActive: primitives.primary700,
    menuFill: primitives.primary700,
    menuFillHover: hoverColor,
    // Seems strange...
    // menuFontSelected: themeColors.theme,
    // menuFontHighlighted: themeColors.theme,
    tagPrimarySolidBackground: themeColors.theme,
    tagPrimarySolidFont: primitives.primaryA,
    tagPrimaryOutlinedBackground: themeColors.theme,
    toggleFill: themeColors.theme,
    toggleFillChecked: themeColors.theme300,
    tickFillSelected: themeColors.theme,
    tickFillSelectedHover: themeColors.theme300,
    tickFillSelectedHoverActive: themeColors.theme300,
    fileUploaderBackgroundColor: primitives.primary700,
    fileUploaderBorderColorActive: borderColor,
    borderFocus: themeColors.theme,
  },
  typography,
  borders
};

const MotifDarkTheme = createDarkTheme(primitives, overrides);

export default MotifDarkTheme;
