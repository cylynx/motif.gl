import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import some from 'lodash/some';

import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { Modal, ModalBody, SIZE } from 'baseui/modal';
import { withRouter } from 'react-router-dom';
import { Loader } from '@blocklynx/ui';
import {
  closeModal,  
  closeImportModal,
  setScore,
} from '../redux/graphInitSlice';

import SideLayer from './SideLayer';
import BottomLayer from './BottomLayer';

import InvestigateChart from '../InvestigateChart';
import { InvestigatePanel } from '../InvestigatePanel';
import InvestigateTimeBar from '../InvestigateTimeBar';
import ImportWizard from '../ImportWizard';
import InvestigateToolbar from '../InvestigateToolbar';

const InvestigateExplorer = ({ tabs, score }) => {
  const [css] = useStyletron();

  const dispatch = useDispatch();

  const modalMsg = useSelector(state => state.graphInit.modalMsg);
  const modalOpen = useSelector(state => state.graphInit.modalOpen);
  const modalImportOpen = useSelector(state => state.graphInit.modalImportOpen);
  const loading = useSelector(state => state.graphInit.loading);

  useEffect(() => {
    dispatch(setScore(score));            
  }, [score]);

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
          <ImportWizard tabs={tabs}/>
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
        {(
          <Block position="absolute" width="100%" height="calc(100% - 70px)">
            <InvestigateChart />
            <InvestigateToolbar />
          </Block>
        )}
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
