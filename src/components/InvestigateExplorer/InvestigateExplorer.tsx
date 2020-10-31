/* eslint-disable import/no-extraneous-dependencies */
import React, { useState, useEffect, useRef, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useStyletron, ThemeProvider } from 'baseui';
import { Theme } from 'baseui/theme';
import { Block } from 'baseui/block';
import { Modal, ModalBody, SIZE } from 'baseui/modal';
import { Loader } from '../ui';
import * as Prop from '../../types/Prop';
import {
  closeModal,
  setScore,
  setName,
  setCurrency,
} from '../../redux/ui-slice';
import { setWidget } from '../widgets/widget-slice';
import { setAccessors } from '../../redux/graph-slice';
import { getTabsOverride, getNodeMenuOverride } from '../../utils/overrides';
import { getUI, getWidget } from '../../redux';

import { defaultWidgetList } from '../widgets';

import SideNavBar from '../SideNavBar';
import Graph, { Tooltip, GraphRefContext } from '../Graph';
import ImportWizard from '../ImportWizard';

type WidgetContainerProps = {
  children: React.ReactNode;
  graphRef: React.MutableRefObject<HTMLDivElement | null>;
  theme: Theme;
};

const WidgetContainer = (props: WidgetContainerProps) => {
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

const InvestigateExplorer: React.FC<Prop.InvestigateExplorer> = (props) => {
  const { name, currency, accessors, overrides, secondaryTheme } = props;
  const [tooltip, setTooltip] = useState(null);
  const graphRef = useRef(null);

  const [, theme] = useStyletron();
  const dispatch = useDispatch();

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
    if (overrides.score) {
      dispatch(setScore(overrides.score));
    }
    if (name) {
      dispatch(setName(name));
    }
    if (currency) {
      dispatch(setCurrency(currency));
    }
    dispatch(setWidget(widgetProp));
  }, [accessors, overrides.score, overrides.widgetList, name, currency]);

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
          {modal.content === 'import' ? <UserImportWizard /> : modal.content}
        </ModalBody>
      </Modal>
      <Block position='absolute' width='100%' height='100%'>
        <Graph setTooltip={setTooltip} ref={graphRef} />
      </Block>
      <WidgetContainer graphRef={graphRef} theme={secondaryTheme || theme}>
        <SideNavBar />
        {loading && <Loader />}
        {tooltip && <UserTooltip info={tooltip} />}
        {activeWidgetList.length > 0 &&
          activeWidgetList.map((item) => (
            <Block key={item.id}>{item.widget}</Block>
          ))}
      </WidgetContainer>
    </Fragment>
  );
};

export default InvestigateExplorer;
