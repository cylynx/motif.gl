import React, { useCallback, useMemo } from 'react';
import html2canvas from 'html2canvas';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { UISelectors, UISlices } from '../../../redux/ui';
import {
  GraphSelectors,
  StyleOptions,
  TLoadFormat,
  GraphList,
} from '../../../redux/graph';
import * as Icon from '../../../components/Icons';
import Editable from '../../../components/Editable';
import HeaderButton, { HeaderButtonProp } from './HeaderButton';

const Header = () => {
  const name: string = useSelector((state) => UISelectors.getUI(state).name);
  const graphList: GraphList = useSelector((state) =>
    GraphSelectors.getGraphList(state),
  );

  const styleOptions: StyleOptions = useSelector((state) =>
    GraphSelectors.getStyleOptions(state),
  );
  const dispatch = useDispatch();

  const onChangeName = useCallback(
    (text: string) => dispatch(UISlices.setName(text)),
    [dispatch],
  );

  const isCanvasHasGraph: boolean = useMemo(() => {
    return graphList.length > 0;
  }, [graphList.length]);

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

  const exportJSON = (graphList: GraphList, styleOptions: StyleOptions) => {
    const exportData: TLoadFormat = {
      data: graphList,
      style: styleOptions,
    };

    const contentType = 'application/json;charset=utf-8;';
    const jsonInfo: string = JSON.stringify(exportData);
    const file: HTMLAnchorElement = document.createElement('a');
    file.download = 'graph.json';
    file.href = `data:${contentType},${encodeURIComponent(jsonInfo)}`;
    document.body.appendChild(file);
    file.click();
    document.body.removeChild(file);
  };

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
        onClick: () => exportJSON(graphList, styleOptions),
      },
    ],
    [dispatch, exportPNG, exportJSON, graphList, styleOptions],
  );

  return useMemo(
    () => (
      <Block
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        marginTop='scale300'
        marginBottom='scale800'
        height='scale950'
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
    [name, onChangeName, isCanvasHasGraph, styleOptions, graphList],
  );
};

export default Header;
