import React, { FC, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, SIZE } from 'baseui/modal';
import { Tabs, Tab } from 'baseui/tabs-motion';
import { useDispatch, useSelector } from 'react-redux';
import { withStyle } from 'baseui';
import { ModalState, UISelectors, UISlices } from '../../redux/ui';
import { Overrides } from '../../utils/overrides';
import { ImportTabs, TActiveKey } from './types';

import UploadFiles from './UploadFiles';

export const defaultImportTabs: ImportTabs[] = [
  { title: 'File', key: 'file', component: <UploadFiles /> },
  {
    title: 'Sample Data',
    key: 'sample-data',
    component: <div>Import Sample Data</div>,
  },
  {
    title: 'Banking API',
    key: 'banking-api',
    component: <div>Banking API</div>,
  },
];

const StyledModalHeader = withStyle(ModalHeader, ({ $theme }) => ({
  marginTop: $theme.sizing.scale600,
}));

export type ImportWizardProps = { overrides?: Overrides };
const ImportWizardModal: FC<ImportWizardProps> = ({ overrides }) => {
  const dispatch = useDispatch();
  const { modal } = useSelector((state) => UISelectors.getUI(state));

  const tabs = useMemo(() => {
    return overrides?.Tabs ?? defaultImportTabs;
  }, [overrides]);

  const isOpen: boolean = useMemo(() => {
    const { isOpen, content } = modal as ModalState;
    return isOpen && content === 'import';
  }, [modal.isOpen, modal.content]);

  const [activeKey, setActiveKey] = useState(tabs[0].key);
  const onTabChange = ({ activeKey }: TActiveKey) => {
    setActiveKey(activeKey);
  };

  const onCloseModal = () => {
    dispatch(UISlices.closeModal());
  };

  return (
    <Modal
      closeable
      unstable_ModalBackdropScroll
      isOpen={isOpen}
      onClose={onCloseModal}
      size={SIZE.auto}
      overrides={{
        Root: {
          style: () => ({
            position: 'absolute',
          }),
        },
        Dialog: {
          style: {
            width: '848px',
            height: '720px',
          },
        },
      }}
    >
      <StyledModalHeader>Add Data To Graph</StyledModalHeader>
      <ModalBody>
        <Tabs activeKey={activeKey} onChange={onTabChange} activateOnFocus>
          {tabs.map((tab: ImportTabs) => (
            <Tab
              title={tab.title}
              key={tab.key}
              overrides={{
                TabPanel: {
                  style: {
                    paddingLeft: 0,
                    paddingRight: 0,
                  },
                },
              }}
            >
              {tab.component}
            </Tab>
          ))}
        </Tabs>
      </ModalBody>
    </Modal>
  );
};

export default ImportWizardModal;
