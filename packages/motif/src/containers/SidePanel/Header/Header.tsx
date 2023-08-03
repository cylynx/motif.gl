import React, { useCallback, useMemo } from 'react';

import { Block } from 'baseui/block';
import { useDispatch, useSelector } from '../../../redux/hooks';
import useGraphSnapshot from './useGraphSnapshot';
import { UISelectors, UISlices } from '../../../redux/ui';
import { GraphSelectors, GraphList } from '../../../redux/graph';
import * as Icon from '../../../components/Icons';
import Editable from '../../../components/Editable';
import HeaderButton from './HeaderButton';
import SaveButton from './SaveButton/SaveButton';
import { ExplorerContext } from '../../Graph/context';

const Header = () => {
  const name: string = useSelector((state) => UISelectors.getUI(state).name);
  const { exportPNG } = useGraphSnapshot();
  const graphList: GraphList = useSelector((state) =>
    GraphSelectors.getGraphList(state),
  );

  const dispatch = useDispatch();

  const onChangeName = useCallback(
    (text: string) => dispatch(UISlices.setName(text)),
    [dispatch],
  );

  const isCanvasHasGraph: boolean = useMemo(() => {
    return graphList.length > 0;
  }, [graphList.length]);

  return useMemo(
    () => (
      <Block
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        marginBottom='scale300'
        height='scale950'
      >
        <ExplorerContext.Consumer>
          {({ customSidePanelHeader }) => {
            if (!customSidePanelHeader) {
              return (
                <>
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
                        <SaveButton />
                      </>
                    )}
                  </Block>
                </>
              );
            }

            return customSidePanelHeader;
          }}
        </ExplorerContext.Consumer>
      </Block>
    ),
    [name, onChangeName, isCanvasHasGraph, graphList],
  );
};

export default Header;
