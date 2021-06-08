import React, { forwardRef } from 'react';
import { IconBaseProps } from 'react-icons';
import { Block } from 'baseui/block';
import { colors } from 'baseui/tokens';
import { SimpleTooltip } from '../ui';
import * as Icon from '../Icons';

const QuestionMarkIconWithRef = forwardRef((props: IconBaseProps, ref) => {
  return (
    <Block
      as='span'
      marginLeft='scale100'
      overrides={{
        Block: {
          props: { ref },
          style: {
            display: 'inline-block',
            verticalAlign: 'middle',
            ':hover': {
              cursor: 'pointer',
              opacity: 0.9,
            },
          },
        },
      }}
    >
      <Icon.QuestionMarkCircle {...props} />
    </Block>
  );
});

const QuestionMarkTooltip = ({ tooltip }) => (
  <SimpleTooltip
    tooltip={tooltip}
    overrides={{
      Inner: {
        style: {
          backgroundColor: '#0B1A29',
          color: colors.white,
        },
      },
    }}
  >
    <QuestionMarkIconWithRef
      size={16}
      color='#8794A1'
      style={{ paddingTop: '2px' }}
    />
  </SimpleTooltip>
);

export default QuestionMarkTooltip;
