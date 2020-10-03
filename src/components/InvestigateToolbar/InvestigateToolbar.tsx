import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import fscreen from 'fscreen';
import { GoGear, GoX } from 'react-icons/go';
import { FaUndoAlt, FaRedoAlt, FaExpand } from 'react-icons/fa';
import { resetState } from '../../redux/graph-slice';
import ToolbarItem from './ToolbarItem';
import PopoverOption from './PopoverOption';

const InvestigateToolbar = () => {
  const graph = document.getElementById('graphin-container');
  const dispatch = useDispatch();

  const toggleFullScreen = () => {
    if (!fscreen.fullscreenElement) {
      fscreen.requestFullscreen(graph);
    } else {
      fscreen.exitFullscreen();
    }
  };

  const menuItems = [
    {
      key: 1,
      name: 'Graph Settings',
      icon: <GoGear />,
      isDisabled: false,
      popoverContent: () => <PopoverOption />,
      onClick: null as any,
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
        <ToolbarItem key={item.key} item={item} />
      ))}
    </Fragment>
  );
};

export default InvestigateToolbar;
