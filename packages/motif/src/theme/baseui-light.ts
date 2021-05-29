import { createTheme } from 'baseui';
import { Theme } from 'baseui/theme';
import typography from './shared/typography';
import borders from './shared/borders';
import themeColors from './shared/themeColors';
import responsiveTheme from './shared/responsive';

const primitives = {
  // Primary Palette
  primaryA: '#24242A',
  primaryB: '#FFFFFF',
  primary: '#24242A',
  primary50: '#fafaff',
  primary100: '#f5f5fd',
  primary200: '#f0f0f8',
  primary300: '#e3e3eb',
  primary400: '#c1c1c9',
  primary500: '#a2a2aa',
  primary600: '#4b4b52',
  primary700: '#32323A',
  primaryFontFamily: 'Poppins',
};

const backgroundSecondary = '#f0f0f4';
const backgroundTertiary = primitives.primary300;
const textSecondary = '#8C8C97';
const borderColor = 'rgba(140, 140, 151, 0.2)';

const overrides = {
  colors: {
    // Ref: https://github.com/uber/baseweb/blob/master/src/themes/light-theme/color-semantic-tokens.js
    // Background
    backgroundPrimary: primitives.primaryB,
    backgroundSecondary,
    backgroundTertiary,
    backgroundInversePrimary: primitives.primaryA,
    backgroundInverseSecondary: primitives.primary600,

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
    contentSecondary: primitives.primary600,
    contentTertiary: primitives.primary400,
    contentInversePrimary: primitives.primaryB,
    contentInverseSecondary: primitives.primary200,
    contentInverseTertiary: backgroundTertiary,

    // https://github.com/uber/baseweb/blob/master/src/themes/dark-theme/color-component-tokens.js
    modalCloseColor: primitives.primary600,
    tableFilterHeading: primitives.primary600,
    tickBorder: textSecondary,
    inputPlaceholder: primitives.primary600,
    menuFontDefault: primitives.primary600,
    // Override tooltip
    tooltipBackground: backgroundTertiary,
    tooltipText: primitives.primaryA,

    // Components
    buttonPrimaryFill: themeColors.theme300,
    buttonPrimaryHover: themeColors.theme200,
    buttonPrimaryActive: themeColors.theme,
    buttonPrimarySelectedFill: themeColors.theme,
    buttonPrimaryText: primitives.primaryA,
    buttonPrimarySelectedText: primitives.primaryA,
    buttonSecondaryFill: backgroundSecondary,
    buttonSecondaryActive: backgroundTertiary,
    buttonSecondarySelectedFill: backgroundTertiary,
    listHeaderFill: backgroundSecondary,
    listBodyFill: backgroundTertiary,
    inputBorder: borderColor,
    inputFill: primitives.primary50,
    inputFillActive: primitives.primary50,
    menuFill: primitives.primary50,
    menuFillHover: backgroundTertiary,
    tagPrimarySolidBackground: themeColors.theme300,
    tagPrimarySolidFont: primitives.primaryA,
    tagPrimaryOutlinedBackground: themeColors.theme300,
    toggleFill: themeColors.theme300,
    toggleFillChecked: themeColors.theme500,
    tickFillSelected: themeColors.theme300,
    tickFillSelectedHover: themeColors.theme200,
    tickFillSelectedHoverActive: themeColors.theme500,
    fileUploaderBackgroundColor: primitives.primary50,
    fileUploaderBorderColorActive: borderColor,
    borderFocus: themeColors.theme,
  },
  typography,
  borders,
};

const LightTheme = createTheme(primitives, overrides);
const MotifLightTheme: Theme = { ...LightTheme, ...responsiveTheme };

export default MotifLightTheme;
