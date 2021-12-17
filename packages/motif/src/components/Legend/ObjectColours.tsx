import React, { FC, useMemo } from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { GraphAttributeColourProps, ObjectColourProps } from './type';

const ObjectColours: FC<ObjectColourProps> = ({
  kind,
  onClick,
  backgroundColor,
  value,
}) => {
  const graphAttribute = useMemo(() => {
    if (kind === 'node') {
      return <NodeColour onClick={onClick} backgroundColor={backgroundColor} />;
    }

    return <EdgeColour onClick={onClick} backgroundColor={backgroundColor} />;
  }, [kind, backgroundColor, onClick]);

  return (
    <Block display='flex' alignItems='center' height='24px'>
      {graphAttribute}
      <LabelSmall>{value}</LabelSmall>
    </Block>
  );
};

const NodeColour: FC<GraphAttributeColourProps> = ({
  onClick,
  backgroundColor,
}) => {
  const [css] = useStyletron();
  return (
    <div
      role='button'
      tabIndex={0}
      aria-label='Node Colour Picker'
      onClick={onClick}
      className={css({
        height: '16px',
        width: '16px',
        marginRight: '6px',
        marginTop: '4px',
        marginBottom: '4px',
        backgroundColor,
        borderRadius: '50%',
        cursor: 'pointer',
      })}
    />
  );
};

const EdgeColour: FC<GraphAttributeColourProps> = ({
  onClick,
  backgroundColor,
}) => {
  const [css] = useStyletron();
  return (
    <div
      role='button'
      tabIndex={0}
      aria-label='Edge Colour Picker'
      onClick={onClick}
      className={css({
        height: '8px',
        width: '24px',
        marginRight: '6px',
        marginTop: '4px',
        marginBottom: '4px',
        backgroundColor,
        cursor: 'pointer',
      })}
    />
  );
};

export default ObjectColours;
