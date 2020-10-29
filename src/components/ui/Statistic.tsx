import React, { Fragment } from 'react';
import { Block } from 'baseui/block';
import {
  LabelLarge,
  LabelMedium,
  LabelSmall,
  LabelXSmall,
} from 'baseui/typography';

type StatisticProps = {
  value: string | number;
  label?: string | number;
  subtitle?: string | number;
  size?: 'large' | 'medium';
};

const Statistic = ({
  value,
  label = '',
  subtitle = null,
  size = 'large',
}: StatisticProps) => {
  return (
    <Fragment>
      <Block display='flex' flexDirection='column'>
        <Block display='flex' alignItems='baseline'>
          {size === 'large' && (
            <Fragment>
              <LabelLarge marginBottom={0} marginRight='8px'>
                {label}
              </LabelLarge>
              <LabelLarge marginBottom={0}>{value}</LabelLarge>
            </Fragment>
          )}
          {size === 'medium' && (
            <Fragment>
              <LabelMedium marginBottom={0} marginRight='8px'>
                {label}
              </LabelMedium>
              <LabelMedium marginBottom={0}>{value}</LabelMedium>
            </Fragment>
          )}
        </Block>
        {subtitle && size === 'large' && (
          <LabelSmall marginTop='8px' marginBottom={0} color='contentSecondary'>
            {subtitle}
          </LabelSmall>
        )}
        {subtitle && size === 'medium' && (
          <LabelXSmall
            marginTop='8px'
            marginBottom={0}
            color='contentSecondary'
          >
            {subtitle}
          </LabelXSmall>
        )}
      </Block>
    </Fragment>
  );
};

export default Statistic;
