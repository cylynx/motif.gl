import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { Modal, ModalBody, SIZE } from 'baseui/modal';
import { withRouter } from 'react-router-dom';
import { Loader } from '@blocklynx/ui';
import {
  fetchBegin,  
  closeModal,  
  closeImportModal,
} from '../redux/graphInitSlice';
import { setScore } from '../redux/graphInitSlice';
import SideLayer from './SideLayer';
import BottomLayer from './BottomLayer';
import { uploadData } from '../API';

import InvestigateChart from '../InvestigateChart';
import { InvestigatePanel } from '../InvestigatePanel';
import InvestigateTimeBar from '../InvestigateTimeBar';
import ImportWizard from '../ImportWizard';
import InvestigateToolbar from '../InvestigateToolbar';

const InvestigateExplorer = ({ tabs, data, getRecentTrans, score }) => {
  const [css] = useStyletron();

  const dispatch = useDispatch();

  const modalMsg = useSelector(state => state.graphInit.modalMsg);
  const modalOpen = useSelector(state => state.graphInit.modalOpen);
  const modalImportOpen = useSelector(state => state.graphInit.modalImportOpen);
  const loading = useSelector(state => state.graphInit.loading);

  useEffect(() => {
    dispatch(setScore(score));
    if (data) {
      dispatch(closeImportModal());
      dispatch(fetchBegin());
      uploadData(data);      
    }                 
  }, [data, score]);

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
            <InvestigateChart getRecentTrans={getRecentTrans} />
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
