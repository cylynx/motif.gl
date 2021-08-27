import React, { useContext } from 'react';
import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import fscreen from 'fscreen';
import { UISelectors } from '../../redux/ui';
import * as Icon from '../../components/Icons';
import { GraphRefContext } from '../Graph';
import { GraphSlices } from '../../redux/graph';
import ToolbarButton, { ToolbarItem } from './ToolbarButton';
import LegendPopover from './LegendPopover';
import useGraphBehaviors from '../Graph/hooks/useGraphBehaviors';
import useNodeStyle from '../../redux/graph/hooks/useNodeStyle';

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
  const dispatch = useDispatch();
  const { centerCanvas } = useGraphBehaviors(graph);
  const { nodeStyle, switchToFixNodeColor } = useNodeStyle();
  const { containerId } = useSelector(UISelectors.getUI);

  const toggleFullScreen = () => {
    // Exit will be handled by the esc key (no button is available)
    if (!fscreen.fullscreenElement && containerId) {
      const query = `[data-container-id="${containerId}"]`;
      const graphContainer = document.querySelector(query);
      fscreen.requestFullscreen(graphContainer);
    }
  };

  const handleGraphZoom = (isZoomIn: boolean) => {
    const currentZoom: number = graph?.getZoom();
    const newZoom = getNextZoom(currentZoom, isZoomIn);

    // obtain the center point of canvas and zoom to center point
    const centerPoint = {
      x: graph.getWidth() / 2,
      y: graph.getHeight() / 2,
    };

    graph.zoomTo(newZoom, centerPoint);
  };

  const onClearClick = () => {
    dispatch(GraphSlices.resetState());
    centerCanvas();

    if (nodeStyle.color.id === 'legend') {
      switchToFixNodeColor();
    }
  };

  const menuItems: ToolbarItem[] = [
    {
      key: 1,
      name: 'Legend',
      icon: <Icon.Legend size={18} />,
      isDisabled: false,
      popoverContent: () => <LegendPopover />,
      onClick: null,
    },
    {
      key: 2,
      name: 'Full Screen',
      icon: <Icon.FullScreen size={18} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => toggleFullScreen(),
    },
    {
      key: 3,
      name: 'Undo',
      icon: <Icon.Undo size={18} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => dispatch(UndoActionCreators.undo()),
    },
    {
      key: 4,
      name: 'Redo',
      icon: <Icon.Redo size={18} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => dispatch(UndoActionCreators.redo()),
    },
    {
      key: 5,
      name: 'Zoom In',
      icon: <Icon.ZoomIn size={18} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => handleGraphZoom(true),
    },
    {
      key: 6,
      name: 'Zoom Out',
      icon: <Icon.ZoomOut size={18} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => handleGraphZoom(false),
    },
    {
      key: 7,
      name: 'Clear',
      icon: <Icon.X size={18} />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => onClearClick(),
    },
  ];

  return (
    <Block data-testid='toolbar'>
      {menuItems.map((item) => (
        <ToolbarButton key={item.key} item={item} />
      ))}
    </Block>
  );
};

export default Toolbar;
