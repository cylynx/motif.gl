import React, { FC, useMemo, MouseEvent } from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { normalizeColor } from '../../utils/style-utils/color-utils';
import { GraphAttributeColourProps, ObjectColourProps } from './type';

const ObjectColours: FC<ObjectColourProps> = ({
  label,
  kind,
  onClick,
  backgroundColor,
  disableClick,
}) => {
  const graphAttribute = useMemo(() => {
    const isLabelUndefined = label === 'undefined';
    const isDisable = disableClick || isLabelUndefined;

    if (kind === 'node') {
      return (
        <NodeColour
          onClick={onClick}
          backgroundColor={backgroundColor}
          disableClick={isDisable}
        />
      );
    }

    return (
      <EdgeColour
        onClick={onClick}
        backgroundColor={backgroundColor}
        disableClick={isDisable}
      />
    );
  }, [kind, backgroundColor, onClick]);

  return (
    <Block display='flex' alignItems='center' height='24px'>
      {graphAttribute}
      <LabelSmall>{label}</LabelSmall>
    </Block>
  );
};

const NodeColour: FC<GraphAttributeColourProps> = ({
  onClick,
  backgroundColor,
  disableClick,
}) => {
  const [css] = useStyletron();
  const color = normalizeColor(backgroundColor);

  const onDivClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disableClick) return;

    onClick(e);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      aria-label='Node Colour Picker'
      onClick={onDivClick}
      className={css({
        height: '14px',
        width: '14px',
        marginRight: '6px',
        marginTop: '4px',
        marginBottom: '4px',
        backgroundColor: color.dark,
        borderRadius: '50%',
        cursor: disableClick ? 'initial' : 'pointer',
        borderColor: color.normal,
        borderWidth: '3px',
        borderStyle: 'solid',
      })}
    />
  );
};

const EdgeColour: FC<GraphAttributeColourProps> = ({
  onClick,
  backgroundColor,
  disableClick,
}) => {
  const [css] = useStyletron();

  const onDivClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disableClick) return;

    onClick(e);
  };

  return (
    <div
      role='button'
      tabIndex={0}
      aria-label='Edge Colour Picker'
      onClick={onDivClick}
      className={css({
        height: '8px',
        width: '24px',
        marginRight: '6px',
        marginTop: '4px',
        marginBottom: '4px',
        backgroundColor,
        cursor: disableClick ? 'initial' : 'pointer',
      })}
    />
  );
};

export default ObjectColours;
