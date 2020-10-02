import React from 'react';
import { Block } from 'baseui/block';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import IconButton from './IconButton';
import { WidgetItem } from '../../types/Widget';

const defaultWidgetList: WidgetItem[] = [
  {
    id: 'layers',
    group: 'main',
    icon: (
      <IconButton
        id='layers'
        group='main'
        icon={<EditOutlined style={{ fontSize: '16px' }} />}
      />
    ),
    widget: <Block />,
    position: 'top',
    active: true,
  },
  {
    id: 'layer2',
    group: 'main',
    icon: (
      <IconButton
        id='layer2'
        group='main'
        icon={<CheckOutlined style={{ fontSize: '16px' }} />}
      />
    ),
    widget: <Block />,
    position: 'top',
    active: false,
  },
  {
    id: 'toolbar',
    group: 'toolbar',
    icon: (
      <IconButton
        id='toolbar'
        group='toolbar'
        icon={<CloseOutlined style={{ fontSize: '16px' }} />}
      />
    ),
    widget: <Block />,
    position: 'bottom',
    active: true,
  },
];

export default defaultWidgetList;
