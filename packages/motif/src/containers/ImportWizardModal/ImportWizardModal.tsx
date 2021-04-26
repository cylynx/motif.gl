import React, { FC, useMemo, useState } from 'react';
import { Modal, ModalHeader, ModalBody, SIZE, ModalProps } from 'baseui/modal';
import { Tabs, Tab } from 'baseui/tabs-motion';
import { useDispatch, useSelector } from 'react-redux';
import { withStyle } from 'baseui';
import { LabelMedium, ParagraphSmall } from 'baseui/typography';
import { ModalState, UISelectors, UISlices } from '../../redux/ui';
import { ImportTabs, TActiveKey } from './types';

import UploadFiles from './UploadFiles';
import ConfirmationModal from '../../components/ConfirmationModal';
import useFileContents from './UploadFiles/hooks/useFileContents';
import SampleData from './SampleData';

export const defaultImportTabs: ImportTabs[] = [
  { title: 'File', key: 'file', component: <UploadFiles /> },
  {
    title: 'Sample Data',
    key: 'sample-data',
    component: <SampleData />,
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

const StyledModalBody = withStyle(ModalBody, () => ({
  height: 'calc(100% - 60px)',
}));

export type ImportWizardProps = { overrideTabs?: ImportTabs[] };
const ImportWizardModal: FC<ImportWizardProps> = ({ overrideTabs }) => {
  const dispatch = useDispatch();
  const { modal } = useSelector((state) => UISelectors.getUI(state));
  const { isPossessDataPreview, resetDataPreview } = useFileContents();
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const tabs = useMemo(() => {
    return overrideTabs ?? defaultImportTabs;
  }, [overrideTabs]);

  const isModalOpen: boolean = useMemo(() => {
    const { isOpen, content } = modal as ModalState;
    return isOpen && content === 'import';
  }, [modal.isOpen, modal.content]);

  const [activeKey, setActiveKey] = useState(tabs[0].key);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onTabChange = ({ activeKey }: TActiveKey) => {
    setActiveKey(activeKey);
  };

  const onCloseModal: ModalProps['onClose'] = (args) => {
    const { closeSource } = args;

    if (closeSource === 'backdrop') return;

    const isContainPreview = isPossessDataPreview();
    if (isContainPreview) {
      setModalOpen(true);
      return;
    }

    dispatch(UISlices.closeModal());
    resetDataPreview();
  };

  return (
    <>
      <Modal
        closeable
        unstable_ModalBackdropScroll
        isOpen={isModalOpen}
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

              // perform hard code to support small screen width
              minHeight: '630px',
              height: '80vh',
            },
          },
        }}
      >
        <StyledModalHeader>Import Data</StyledModalHeader>
        <StyledModalBody>
          <Tabs
            activeKey={activeKey}
            onChange={onTabChange}
            activateOnFocus
            overrides={{
              Root: {
                style: {
                  height: '100%',
                  position: 'relative',
                },
              },
            }}
          >
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
        </StyledModalBody>
      </Modal>

      <ConfirmationModal
        onClose={() => {
          setModalOpen(false);
        }}
        isOpen={modalOpen}
        onReject={() => {
          setModalOpen(false);
        }}
        onAccept={() => {
          setModalOpen(false);
          resetDataPreview();
          dispatch(UISlices.closeModal());
        }}
        rejectBtnText='Cancel'
        confirmBtnText='Close'
        header={
          <LabelMedium
            as='span'
            overrides={{
              Block: {
                style: {
                  textTransform: 'capitalize',
                },
              },
            }}
          >
            Close Import Wizard
          </LabelMedium>
        }
        body={
          <ParagraphSmall>
            Are you sure you want to close the <b>Import Wizard</b>?
            <br />
            Your field configuration will be lost.
          </ParagraphSmall>
        }
      />
    </>
  );
};

export default ImportWizardModal;
