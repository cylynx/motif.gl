import React, { useCallback, useMemo } from 'react';
import html2canvas from 'html2canvas';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { GraphList } from '../../Graph';
import { getGraphList, getUI, setName } from '../../../redux';
import * as Icon from '../../../components/Icons';
import Editable from '../../../components/Editable';
import HeaderButton, { HeaderButtonProp } from './HeaderButton';

const Header = () => {
  const name: string = useSelector((state) => getUI(state).name);
  const exportGraph: GraphList = useSelector((state) => getGraphList(state));
  const dispatch = useDispatch();

  const onChangeName = useCallback((text: string) => dispatch(setName(text)), [
    dispatch,
  ]);

  const isCanvasHasGraph: boolean = useMemo(() => {
    return exportGraph.length > 0;
  }, [exportGraph.length]);

  const exportPNG = useCallback(() => {
    const graph = document.getElementById('graphin-container');

    html2canvas(graph).then((canvas) => {
      const file = document.createElement('a');
      file.download = 'graph.png';
      file.href = canvas.toDataURL();
      document.body.appendChild(file);
      file.click();
      document.body.removeChild(file);
    });
  }, [isCanvasHasGraph]);

  const exportJSON = useCallback(
    (json: GraphList) => {
      const contentType = 'application/json;charset=utf-8;';
      const jsonInfo: string = JSON.stringify(json);
      const file: HTMLAnchorElement = document.createElement('a');
      file.download = 'graph.json';
      file.href = `data:${contentType},${encodeURIComponent(jsonInfo)}`;
      document.body.appendChild(file);
      file.click();
      document.body.removeChild(file);
    },
    [exportGraph],
  );

  const headerButtons: HeaderButtonProp[] = useMemo(
    () => [
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
        onClick: () => exportJSON(exportGraph),
      },
    ],
    [dispatch, exportPNG, exportJSON, exportGraph],
  );

  return useMemo(
    () => (
      <Block
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        marginTop='scale300'
        marginBottom='scale800'
      >
        <Block>
          <Editable text={name} onChange={onChangeName} />
        </Block>
        <Block>
          {isCanvasHasGraph &&
            headerButtons.map((item) => (
              <HeaderButton key={item.key} {...item} />
            ))}
        </Block>
      </Block>
    ),
    [name, onChangeName, isCanvasHasGraph],
  );
};

export default Header;
