import React, { Fragment } from 'react';
import { Block } from 'baseui/block';
import { LabelLarge, LabelSmall } from 'baseui/typography';

type StatisticProps = {
  value: string | number;
  label?: string | number;
  subtitle?: string | number;
};

const Statistic = ({ value, label = '', subtitle = null }: StatisticProps) => {
  return (
    <Fragment>
      <Block display='flex' flexDirection='column'>
        <Block display='flex' alignItems='baseline'>
          <LabelLarge marginBottom={0} marginRight='8px'>
            {label}
          </LabelLarge>
          <LabelLarge marginBottom={0}>{value}</LabelLarge>
        </Block>
        {subtitle && (
          <LabelSmall marginTop='8px' marginBottom={0} color='contentSecondary'>
            {subtitle}
          </LabelSmall>
        )}
      </Block>
    </Fragment>
  );
};

export default Statistic;
