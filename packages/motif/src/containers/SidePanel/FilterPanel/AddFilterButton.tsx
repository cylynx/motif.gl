import React, { FC, useMemo } from 'react';
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
        kind='primary'
        onClick={onClick}
        disabled={disabled}
        width='100%'
      >
        Add Filter
      </Button>
    ),
    [onClick],
  );
};

export default AddFilterButton;
