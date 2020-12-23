import React, { useContext, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import fscreen from 'fscreen';
import * as Icon from '../../components/Icons';
import { GraphRefContext } from '../Graph';
import { resetState } from '../../redux';
import ToolbarButton, { ToolbarItem } from './ToolbarButton';
import SettingsPopover from './SettingsPopover';
import LegendPopover from './LegendPopover';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

const getNextZoom = (currentZoom: number, isZoomIn: boolean) => {
  const zoom = currentZoom + (isZoomIn ? 0.1 : -0.1);
  if (zoom < MIN_ZOOM) return MIN_ZOOM;
  if (zoom > MAX_ZOOM) return MAX_ZOOM;
  return zoom;
};

const Toolbar = () => {
  const graphRef = useContext(GraphRefContext);
  const { graph } = graphRef;
  const graphContainer = document.getElementById('graphin-container');
  const dispatch = useDispatch();

  const toggleFullScreen = () => {
    // Exit will be handled by the esc key (no button is available)
    if (!fscreen.fullscreenElement) {
      fscreen.requestFullscreen(graphContainer);
    }
  };

  const handleGraphZoom = (isZoomIn: boolean) => {
    const currentZoom: number = graph?.getZoom();
    const newZoom = getNextZoom(currentZoom, isZoomIn);
    graph.zoomTo(newZoom);
  };

  const menuItems: ToolbarItem[] = [
    {
      key: 1,
      name: 'Settings',
      icon: <Icon.Gear size={18} />,
      isDisabled: false,
      popoverContent: () => <SettingsPopover />,
      onClick: null,
    },
    {
      key: 2,
      name: 'Legend',
      icon: <Icon.Legend size={18} />,
      isDisabled: false,
      popoverContent: () => <LegendPopover />,
      onClick: null,
    },
    {
      key: 3,
      name: 'Full Screen',
      icon: <Icon.FullScreen size={18} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => toggleFullScreen(),
    },
    {
      key: 4,
      name: 'Undo',
      icon: <Icon.Undo size={22} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => dispatch(UndoActionCreators.undo()),
    },
    {
      key: 5,
      name: 'Redo',
      icon: <Icon.Redo size={22} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => dispatch(UndoActionCreators.redo()),
    },
    {
      key: 6,
      name: 'Zoom In',
      icon: <Icon.ZoomIn size={18} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => handleGraphZoom(true),
    },
    {
      key: 7,
      name: 'Zoom Out',
      icon: <Icon.ZoomOut size={18} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => handleGraphZoom(false),
    },
    {
      key: 8,
      name: 'Clear',
      icon: <Icon.X size={18} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => dispatch(resetState()),
    },
  ];

  return (
    <Fragment>
      {menuItems.map((item) => (
        <ToolbarButton key={item.key} item={item} />
      ))}
    </Fragment>
  );
};

export default Toolbar;
