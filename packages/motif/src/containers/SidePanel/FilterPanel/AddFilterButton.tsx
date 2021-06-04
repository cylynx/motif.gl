import React, { FC, useMemo } from 'react';
import { SIZE } from 'baseui/button';
import * as Icon from '../../../components/Icons';
import { Button } from '../../../components/ui';

type AddFilterButtonType = {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
  disabled?: boolean;
};

const AddFilterButton: FC<AddFilterButtonType> = ({ onClick, disabled }) => {
  return useMemo(
    () => (
      <Button
        startEnhancer={<Icon.Plus />}
        kind='secondary'
        onClick={onClick}
        size={SIZE.compact}
        disabled={disabled}
      >
        Add Filter
      </Button>
    ),
    [onClick],
  );
};

export default AddFilterButton;
