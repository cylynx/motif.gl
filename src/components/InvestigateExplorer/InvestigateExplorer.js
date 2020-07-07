import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { Modal, ModalBody, SIZE } from 'baseui/modal';
import { withRouter } from 'react-router-dom';
import { Loader } from '@blocklynx/ui';
import {
  closeModal,
  closeImportModal,
  setScore,
  setName,
  setCurrency,
} from '../../redux/uiSlice';
import { setGetFns } from '../../redux/graphSlice';
import { getTabsOverride, getNodeMenuOverride } from '../../utils/overrides';
import { getUI } from '../../redux/accessors';

import SideLayer from './SideLayer';
import BottomLayer from './BottomLayer';

import InvestigateChart from '../InvestigateChart';
import { InvestigatePanel } from '../InvestigatePanel';
import InvestigateTimeBar from '../InvestigateTimeBar';
import ImportWizard from '../ImportWizard';
import InvestigateToolbar from '../InvestigateToolbar';
import NodeMenu from '../InvestigateChart/NodeMenu';

const InvestigateExplorer = props => {
  const { name, currency, getFns, overrides } = props;

  const [css] = useStyletron();

  const dispatch = useDispatch();

  const modalMsg = useSelector(state => getUI(state).modalMsg);
  const modalOpen = useSelector(state => getUI(state).modalOpen);
  const modalImportOpen = useSelector(state => getUI(state).modalImportOpen);
  const loading = useSelector(state => getUI(state).loading);
  const timeLock = useSelector(state => getUI(state).timeLock);
  const UserImportWizard = getTabsOverride(overrides, ImportWizard);
  const UserNodeMenu = getNodeMenuOverride(overrides, NodeMenu);

  useEffect(() => {
    if (getFns) {
      dispatch(setGetFns(getFns));
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
  }, [getFns, overrides.score, name, currency]);

  // UI Functions
  const onCloseModal = () => {
    dispatch(closeModal());
  };

  const onCloseModalImport = () => {
    dispatch(closeImportModal());
  };

  return (
    <>
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
      <>
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
        {
          <Block position="absolute" width="100%" height="calc(100% - 70px)">
            <InvestigateChart NodeMenu={UserNodeMenu} />
            <InvestigateToolbar />
          </Block>
        }
        {!timeLock && (
          <BottomLayer>
            <InvestigateTimeBar />
          </BottomLayer>
        )}
        <SideLayer>
          <InvestigatePanel />
        </SideLayer>
      </>
    </>
  );
};

export default withRouter(InvestigateExplorer);
