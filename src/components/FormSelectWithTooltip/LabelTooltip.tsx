import React, { FC, forwardRef, ReactNode } from 'react';
import { IconBaseProps } from 'react-icons';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { colors } from 'baseui/tokens';
import * as Icon from '../Icons';
import { SimpleTooltip } from '../ui';

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

type LabelTooltipProps = { text: ReactNode; tooltip?: ReactNode };
const LabelTooltip: FC<LabelTooltipProps> = ({ text, tooltip }) => {
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
    </>
  );
};

export default LabelTooltip;
