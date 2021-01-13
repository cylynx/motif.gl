/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyletron, ThemeProvider } from 'baseui';
import { Theme } from 'baseui/theme';
import { Block } from 'baseui/block';
import { Modal, ModalBody, SIZE } from 'baseui/modal';

import { ToasterContainer, PLACEMENT } from 'baseui/toast';
import { PRIMARY_COLOR } from './constants/colors';
import { Loader } from './components/ui';
import DataTable from './containers/DataTable';
import { closeModal, setName } from './redux/ui-slice';
import { defaultWidgetList, WidgetItem } from './containers/widgets';
import { setWidget } from './containers/widgets/widget-slice';
import { setAccessors, overrideStyles } from './redux/graph-slice';
import {
  Overrides,
  getTabsOverride,
  getTooltipOverride,
  getWidgetOverride,
} from './utils/overrides';
import { getUI, getWidget } from './redux';
import SideNavBars from './containers/SideNavBar';
import Graph, {
  Tooltip,
  GraphRefContext,
  Accessors,
  StyleOptions,
} from './containers/Graph';
import ImportWizard, { defaultImportTabs } from './containers/ImportWizard';
import { LEFT_LAYER_WIDTH, SIDE_NAVBAR_WIDTH } from './constants/widget-units';

export interface WidgetContainerProps {
  children: React.ReactNode;
  graphRef: React.MutableRefObject<HTMLDivElement | null>;
  theme: Theme;
}

export interface ExplorerProps {
  name: string;
  accessors: Accessors;
  overrides: Overrides;
  styleOptions?: StyleOptions;
  secondaryTheme?: Theme;
}

export const WidgetContainer = (props: WidgetContainerProps) => {
  const { children, theme, graphRef } = props;

  // @ts-ignore not sure what to type for current.graph
  if (graphRef && graphRef.current && graphRef.current.graph) {
    return (
      <ThemeProvider theme={theme}>
        <ToasterContainer placement={PLACEMENT.top}>
          <GraphRefContext.Provider value={graphRef.current}>
            {children}
          </GraphRefContext.Provider>
        </ToasterContainer>
      </ThemeProvider>
    );
  }
  return null;
};

const defaultNodeStyle: StyleOptions['nodeStyle'] = {
  color: {
    id: 'fixed',
    value: PRIMARY_COLOR,
  },
};

const Explorer = (props: ExplorerProps) => {
  const {
    name,
    accessors,
    overrides,
    secondaryTheme,
    styleOptions = { nodeStyle: defaultNodeStyle },
  } = props;
  const graphRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [leftLayerWidth, setLeftLayerWidth] = useState<string>(
    LEFT_LAYER_WIDTH,
  );

  const [, theme] = useStyletron();
  const dispatch = useDispatch();
  const modal = useSelector((state) => getUI(state).modal);
  const loading = useSelector((state) => getUI(state).loading);
  const widgetState = useSelector((state) => getWidget(state));
  const widgetStateIds = useMemo(() => {
    return Object.values(widgetState);
  }, [widgetState]);

  const UserTooltip = getTooltipOverride(overrides, Tooltip);
  const userImportTabs = getTabsOverride(overrides, defaultImportTabs);
  const widgetList = getWidgetOverride(overrides, defaultWidgetList);
  const activeWidgetList: WidgetItem[] =
    widgetList.filter((x: WidgetItem) => widgetStateIds.includes(x.id)) || [];

  const isMainWidgetExpanded: boolean = useMemo(() => {
    return widgetState.main !== null;
  }, [widgetState.main]);

  useEffect(() => {
    const { graph } = graphRef.current;
    const graphWidth: number = graph.getWidth();
    const graphHeight: number = graph.getHeight();
    const leftLayerWidthPx = 338; // width (310) + padding (14 * 2)

    graph.setAutoPaint(false);
    if (isMainWidgetExpanded) {
      console.log('expanded');
      setLeftLayerWidth(LEFT_LAYER_WIDTH);
      graph.changeSize(graphWidth - leftLayerWidthPx, graphHeight);
      graph.paint();
      graph.setAutoPaint(true);
      return;
    }

    setLeftLayerWidth('0px');
    graph.changeSize(graphWidth + leftLayerWidthPx, graphHeight);
    console.log('not expanded');
    graph.paint();
    graph.setAutoPaint(true);
  }, [isMainWidgetExpanded]);

  useEffect(() => {
    // Filter out components
    const widgetProp = widgetList.map((x) => {
      return {
        id: x.id,
        group: x.group,
        position: x.position,
        active: x.active,
      };
    });
    if (accessors) {
      dispatch(setAccessors(accessors));
    }
    if (name) {
      dispatch(setName(name));
    }
    dispatch(setWidget(widgetProp));
    dispatch(overrideStyles(styleOptions));
  }, [accessors, overrides?.widgetList, name]);

  // UI Functions
  const onCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <Fragment>
      <Modal
        isOpen={modal.isOpen}
        onClose={onCloseModal}
        closeable
        // remove warnings in the console.
        unstable_ModalBackdropScroll
        size={SIZE.auto}
      >
        <ModalBody>
          {modal.isOpen && modal.content === 'import' ? (
            <ImportWizard tabs={userImportTabs} />
          ) : modal.isOpen && modal.content.startsWith('table') ? (
            <DataTable dataKey={modal.content} />
          ) : (
            modal.isOpen && modal.content
          )}
        </ModalBody>
      </Modal>
      <Block
        position='absolute'
        width={`calc(100% - ${SIDE_NAVBAR_WIDTH} - ${leftLayerWidth})`}
        height='100%'
        left={`calc(${SIDE_NAVBAR_WIDTH} + ${leftLayerWidth})`}
      >
        <Graph ref={graphRef} setTooltip={setTooltip} />
      </Block>
      <WidgetContainer graphRef={graphRef} theme={secondaryTheme || theme}>
        <SideNavBars />
        {loading && <Loader />}
        {tooltip && <UserTooltip tooltip={tooltip} />}
        {activeWidgetList.length > 0 &&
          activeWidgetList.map((item) => (
            <Block key={item.id}>{item.widget}</Block>
          ))}
      </WidgetContainer>
    </Fragment>
  );
};

export default Explorer;
