import React, { FC, MouseEvent, ReactNode } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  CLOSE_SOURCE,
} from 'baseui/modal';

type TButtonEvent = (event: MouseEvent<HTMLButtonElement>) => any;
export type ConfirmationModalProps = {
  onClose: (args: { closeSource?: CLOSE_SOURCE[keyof CLOSE_SOURCE] }) => any;
  isOpen: boolean;
  onReject: TButtonEvent;
  onAccept: TButtonEvent;
  header: ReactNode;
  body?: ReactNode;
};

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  onClose,
  isOpen,
  onReject,
  onAccept,
  header,
  body,
}): JSX.Element => {
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      unstable_ModalBackdropScroll
      closeable={false}
    >
      <ModalHeader>{header}</ModalHeader>
      {body && <ModalBody>{body}</ModalBody>}
      <ModalFooter>
        <ModalButton
          kind='tertiary'
          onClick={onReject}
          data-testid='confirmation-modal:reject'
        >
          No
        </ModalButton>
        <ModalButton onClick={onAccept} data-testid='confirmation-modal:accept'>
          Yes
        </ModalButton>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
