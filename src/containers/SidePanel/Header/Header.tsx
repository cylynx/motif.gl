import React, { useCallback, useContext, useMemo } from 'react';
import html2canvas from 'html2canvas';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { UISelectors, UISlices } from '../../../redux/ui';
import { GraphSelectors, GraphList } from '../../../redux/graph';
import * as Icon from '../../../components/Icons';
import Editable from '../../../components/Editable';
import HeaderButton, { HeaderButtonProp } from './HeaderButton';
import GraphRefContext from '../../Graph/context';

const Header = () => {
  const name: string = useSelector((state) => UISelectors.getUI(state).name);
  const exportGraph: GraphList = useSelector((state) =>
    GraphSelectors.getGraphList(state),
  );
  const dispatch = useDispatch();
  const { graph } = useContext(GraphRefContext);

  const onChangeName = useCallback(
    (text: string) => dispatch(UISlices.setName(text)),
    [dispatch],
  );

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

  // const exportJSON = useCallback(
  //   (json: GraphList) => {
  //     const contentType = 'application/json;charset=utf-8;';
  //     const jsonInfo: string = JSON.stringify(json);
  //     const file: HTMLAnchorElement = document.createElement('a');
  //     file.download = 'graph.json';
  //     file.href = `data:${contentType},${encodeURIComponent(jsonInfo)}`;
  //     document.body.appendChild(file);
  //     file.click();
  //     document.body.removeChild(file);
  //   },
  //   [exportGraph],
  // );

  const exportJSON = () => {
    const sampleGraph = graph.toDataURL();
    console.log(sampleGraph);
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
        onClick: () => exportJSON(),
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
    [name, onChangeName, isCanvasHasGraph],
  );
};

export default Header;
