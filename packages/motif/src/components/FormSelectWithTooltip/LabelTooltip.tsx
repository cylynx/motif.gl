import React, { FC, ReactNode } from 'react';
import { LabelSmall } from 'baseui/typography';
import QuestionMarkTooltip from '../ui/QuestionMarkTooltip';

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

      <QuestionMarkTooltip tooltip={tooltip} />
    </>
  );
};

export default LabelTooltip;
