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
  setRecentTransFunc,
} from '../redux/graphInitSlice';
import { getTabsOverride } from '../Utilities/overrides';

import SideLayer from './SideLayer';
import BottomLayer from './BottomLayer';

import InvestigateChart from '../InvestigateChart';
import { InvestigatePanel } from '../InvestigatePanel';
import InvestigateTimeBar from '../InvestigateTimeBar';
import ImportWizard from '../ImportWizard';
import InvestigateToolbar from '../InvestigateToolbar';

const InvestigateExplorer = ({ overrides }) => {
  const [css] = useStyletron();

  const dispatch = useDispatch();

  const modalMsg = useSelector(state => state.graphInit.modalMsg);
  const modalOpen = useSelector(state => state.graphInit.modalOpen);
  const modalImportOpen = useSelector(state => state.graphInit.modalImportOpen);
  const loading = useSelector(state => state.graphInit.loading);

  const UserImportWizard = getTabsOverride(overrides, ImportWizard);

  useEffect(() => {
    if (overrides.score) {
      dispatch(setScore(overrides.score));
    }
    if (overrides.getRecentTrans) {
      dispatch(setRecentTransFunc(overrides.getRecentTrans));
    }
  }, [overrides.score, overrides.getRecentTrans]);

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
            <InvestigateChart />
            <InvestigateToolbar />
          </Block>
        }
        <BottomLayer>
          <InvestigateTimeBar />
        </BottomLayer>
        <SideLayer>
          <InvestigatePanel />
        </SideLayer>
      </>
    </>
  );
};

export default withRouter(InvestigateExplorer);
