import React from 'react';
import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { updateWidget } from '../../redux/widget/slice';
import { WidgetSelectors } from '../../redux/widget';
import { Button } from '../../components/ui';

type IconButtonProps = {
  icon: React.ReactNode;
  id: string;
  group: string;
};

const IconButton = ({ icon, id, group }: IconButtonProps) => {
  const dispatch = useDispatch();
  const activeId = useSelector(
    (state) => WidgetSelectors.getWidget(state)[group],
  );
  const updateSelection = () => {
    dispatch(updateWidget({ key: group, id }));
  };

  return (
    <Block marginBottom='12px'>
      <Button
        shape='round'
        kind='minimal'
        onClick={updateSelection}
        isSelected={activeId === id}
      >
        {icon}
      </Button>
    </Block>
  );
};

export default IconButton;
