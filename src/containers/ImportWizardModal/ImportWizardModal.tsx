import React, { FC, useMemo } from 'react';
import { Modal, ModalBody, SIZE } from 'baseui/modal';
import { useDispatch, useSelector } from 'react-redux';
import { ModalState, UISelectors, UISlices } from '../../redux/ui';
import { getTabsOverride, Overrides } from '../../utils/overrides';

// export const defaultImportTabs: Tab[] = [
//   { title: 'File', key: 'file', component: <ImportLocalFile /> },
//   {
//     title: 'Sample Data',
//     key: 'sample-data',
//     component: <ImportSampleData />,
//   },
// ];

export type ImportWizardProps = { overrides?: Overrides };
const ImportWizardModal: FC<ImportWizardProps> = ({ overrides }) => {
  const dispatch = useDispatch();
  const { modal } = useSelector((state) => UISelectors.getUI(state));

  const onCloseModal = () => {
    dispatch(UISlices.closeModal());
  };

  console.log(overrides);

  // const tabs = useMemo(() => {
  //   return getTabsOverride(overrides, defaultImportTabs);
  // }, [overrides]);

  const isOpen: boolean = useMemo(() => {
    const { isOpen, content } = modal as ModalState;
    return isOpen && content === 'import';
  }, [modal.isOpen, modal.content]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      closeable
      unstable_ModalBackdropScroll
      size={SIZE.auto}
      overrides={{
        Root: {
          style: () => ({
            position: 'absolute',
          }),
        },
      }}
    >
      <ModalBody>
        <div>123</div>
      </ModalBody>
    </Modal>
  );
};

export default ImportWizardModal;
