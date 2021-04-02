import { styled } from 'baseui';
import { Theme } from 'baseui/theme';

type StepperItemProps = {
  $theme?: Theme;
  $isActive: boolean;
  $isDisabled: boolean;
  $isStart?: boolean;
  $isEnd?: boolean;
};

const StyledStepperItem = styled(
  'div',
  ({
    $theme,
    $isActive,
    $isDisabled,
    $isStart = false,
    $isEnd = false,
  }: StepperItemProps) => {
    const { scale300, scale600 } = $theme.sizing;

    return {
      paddingTop: scale300,
      paddingBottom: scale300,
      paddingLeft: scale300,
      paddingRight: scale300,
      backgroundColor: $isActive ? '#112B42' : '#F6F6F6',
      color: $isActive ? '#FFFFFF' : '#AFAFAF',
      ...$theme.typography.LabelSmall,
      textAlign: 'center',
      position: 'relative',
      flex: '1',
      ':hover': {
        cursor: $isDisabled ? 'not-allowed' : 'pointer',
        backgroundColor: $isDisabled ? '#F6F6F6' : 'black',
        ':after': {
          borderLeft: `${scale600} solid black`,
          borderTop: `${scale600} solid white`,
          borderBottom: `${scale600} solid white`,
        },
        ':before': {
          borderLeft: `${scale600} solid ${$isDisabled ? 'white' : '#112B42'}`,
          borderTop: `${scale600} solid ${$isDisabled ? '#F6F6F6' : 'black'}`,
          borderBottom: `${scale600} solid ${
            $isDisabled ? '#F6F6F6' : 'black'
          }`,
        },
      },
      ':after': {
        content: $isEnd ? '' : '""',
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        borderLeft: `${scale600} solid ${$isDisabled ? '#F6F6F6' : '#112B42'}`,
        borderTop: `${scale600} solid white`,
        borderBottom: `${scale600} solid white`,
      },
      ':before': {
        content: $isStart ? '' : '""',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        borderLeft: `${scale600} solid #FFFFFF`,
        borderTop: `${scale600} solid ${$isActive ? '#112B42' : '#F6F6F6'}`,
        borderBottom: `${scale600} solid ${$isActive ? '#112B42' : '#F6F6F6'}`,
      },
    };
  },
);

export default StyledStepperItem;
