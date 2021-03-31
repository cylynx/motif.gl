import React, { FC, forwardRef, ReactNode } from 'react';
import { IconBaseProps } from 'react-icons';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import * as Icon from '../../../../components/Icons';
import { SimpleTooltip } from '../../../../components/ui';

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

type LabelTooltipProps = { text: ReactNode };
const LabelTooltip: FC<LabelTooltipProps> = ({ text }) => {
  return (
    <>
      <LabelSmall
        as='span'
        overrides={{
          Block: {
            style: {
              textTransform: 'capitalize',
              display: 'inline-block',
              verticalAlign: 'middle',
            },
          },
        }}
      >
        {text}
      </LabelSmall>

      <SimpleTooltip tooltip='Question Marks'>
        <QuestionMarkIconWithRef
          size={16}
          color='#8794A1'
          style={{ paddingTop: '2px' }}
        />
      </SimpleTooltip>
    </>
  );
};

export default LabelTooltip;
