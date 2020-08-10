import React, { Fragment } from 'react';
import { useStyletron } from 'baseui';
import { LabelLarge, ParagraphSmall } from 'baseui/typography';

type StatisticProps = {
  value: string | number;
  label?: string | number;
  align?: 'left' | 'right' | 'center';
};

const Statistic = ({ value, label, align = 'left' }: StatisticProps) => {
  const [css] = useStyletron();
  return (
    <Fragment>
      <div
        className={css({
          textAlign: align,
        })}
      >
        <LabelLarge marginBottom={0} color='white'>
          {value}
        </LabelLarge>
        <ParagraphSmall color='white' marginBottom='0px'>
          {label}
        </ParagraphSmall>
      </div>
    </Fragment>
  );
};

export default Statistic;
