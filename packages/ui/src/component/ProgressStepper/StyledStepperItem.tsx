import { styled } from 'baseui';
import { Theme } from 'baseui/theme';

type StepperItemProps = {
  $theme?: Theme;
  $isDisabled: boolean;
  $isStart?: boolean;
  $isEnd?: boolean;
  $isVisited?: boolean;
};

const themeByState = (
  $theme: Theme,
  $isDisabled: boolean,
  $isStart: boolean,
  $isVisited: boolean,
) => {
  const { backgroundPrimary } = $theme.colors;
  if ($isDisabled) {
    const disabledBackground = $theme.colors.buttonDisabledFill;
    const disabledColor = $theme.colors.contentStateDisabled;
    return {
      normal: {
        backgroundColor: disabledBackground,
        color: disabledColor,
      },
      hover: {
        cursor: 'not-allowed',
        backgroundColor: disabledBackground,
        color: disabledColor,
        textDecoration: 'none',
        before: {
          borderLeftColor: backgroundPrimary,
          borderTopColor: disabledBackground,
          borderBottomColor: disabledBackground,
        },
        after: {
          borderLeftColor: disabledBackground,
          borderTopColor: backgroundPrimary,
          borderBottomColor: backgroundPrimary,
        },
      },
      before: {
        borderLeftColor: backgroundPrimary,
        borderTopColor: disabledBackground,
        borderBottomColor: disabledBackground,
      },
      after: {
        borderLeftColor: disabledBackground,
        borderTopColor: backgroundPrimary,
        borderBottomColor: backgroundPrimary,
      },
    };
  }

  if ($isVisited) {
    const backgroundColor = $theme.colors.buttonPrimarySelectedFill;
    const fontColor = $theme.colors.contentPrimary;
    const hoverBackground = $theme.colors.buttonPrimaryHover;
    return {
      normal: {
        backgroundColor,
        color: fontColor,
      },
      hover: {
        cursor: 'pointer',
        backgroundColor: hoverBackground,
        color: fontColor,
        textDecoration: 'underline',
        before: {
          borderLeftColor: $isStart ? backgroundColor : backgroundPrimary,
          borderTopColor: hoverBackground,
          borderBottomColor: hoverBackground,
        },
        after: {
          borderLeftColor: hoverBackground,
          borderTopColor: backgroundPrimary,
          borderBottomColor: backgroundPrimary,
        },
      },
      before: {
        borderLeftColor: backgroundPrimary,
        borderTopColor: backgroundColor,
        borderBottomColor: backgroundColor,
      },
      after: {
        borderLeftColor: backgroundColor,
        borderTopColor: backgroundPrimary,
        borderBottomColor: backgroundPrimary,
      },
    };
  }

  const backgroundColor = $theme.colors.buttonPrimaryFill;
  const fontColor = $theme.colors.contentPrimary;
  const hoverBackground = $theme.colors.buttonPrimaryHover;

  return {
    normal: {
      backgroundColor,
      color: fontColor,
    },
    hover: {
      cursor: 'pointer',
      backgroundColor: hoverBackground,
      color: fontColor,
      textDecoration: 'underline',
      before: {
        borderLeftColor: $isStart ? backgroundColor : backgroundPrimary,
        borderTopColor: hoverBackground,
        borderBottomColor: hoverBackground,
      },
      after: {
        borderLeftColor: hoverBackground,
        borderTopColor: backgroundPrimary,
        borderBottomColor: backgroundPrimary,
      },
    },
    before: {
      borderLeftColor: backgroundPrimary,
      borderTopColor: backgroundColor,
      borderBottomColor: backgroundColor,
    },
    after: {
      borderLeftColor: backgroundColor,
      borderTopColor: backgroundPrimary,
      borderBottomColor: backgroundPrimary,
    },
  };
};

const StyledStepperItem = styled(
  'div',
  ({
    $theme,
    $isDisabled,
    $isStart = false,
    $isEnd = false,
    $isVisited = false,
  }: StepperItemProps) => {
    const { scale300, scale600 } = $theme.sizing;

    const { normal, hover, before, after } = themeByState(
      $theme,
      $isDisabled,
      $isStart,
      $isVisited,
    );

    return {
      paddingTop: scale300,
      paddingBottom: scale300,
      paddingLeft: scale300,
      paddingRight: scale300,
      backgroundColor: normal.backgroundColor,
      color: normal.color,
      ...$theme.typography.LabelMedium,
      textAlign: 'center',
      position: 'relative',
      borderRadius: '6px',
      flex: '1',
      ':hover': {
        cursor: hover.cursor,
        backgroundColor: hover.backgroundColor,
        textDecoration: hover.textDecoration,
        ':after': {
          borderLeft: `${scale600} solid ${hover.after.borderLeftColor}`,
          borderTop: `${scale600} solid ${hover.after.borderTopColor}`,
          borderBottom: `${scale600} solid ${hover.after.borderBottomColor}`,
        },
        ':before': {
          borderLeft: `${scale600} solid ${hover.before.borderLeftColor}`,
          borderTop: `${scale600} solid ${hover.before.borderTopColor}`,
          borderBottom: `${scale600} solid ${hover.before.borderBottomColor}`,
        },
      },
      ':after': {
        content: $isEnd ? '' : '""',
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        borderLeft: `${scale600} solid ${after.borderLeftColor}`,
        borderTop: `${scale600} solid ${after.borderTopColor}`,
        borderBottom: `${scale600} solid ${after.borderBottomColor}`,
      },
      ':before': {
        content: $isStart ? '' : '""',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        borderLeft: `${scale600} solid ${before.borderLeftColor}`,
        borderTop: `${scale600} solid ${before.borderTopColor}`,
        borderBottom: `${scale600} solid ${before.borderBottomColor}`,
      },
    };
  },
);

export default StyledStepperItem;
