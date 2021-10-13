import React, { FC } from 'react';
import { LabelMedium, ParagraphSmall } from 'baseui/typography';
import ConfirmationModal from '../../../../components/ConfirmationModal';

export type OverwriteStyleModalProps = { isOpen: boolean; onAction: any };
const OverwriteStyleModal: FC<OverwriteStyleModalProps> = ({
  isOpen,
  onAction,
}) => {
  return (
    <ConfirmationModal
      onClose={() => {
        onAction(false);
      }}
      isOpen={isOpen}
      onReject={() => {
        onAction(false);
      }}
      onAccept={() => {
        onAction(true);
      }}
      rejectBtnText='No'
      confirmBtnText='Yes'
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
          Overwrite existing styles?
        </LabelMedium>
      }
      body={
        <ParagraphSmall>
          Import file styles differ from currently applied styles.
        </ParagraphSmall>
      }
    />
  );
};

export default OverwriteStyleModal;
