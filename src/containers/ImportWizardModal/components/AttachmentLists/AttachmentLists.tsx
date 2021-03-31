import React, { FC, useMemo } from 'react';
import { Block } from 'baseui/block';
import useProgressTimer from '../ProgressStepper/hooks/useProgressTimer';
import { TFileContent } from '../../../../redux/import/fileUpload';
import Attachment from './Attachment';

export type AttachmentListsProps = {
  attachments: TFileContent[];
  onDeleteBtnClick: (index: number) => void;
};

const AttachmentLists: FC<AttachmentListsProps> = ({
  attachments,
  onDeleteBtnClick,
}) => {
  const [progress] = useProgressTimer(100, 25, 1);
  const isProgressCompleted: boolean = useMemo(() => {
    return progress === 100;
  }, [[progress]]);

  return (
    <Block>
      {attachments.map((fileContent: TFileContent, index: number) => {
        const { fileName } = fileContent;
        const key = `${index}-${fileName}`;
        return (
          <Block marginTop={index === 0 ? 0 : 'scale300'} key={key}>
            <Attachment
              fileName={fileName}
              progressValue={progress}
              isProgressCompleted={isProgressCompleted}
              onDeleteBtnClick={() => onDeleteBtnClick(index)}
            />
          </Block>
        );
      })}
    </Block>
  );
};

export default AttachmentLists;
