import React, { useContext, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import fscreen from 'fscreen';
import { GoGear, GoX } from 'react-icons/go';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { FaUndoAlt, FaRedoAlt, FaExpand } from 'react-icons/fa';
import { GraphRefContext } from '../Graph';
import { resetState } from '../../redux/graph-slice';
import ToolbarButton, { ToolbarItem } from './ToolbarButton';
import PopoverOption from './PopoverOption';

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 10;

const getNextZoom = (currentZoom: number, isZoomIn: boolean) => {
  const zoom = currentZoom + (isZoomIn ? 0.1 : -0.1);
  if (zoom < MIN_ZOOM) return MIN_ZOOM;
  if (zoom > MAX_ZOOM) return MAX_ZOOM;
  return zoom;
};

const InvestigateToolbar = () => {
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
      name: 'Graph Settings',
      icon: <GoGear />,
      isDisabled: false,
      popoverContent: () => <PopoverOption />,
      onClick: null,
    },
    {
      key: 2,
      name: 'Full Screen',
      icon: <FaExpand />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => toggleFullScreen(),
    },
    {
      key: 3,
      name: 'Undo',
      icon: <FaUndoAlt />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => dispatch(UndoActionCreators.undo()),
    },
    {
      key: 4,
      name: 'Redo',
      icon: <FaRedoAlt />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => dispatch(UndoActionCreators.redo()),
    },
    {
      key: 5,
      name: 'Zoom In',
      icon: <FiZoomIn />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => handleGraphZoom(true),
    },
    {
      key: 6,
      name: 'Zoom Out',
      icon: <FiZoomOut />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => handleGraphZoom(false),
    },
    {
      key: 7,
      name: 'Clear',
      icon: <GoX />,
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

export default InvestigateToolbar;
