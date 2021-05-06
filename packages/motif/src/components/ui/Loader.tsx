/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { useStyletron, withStyle } from 'baseui';
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

const MotifLoader = () => {
  const [css] = useStyletron();

  return (
    <div
      className={css({
        position: 'absolute',
        top: '70px',
        height: '30px',
        width: '100%',
        zIndex: 1,
      })}
    >
      <Loader />
    </div>
  );
};

export default MotifLoader;
