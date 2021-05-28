import { Breakpoints, MediaQuery } from 'baseui/theme';

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

export default ResponsiveTheme;
