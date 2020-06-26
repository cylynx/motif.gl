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
} from '../redux/graphInitSlice';
import { getTabsOverride, getNodeMenuOverride } from '../Utilities/overrides';
import { getGraphInit } from '../redux/accessors';

import SideLayer from './SideLayer';
import BottomLayer from './BottomLayer';

import InvestigateChart from '../InvestigateChart';
import { InvestigatePanel } from '../InvestigatePanel';
import InvestigateTimeBar from '../InvestigateTimeBar';
import ImportWizard from '../ImportWizard';
import InvestigateToolbar from '../InvestigateToolbar';
import NodeMenu from '../InvestigateChart/NodeMenu';

const InvestigateExplorer = ({ name, overrides }) => {
  const [css] = useStyletron();

  const dispatch = useDispatch();

  const modalMsg = useSelector(state => getGraphInit(state).modalMsg);
  const modalOpen = useSelector(state => getGraphInit(state).modalOpen);
  const modalImportOpen = useSelector(
    state => getGraphInit(state).modalImportOpen
  );
  const loading = useSelector(state => getGraphInit(state).loading);

  const UserImportWizard = getTabsOverride(overrides, ImportWizard);
  const UserNodeMenu = getNodeMenuOverride(overrides, NodeMenu);

  useEffect(() => {
    if (overrides.score) {
      dispatch(setScore(overrides.score));
    }
    if (name) {
      dispatch(setName(name));
    }
  }, [overrides.score]);

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
