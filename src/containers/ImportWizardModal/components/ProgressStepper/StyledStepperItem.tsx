import { Theme } from 'baseui/theme';
import { styled } from 'baseui';

type StepperItemProps = { $theme?: Theme; $isActive: boolean };
const StyledStepperItem = styled(
  'div',
  ({ $theme, $isActive }: StepperItemProps) => {
    const { scale300 } = $theme.sizing;
    return {
      paddingTop: scale300,
      paddingBottom: scale300,
      paddingLeft: scale300,
      paddingRight: scale300,
      backgroundColor: $isActive ? '#112B42' : '#F6F6F6',
      color: $isActive ? '#FFFFFF' : '#AFAFAF',
      ...$theme.typography.LabelSmall,
      textAlign: 'center',
      flex: 1,
      position: 'relative',
      ':hover': {
        cursor: 'pointer',
      },
      ':after': {
        content: '',
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: 0,
        height: 0,
        borderLeft: `${scale300} solid #112B42`,
        borderTop: `${scale300} solid transparent`,
        borderBottom: `${scale300} solid transparent`,
      },
      ':before': {
        content: '',
        position: 'absolute',
        right: scale300,
        bottom: 0,
        width: 0,
        height: 0,
        borderLeft: `${scale300} solid #F6F6F6`,
        borderTop: `${scale300} solid transparent`,
        borderBottom: `${scale300} solid transparent`,
      },
    };
  },
);

export default StyledStepperItem;
