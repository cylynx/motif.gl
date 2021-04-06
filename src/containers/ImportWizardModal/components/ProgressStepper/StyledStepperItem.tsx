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
  $isDisabled: boolean,
  $isStart: boolean,
  $isVisited: boolean,
) => {
  if ($isDisabled) {
    const disabledBackground = '#F6F6F6';
    const disabledColor = '#AFAFAF';
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
          borderLeftColor: '#FFFFFF',
          borderTopColor: disabledBackground,
          borderBottomColor: disabledBackground,
        },
        after: {
          borderLeftColor: disabledBackground,
          borderTopColor: `white`,
          borderBottomColor: `white`,
        },
      },
      before: {
        borderLeftColor: 'white',
        borderTopColor: disabledBackground,
        borderBottomColor: disabledBackground,
      },
      after: {
        borderLeftColor: disabledBackground,
        borderTopColor: 'white',
        borderBottomColor: 'white',
      },
    };
  }

  if ($isVisited) {
    const backgroundColor = '#4A5E6F';
    const fontColor = '#FFFFFF';
    const hoverBackground = '#011B32';
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
          borderLeftColor: $isStart ? backgroundColor : 'white',
          borderTopColor: hoverBackground,
          borderBottomColor: hoverBackground,
        },
        after: {
          borderLeftColor: hoverBackground,
          borderTopColor: fontColor,
          borderBottomColor: fontColor,
        },
      },
      before: {
        borderLeftColor: 'white',
        borderTopColor: backgroundColor,
        borderBottomColor: backgroundColor,
      },
      after: {
        borderLeftColor: backgroundColor,
        borderTopColor: 'white',
        borderBottomColor: 'white',
      },
    };
  }

  const backgroundColor = '#112B42';
  const fontColor = '#FFFFFF';
  const hoverBackground = '#011B32';
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
        borderLeftColor: $isStart ? backgroundColor : 'white',
        borderTopColor: hoverBackground,
        borderBottomColor: hoverBackground,
      },
      after: {
        borderLeftColor: hoverBackground,
        borderTopColor: fontColor,
        borderBottomColor: fontColor,
      },
    },
    before: {
      borderLeftColor: 'white',
      borderTopColor: backgroundColor,
      borderBottomColor: backgroundColor,
    },
    after: {
      borderLeftColor: backgroundColor,
      borderTopColor: 'white',
      borderBottomColor: 'white',
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
      ...$theme.typography.LabelSmall,
      textAlign: 'center',
      position: 'relative',
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
