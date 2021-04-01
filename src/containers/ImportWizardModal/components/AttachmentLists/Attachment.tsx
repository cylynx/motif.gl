import React, { FC, MouseEvent } from 'react';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { Button, KIND, SIZE, SHAPE } from 'baseui/button';
import { colors } from 'baseui/tokens';
import * as Icons from '../../../../components/Icons';

type AttachmentProps = {
  fileName: string;
  onDeleteBtnClick?: (event: MouseEvent<HTMLButtonElement>) => any;
};
const Attachment: FC<AttachmentProps> = ({ fileName, onDeleteBtnClick }) => {
  return (
    <Block position='relative'>
      <Block
        display='flex'
        backgroundColor='mono300'
        justifyContent='space-between'
      >
        <Block
          paddingTop='scale300'
          paddingBottom='scale300'
          paddingLeft='scale600'
          paddingRight='scale300'
          flex='1'
          display='flex'
          alignContent='center'
        >
          <LabelSmall paddingTop='scale0'>{fileName}</LabelSmall>

          <Block
            as='span'
            marginLeft='scale200'
            paddingTop='scale0'
            height='scale300'
          >
            <Icons.CheckCircle color={colors.green400} size={16} />
          </Block>
        </Block>
        <Block display='flex' flex='1' maxWidth='36px' justifyContent='center'>
          <Button
            kind={KIND.tertiary}
            size={SIZE.compact}
            shape={SHAPE.square}
            onClick={onDeleteBtnClick}
            overrides={{
              BaseButton: {
                style: {
                  ':hover': {
                    backgroundColor: 'transparent',
                    color: colors.red400,
                  },
                  ':disabled': {
                    backgroundColor: 'transparent',
                  },
                },
              },
            }}
          >
            <Icons.Trash size={16} />
          </Button>
        </Block>
      </Block>
    </Block>
  );
};

export default Attachment;
