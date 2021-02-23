import React from 'react';
import { LeftLayer, BottomRightLayer, TopRightLayer } from './layer';
import VariableInspector from '../VariableInspector';
import Toolbar from '../Toolbar';
import {
  LayersPanel,
  OptionsPanel,
  FilterPanel,
  SearchPanel,
} from '../SidePanel';
import IconButton from './IconButton';
import * as Icon from '../../components/Icons';
import { WidgetItem } from '../../redux/widget';

const defaultWidgetList: WidgetItem[] = [
  {
    id: 'layers',
    group: 'main',
    icon: <IconButton id='layers' group='main' icon={<Icon.Layer />} />,
    widget: (
      <LeftLayer>
        <LayersPanel />
      </LeftLayer>
    ),
    position: 'top',
    active: true,
  },
  {
    id: 'options',
    group: 'main',
    icon: <IconButton id='options' group='main' icon={<Icon.Gear />} />,
    widget: (
      <LeftLayer>
        <OptionsPanel />
      </LeftLayer>
    ),
    position: 'top',
    active: false,
  },
  {
    id: 'filters',
    group: 'main',
    icon: <IconButton icon={<Icon.Filter />} id='filters' group='main' />,
    widget: (
      <LeftLayer>
        <FilterPanel />
      </LeftLayer>
    ),
    position: 'top',
    active: false,
  },
  {
    id: 'search',
    group: 'main',
    icon: <IconButton icon={<Icon.Search />} id='search' group='main' />,
    widget: (
      <LeftLayer padding={false}>
        <SearchPanel />
      </LeftLayer>
    ),
    position: 'top',
    active: false,
  },
  {
    id: 'toolbar',
    group: 'toolbar',
    icon: (
      <IconButton id='toolbar' group='toolbar' icon={<Icon.DotsVertical />} />
    ),
    widget: (
      <TopRightLayer>
        <Toolbar />
      </TopRightLayer>
    ),
    position: 'bottom',
    active: true,
  },
  {
    id: 'inspector',
    group: 'inspector',
    icon: (
      <IconButton id='inspector' group='inspector' icon={<Icon.BarChart />} />
    ),
    widget: (
      <BottomRightLayer>
        <VariableInspector />
      </BottomRightLayer>
    ),
    position: 'bottom',
    active: true,
  },
];

export default defaultWidgetList;
