/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useStyletron, ThemeProvider } from 'baseui';
import { Theme } from 'baseui/theme';
import { Block } from 'baseui/block';
import { Modal, ModalBody, SIZE } from 'baseui/modal';
import { Loader } from './components/ui';
import DataTable from './containers/DataTable';
import { Accessors } from './types/Graph';
import { closeModal, setName } from './redux/ui-slice';
import { WidgetItem, defaultWidgetList } from './containers/widgets';
import { setWidget } from './containers/widgets/widget-slice';
import { setAccessors, setDefaultStyles } from './redux/graph-slice';
import { getTabsOverride, getNodeMenuOverride } from './utils/overrides';
import { getUI, getWidget } from './redux';

import SideNavBar from './containers/SideNavBar';
import Graph, {
  Tooltip,
  TooltipProps,
  GraphRefContext,
  NodeStyleType,
  EdgeStyleType,
} from './containers/Graph';
import ImportWizard, { Tab } from './containers/ImportWizard';

export interface WidgetContainerProps {
  children: React.ReactNode;
  graphRef: React.MutableRefObject<HTMLDivElement | null>;
  theme: Theme;
}

export interface Overrides {
  Tabs: Tab[];
  NodeMenu: TooltipProps | null;
  widgetList: WidgetItem[];
  score: number[];
}

export interface ExplorerProps {
  name: string;
  accessors: Accessors;
  overrides: Overrides;
  defaultNodeStyle?: NodeStyleType;
  defaultEdgeStyle?: EdgeStyleType;
  secondaryTheme?: Theme;
}

export const WidgetContainer = (props: WidgetContainerProps) => {
  const { children, theme, graphRef } = props;

  // @ts-ignore not sure what to type for current.graph
  if (graphRef && graphRef.current && graphRef.current.graph) {
    return (
      <ThemeProvider theme={theme}>
        <GraphRefContext.Provider value={graphRef.current}>
          {children}
        </GraphRefContext.Provider>
      </ThemeProvider>
    );
  }
  return null;
};

const Explorer = (props: ExplorerProps) => {
  const {
    name,
    accessors,
    overrides,
    secondaryTheme,
    defaultNodeStyle = { color: 'teal' },
    defaultEdgeStyle = {},
  } = props;
  const graphRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const [, theme] = useStyletron();
  const dispatch = useDispatch();

  // const tooltip = useSelector((state) => getUI(state).tooltip);
  const modal = useSelector((state) => getUI(state).modal);
  const loading = useSelector((state) => getUI(state).loading);
  // const timeLock = useSelector((state) => getUI(state).timeLock);

  const widgetStateIds = useSelector((state) =>
    Object.values(getWidget(state)),
  );
  const UserImportWizard = getTabsOverride(overrides, ImportWizard);
  const UserTooltip = getNodeMenuOverride(overrides, Tooltip);
  const widgetList = overrides.widgetList || defaultWidgetList;
  const activeWidgetList =
    widgetList.filter((x) => widgetStateIds.includes(x.id)) || [];

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
    dispatch(setDefaultStyles({ defaultNodeStyle, defaultEdgeStyle }));
  }, [accessors, overrides.widgetList, name]);

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
        size={SIZE.auto}
      >
        <ModalBody>
          {modal.isOpen && modal.content === 'import' ? (
            <UserImportWizard />
          ) : modal.isOpen && modal.content.startsWith('table') ? (
            <DataTable dataKey={modal.content} />
          ) : (
            modal.isOpen && modal.content
          )}
        </ModalBody>
      </Modal>
      <Block position='absolute' width='100%' height='100%'>
        <Graph ref={graphRef} setTooltip={setTooltip} />
      </Block>
      <WidgetContainer graphRef={graphRef} theme={secondaryTheme || theme}>
        <SideNavBar />
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
