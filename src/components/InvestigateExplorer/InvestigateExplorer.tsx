import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useStyletron, ThemeProvider } from 'baseui';
import { Block } from 'baseui/block';
import { Modal, ModalBody, SIZE } from 'baseui/modal';
import { Loader } from '../ui';
import * as Prop from '../../types/Prop';
import {
  closeModal,
  closeImportModal,
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
import InvestigateChart from '../InvestigateChart';
import ImportWizard from '../ImportWizard';
import Tooltip from '../InvestigateChart/Tooltip';

const InvestigateExplorer: React.FC<Prop.InvestigateExplorer> = (props) => {
  const { name, currency, accessors, overrides, secondaryTheme } = props;

  const [css, theme] = useStyletron();

  const dispatch = useDispatch();

  const modalMsg = useSelector((state) => getUI(state).modalMsg);
  const modalOpen = useSelector((state) => getUI(state).modalOpen);
  const modalImportOpen = useSelector((state) => getUI(state).modalImportOpen);
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

  const onCloseModalImport = () => {
    dispatch(closeImportModal());
  };

  return (
    <Fragment>
      <Modal isOpen={modalOpen} onClose={onCloseModal} closeable>
        <ModalBody>{modalMsg}</ModalBody>
      </Modal>
      <Modal
        isOpen={modalImportOpen}
        onClose={onCloseModalImport}
        closeable
        size={SIZE.auto}
      >
        <ModalBody>
          <UserImportWizard />
        </ModalBody>
      </Modal>
      <Block
        position='absolute'
        width='100%'
        height='100%'
        backgroundColor='backgroundPrimary'
      >
        <InvestigateChart Tooltip={UserTooltip} />
      </Block>
      <Fragment>
        <ThemeProvider theme={secondaryTheme || theme}>
          {loading && (
            <div
              className={css({
                position: 'absolute',
                top: '70px',
                height: '30px',
                width: '100%',
                zIndex: 1,
              })}
            >
              <Loader />
            </div>
          )}
          <SideNavBar />
          {activeWidgetList.length > 0 &&
            activeWidgetList.map((item) => (
              <Block key={item.id}>{item.widget}</Block>
            ))}
        </ThemeProvider>
      </Fragment>
    </Fragment>
  );
};

export default InvestigateExplorer;
