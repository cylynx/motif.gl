import React from 'react';
import { useStyletron } from 'baseui';

import { Block } from 'baseui/block';
import { Grid, GridProps } from 'baseui/layout-grid';

/* 
Adjust margin from paddingLeft and paddingRight introduced in the original element
https://github.com/uber/baseweb/blob/master/src/layout-grid/styled-components.js
Create another div since there is no override for Grid component
Do not customise gridMargins, only the other Grid props
*/

type FlushedGridProps = GridProps & {
  children: React.ReactNode;
};

const FlushedGrid = ({ children, ...rest }: FlushedGridProps) => {
  const [, theme] = useStyletron();
  const { gutters } = theme.grid;
  return (
    <Block
      margin={[
        `0 -${gutters[0] / 2}px`,
        `0 -${gutters[0] / 2}px`,
        `0 -${gutters[1] / 2}px`,
        `0 -${gutters[2] / 2}px`,
      ]}
    >
      <Grid {...rest} gridMargins={[0, 0, 0]} gridMaxWidth={2200}>
        {children}
      </Grid>
    </Block>
  );
};

export default FlushedGrid;
