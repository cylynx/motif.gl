import React from 'react';

import { useStyletron } from 'baseui';
import { Cell } from 'baseui/layout-grid';
import { Paragraph2 } from 'baseui/typography';
import { FlushedGrid } from '@blocklynx/ui';

const StatCards = ({ value, label }) => (
  <>
    <FlushedGrid gridGaps={[2, 6, 12]}>
      {Object.values(value).map((stat, i) => (
        <Cell key={stat} span={4}>
          <StyledStatCard
            value={stat.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            label={label[i]}
            align="center"
          />
        </Cell>
      ))}
    </FlushedGrid>
  </>
);

const StyledStatCard = ({ value, label, align }) => {
  const [css, theme] = useStyletron();
  return (
    <>
      <div
        className={css({
          textAlign: align || 'left',
          backgroundColor: theme.colors.backgroundSecondary,
        })}
      >
        <Paragraph2 paddingTop="5px" paddingBottom="5px" marginBottom={0}>
          {label}
        </Paragraph2>
        <Paragraph2 font="font650" paddingBottom="10px">
          {value}
        </Paragraph2>
      </div>
    </>
  );
};

export default StatCards;
