import React, { useCallback, useMemo } from 'react';
import html2canvas from 'html2canvas';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from 'react-redux';
import { UISelectors, UISlices } from '../../../redux/ui';
import {
  GraphSelectors,
  StyleOptions,
  GraphList,
  GraphData,
} from '../../../redux/graph';
import * as Icon from '../../../components/Icons';
import Editable from '../../../components/Editable';
import HeaderButton from './HeaderButton';
import SaveButton from './SaveButton/SaveButton';

const Header = () => {
  const name: string = useSelector((state) => UISelectors.getUI(state).name);
  const graphList: GraphList = useSelector((state) =>
    GraphSelectors.getGraphList(state),
  );

  const graphFlatten: GraphData = useSelector((state) =>
    GraphSelectors.getGraphFlatten(state),
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

  return useMemo(
    () => (
      <Block
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        marginBottom='scale300'
        height='scale950'
      >
        <Block>
          <Editable text={name} onChange={onChangeName} />
        </Block>
        <Block>
          {isCanvasHasGraph && (
            <>
              <HeaderButton
                key={1}
                name='Screenshot'
                icon={<Icon.Camera />}
                isDisabled={false}
                onClick={exportPNG}
              />
              <SaveButton
                graphList={graphList}
                styleOptions={styleOptions}
                graphFlatten={graphFlatten}
              />
            </>
          )}
        </Block>
      </Block>
    ),
    [
      name,
      onChangeName,
      isCanvasHasGraph,
      styleOptions,
      graphList,
      graphFlatten,
    ],
  );
};

export default Header;
