import React, { useState } from 'react';
import html2canvas from 'html2canvas';
import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { getGraph, getUI } from '../../redux';
import { fetchError } from '../../redux/ui-slice';
import { resetState } from '../../redux/graph-slice';
import * as Icon from '../../components/Icons';
import Editable from '../../components/Editable';
import HeaderButton, { HeaderButtonProp } from './HeaderButton';

const Header = () => {
  const [value, setValue] = useState(useSelector((state) => getUI(state).name));
  const exportGraph = useSelector((state) => getGraph(state).graphList);
  const dispatch = useDispatch();

  const exportPNG = () => {
    const graph = document.getElementById('graphin-container');
    if (graph !== null) {
      html2canvas(graph).then((canvas) => {
        const file = document.createElement('a');
        file.download = 'graph.png';
        file.href = canvas.toDataURL();
        document.body.appendChild(file);
        file.click();
        document.body.removeChild(file);
      });
    } else {
      fetchError('No graph detected');
    }
  };

  const exportJSON = () => {
    const contentType = 'application/json;charset=utf-8;';
    const jsonInfo = JSON.stringify(exportGraph);
    const file = document.createElement('a');
    file.download = 'graph.json';
    file.href = `data:${contentType},${encodeURIComponent(jsonInfo)}`;
    document.body.appendChild(file);
    file.click();
    document.body.removeChild(file);
  };

  const headerButtons: HeaderButtonProp[] = [
    {
      key: 1,
      name: 'Clear',
      icon: <Icon.X />,
      isDisabled: false,
      onClick: () => dispatch(resetState()),
    },
    {
      key: 1,
      name: 'Screenshot',
      icon: <Icon.Camera />,
      isDisabled: false,
      onClick: exportPNG,
    },
    {
      key: 2,
      name: 'Save',
      icon: <Icon.Save />,
      isDisabled: false,
      onClick: exportJSON,
    },
  ];

  return (
    <Block
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      marginTop='scale300'
      marginBottom='scale800'
    >
      <Block>
        <Editable text={value} onChange={(text) => setValue(text)} />
      </Block>
      <Block>
        {headerButtons.map((item) => (
          <HeaderButton key={item.key} {...item} />
        ))}
      </Block>
    </Block>
  );
};

export default Header;
