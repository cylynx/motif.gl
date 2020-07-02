import React from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import fscreen from 'fscreen';

import { useStyletron, DarkTheme, ThemeProvider } from 'baseui';

import { GoGear, GoX } from 'react-icons/go';
import { FaUndoAlt, FaRedoAlt, FaExpand } from 'react-icons/fa';
import { resetState } from '../../redux/graphSlice';
import ToolbarItem from './ToolbarItem';
import PopoverOption from './PopoverOption';

const InvestigateToolbar = props => {
  const [css] = useStyletron();
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
      name: 'Clear',
      icon: <GoX />,
      isDisabled: false,
      popoverContent: null,
      onClick: () => dispatch(resetState()),
    },
  ];

  return (
    <ThemeProvider theme={DarkTheme}>
      <div
        className={css({
          display: 'inline-flex',
          flexDirection: 'column',
          position: 'absolute',
          top: '120px',
          right: '2%',
        })}
      >
        {menuItems.map(item => {
          return <ToolbarItem key={item.key} item={item} graph={props.graph} />;
        })}
      </div>
    </ThemeProvider>
  );
};

export default InvestigateToolbar;
