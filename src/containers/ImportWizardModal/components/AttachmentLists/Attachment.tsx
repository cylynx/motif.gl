import React, { FC, MouseEvent, useMemo } from 'react';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { Button, KIND, SIZE, SHAPE } from 'baseui/button';
import { colors } from 'baseui/tokens';
import { ProgressBar } from 'baseui/progress-bar';
import * as Icons from '../../../../components/Icons';

type AttachmentProps = {
  fileName: string;
  progressValue: number;
  isProgressCompleted: boolean;
  onDeleteBtnClick?: (event: MouseEvent<HTMLButtonElement>) => any;
};
const Attachment: FC<AttachmentProps> = ({
  fileName,
  onDeleteBtnClick,
  progressValue,
  isProgressCompleted,
}) => {
  const isBtnDisabled: boolean = useMemo(() => {
    return isProgressCompleted === false;
  }, [isProgressCompleted]);

  return (
    <Block position='relative'>
      <Block display='flex' backgroundColor='mono300'>
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

          {isProgressCompleted === false && (
            <LabelSmall marginLeft='scale200' paddingTop='scale0'>
              ({progressValue} %)
            </LabelSmall>
          )}

          {isProgressCompleted && (
            <Block
              as='span'
              marginLeft='scale200'
              paddingTop='scale0'
              height='scale300'
            >
              <Icons.CheckCircle color={colors.green400} size={16} />
            </Block>
          )}
        </Block>
        <Block flex='0 1'>
          <Button
            kind={KIND.tertiary}
            size={SIZE.compact}
            shape={SHAPE.square}
            onClick={onDeleteBtnClick}
            disabled={isBtnDisabled}
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
      {isProgressCompleted === false && (
        <ProgressBar
          value={progressValue}
          steps={1}
          size='small'
          successValue={100}
          overrides={{
            BarProgress: {
              style: {
                backgroundColor: '#112B42',
              },
            },
            BarContainer: {
              style: {
                marginLeft: 0,
                marginRight: 0,
                marginTop: 0,
                marginBottom: 0,
              },
            },
            Root: {
              style: {
                position: 'absolute',
                bottom: 0,
                width: '100%',
              },
            },
          }}
        />
      )}
    </Block>
  );
};

export default Attachment;
