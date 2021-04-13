import { createDarkTheme } from 'baseui';

const primitives = {
  // Primary Palette
  primaryA: '#E2E2E2',
  primaryB: '#191f2b',
  primary: '#f8fafc',
  primary50: '#f8fafc',
  primary100: '#F0F4F8',
  primary200: '#d7deee',
  primary300: '#b4bacb',
  primary400: '#959bab',
  primary500: '#6c7281',
  primary600: '#595f6d',
  primary700: '#3a404d',
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

const backgroundSecondary = '#272C36';
const backgroundTertiary = primitives.primary700;

// mono200 / gray400 (https://github.com/uber/baseweb/blob/master/src/tokens/colors.js)
const mono200 = '#AFAFAF';

const overrides = {
  colors: {
    // Ref: https://github.com/uber/baseweb/blob/master/src/themes/light-theme/color-semantic-tokens.js
    // Background
    backgroundPrimary: primitives.primaryB,
    backgroundSecondary,
    backgroundTertiary,
    backgroundInversePrimary: primitives.primaryA,
    backgroundInverseSecondary: primitives.primary300,

    // Content
    contentPrimary: primitives.primaryA,
    contentSecondary: primitives.primary300,
    contentTertiary: primitives.primary400,
    contentInversePrimary: primitives.primaryB,
    contentInverseSecondary: primitives.primary600,
    contentInverseTertiary: primitives.primary500,

    // Change all non-disabled text with mono300 (gray500) to mono200 (gray400) to make the contrast higher
    // https://github.com/uber/baseweb/blob/master/src/themes/dark-theme/color-component-tokens.js
    modalCloseColor: mono200,
    tableFilterHeading: mono200,
    toggleFill: mono200,
    tickBorder: mono200,
    sliderHandleFill: mono200,
    sliderHandleFillHover: mono200,
    sliderHandleFillActive: mono200,
    sliderHandleInnerFill: mono200,
    inputPlaceholder: mono200,
    menuFontDefault: mono200,
    tabColor: mono200,

    // Override tooltip
    // tooltipBackground: primitives.mono600,
    tooltipText: primitives.primaryA,

    // Components
    listHeaderFill: backgroundSecondary,
    listBodyFill: backgroundTertiary,
    // inputBorder: primitives.mono400,
    // inputFill: primitives.mono400,
    // menuFill: primitives.mono400,
    // menuFillHover: primitives.mono500,
  },

  typography: {
    HeadingXXLarge: {
      fontSize: '40px',
      lineHeight: '48px',
      fontWeight: '700',
    },
    HeadingXLarge: {
      fontSize: '32px',
      lineHeight: '40px',
      fontWeight: '700',
    },
    HeadingLarge: {
      fontSize: '24px',
      lineHeight: '30px',
      fontWeight: '700',
    },
    HeadingMedium: {
      fontSize: '20px',
      lineHeight: '28px',
      fontWeight: '600',
    },
    HeadingSmall: {
      fontSize: '18px',
      lineHeight: '24px',
      fontWeight: '600',
    },
    HeadingXSmall: {
      fontSize: '18px',
      lineHeight: '24px',
      fontWeight: '600',
    },
    LabelLarge: {
      fontSize: '18px',
      lineHeight: '24px',
      fontWeight: '600',
    },
    LabelMedium: {
      fontSize: '16px',
      lineHeight: '20px',
      fontWeight: '600',
    },
    LabelSmall: {
      fontSize: '14px',
      lineHeight: '16px',
      fontWeight: '600',
    },
    LabelXSmall: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: '600',
    },
    ParagraphLarge: {
      fontSize: '18px',
      lineHeight: '28px',
      fontWeight: '400',
    },
    ParagraphMedium: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '400',
    },
    ParagraphSmall: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: '400',
    },
  },
};

const DarkTheme = createDarkTheme(primitives, overrides);

export default DarkTheme;
