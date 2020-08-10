import { withStyle } from 'baseui';
import { StyledSpinnerNext } from 'baseui/spinner';

const getAlignment = (align: string) => {
  switch (align) {
    case 'left':
      return { marginLeft: '0px', marginRight: 'auto' };
    case 'right':
      return { marginLeft: 'auto', marginRight: '0px' };
    default:
      return { marginLeft: 'auto', marginRight: 'auto' };
  }
};

const Loader = withStyle(StyledSpinnerNext, ({ align }: { align: string }) => {
  return {
    ...getAlignment(align),
  };
});

export default Loader;
