import React, { forwardRef } from 'react';
import { IconBaseProps } from 'react-icons';
import { Block } from 'baseui/block';
import { useStyletron } from 'baseui';
import { SimpleTooltip } from '.';
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

const QuestionMarkTooltip = ({ tooltip }) => {
  const [, theme] = useStyletron();
  return (
    <SimpleTooltip tooltip={tooltip}>
      <QuestionMarkIconWithRef
        size={16}
        color={theme.colors.contentInverseSecondary}
      />
    </SimpleTooltip>
  );
};

export default QuestionMarkTooltip;
