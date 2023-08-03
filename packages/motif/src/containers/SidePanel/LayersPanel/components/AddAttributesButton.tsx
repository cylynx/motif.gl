import React, { FC, SyntheticEvent } from 'react';
import { KIND } from 'baseui/button';
import * as Icon from '../../../../components/Icons';
import { Button } from '../../../../components/ui';

type AddAttributesButtonProps = {
  onClick?: (event: SyntheticEvent<HTMLButtonElement, Event>) => any;
};
const AddAttributesButton: FC<AddAttributesButtonProps> = ({ onClick }) => {
  return (
    <Button
      startEnhancer={<Icon.Plus />}
      onClick={onClick}
      kind={KIND.secondary}
      width='100%'
    >
      Add Fields
    </Button>
  );
};

export default AddAttributesButton;
