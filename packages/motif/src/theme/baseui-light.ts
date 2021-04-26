import { createTheme } from 'baseui';
import { Breakpoints, MediaQuery, Theme } from 'baseui/theme';

const primitives = {
  // Primary Palette
  primaryA: '#102A43',
  primaryB: '#FFFFFF',
  primary: '#102A43',
  primary50: '#F0F4F8',
  primary100: '#D9E2EC',
  primary200: '#BCCCDC',
  primary300: '#9FB3C8',
  primary400: '#829AB1',
  primary500: '#627D98',
  primary600: '#486581',
  primary700: '#243B53',
};

const overrides = {
  colors: {
    // Ref: https://github.com/uber/baseweb/blob/master/src/themes/light-theme/color-semantic-tokens.js
    // Background
    backgroundPrimary: primitives.primaryB,
    backgroundSecondary: primitives.primary50,
    backgroundInversePrimary: primitives.primaryA,
    backgroundInverseSecondary: primitives.primary700,

    // Content
    contentPrimary: primitives.primaryA,
    contentSecondary: primitives.primary600,
    contentTertiary: primitives.primary400,
    contentInversePrimary: primitives.primaryB,
    contentInverseSecondary: primitives.primary200,
    contentInverseTertiary: primitives.primary300,

    // Make primary button a little darker
    buttonPrimaryFill: '#0a1a29',
    buttonPrimaryHover: primitives.primary,
    buttonPrimaryActive: primitives.primary700,

    // Change style of secondary button to be slightly lighter
    buttonSecondaryFill: primitives.primary50,
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

// https://github.com/uber/baseweb/blob/4efe7fabbb06c5301f7faabbe56d833d9bc51a91/documentation-site/pages/_app.js
const breakpoints: Breakpoints = {
  small: 670,
  medium: 920,
  large: 1280,
};

const mediaQuery: MediaQuery = {
  small: '@media screen and (min-width: 670px)',
  medium: '@media screen and (min-width: 920px)',
  large: '@media screen and (min-width: 1280px)',
};

const ResponsiveTheme = {
  breakpoints,
  mediaQuery,
};

const LightTheme = createTheme(primitives, overrides);
const MotifLightTheme: Theme = { ...LightTheme, ...ResponsiveTheme };

export default MotifLightTheme;
