import * as React from 'react';
import { colors } from 'baseui/tokens';
import { Block } from 'baseui/block';
import { Tag, KIND, VARIANT } from 'baseui/tag';
import { StatefulTooltip, PLACEMENT, TRIGGER_TYPE } from 'baseui/tooltip';
import * as Icon from '../Icons';

export type TagValueProps = {
  value: string;
  title: string;
};

export type TypeProps =
  | 'boolean'
  | 'date'
  | 'integer'
  | 'real'
  | 'string'
  | 'timestamp'
  | 'array'
  | 'nodes'
  | 'edges'
  | string;

export type TagDataProps = {
  type?: TypeProps;
  title: string;
  closeable?: boolean;
};

export type TagRiskProps = {
  score: number;
  title: string;
};

export const getIcon = (type: TypeProps) => {
  switch (type) {
    case 'boolean':
      return (
        <Icon.Adjust
          size={14}
          color={colors.brown400}
          style={{ paddingRight: '8px' }}
        />
      );
    case 'date':
      return (
        <Icon.Time
          size={14}
          color={colors.green400}
          style={{ paddingRight: '8px' }}
        />
      );
    case 'integer':
      return (
        <Icon.Hash
          size={14}
          color={colors.yellow400}
          style={{ paddingRight: '8px' }}
        />
      );
    case 'real':
      return (
        <Icon.Hash
          size={14}
          color={colors.yellow400}
          style={{ paddingRight: '8px' }}
        />
      );
    case 'string':
      return (
        <Icon.Symbol
          size={16}
          color={colors.blue400}
          style={{ paddingRight: '8px' }}
        />
      );
    case 'timestamp':
      return (
        <Icon.Time
          size={14}
          color={colors.green400}
          style={{ paddingRight: '8px' }}
        />
      );
    case 'array':
      return (
        <Icon.Bracket
          size={14}
          color={colors.purple400}
          style={{ paddingRight: '8px' }}
        />
      );
    case 'nodes':
      return <Icon.Node size={12} style={{ paddingRight: '8px' }} />;
    case 'edges':
      return <Icon.Edge size={12} style={{ paddingRight: '8px' }} />;
    default:
      return <Icon.Bracket color={colors.gray600} size={0} />;
  }
};

export const getColor = (type: TypeProps) => {
  switch (type) {
    case 'boolean':
      return KIND.brown;
    case 'date':
      return KIND.green;
    case 'integer':
      return KIND.yellow;
    case 'real':
      return KIND.yellow;
    case 'string':
      return KIND.blue;
    case 'timestamp':
      return KIND.green;
    case 'array':
      return KIND.purple;
    default:
      return KIND.black;
  }
};

const TagData = ({
  type = 'string',
  title,
  closeable = true,
}: TagDataProps) => {
  return (
    <Tag
      closeable={closeable}
      kind={getColor(type)}
      variant={VARIANT.solid}
      title={`${type}, ${title}`}
    >
      <Block display='flex' alignItems='center'>
        {getIcon(type)}
        {title}
      </Block>
    </Tag>
  );
};

export const TagValue = ({ value, title }: TagValueProps) => {
  return (
    <StatefulTooltip
      content={`Currency: ${title}`}
      placement={PLACEMENT.top}
      triggerType={TRIGGER_TYPE.hover}
      showArrow
      ignoreBoundary
    >
      <span>
        <Tag
          closeable={false}
          kind={KIND.accent}
          variant={VARIANT.light}
          title={title || value}
        >
          {value}
        </Tag>
      </span>
    </StatefulTooltip>
  );
};

export const TagRisk = ({ score, title }: TagRiskProps) => {
  const content = `Risk Score: ${title}`;
  let kind = KIND.positive;
  if (score >= 75) {
    // @ts-ignore
    kind = KIND.negative;
  } else if (score >= 25) {
    // @ts-ignore
    kind = KIND.warning;
  }
  return (
    <StatefulTooltip
      content={content}
      placement={PLACEMENT.top}
      triggerType={TRIGGER_TYPE.hover}
      showArrow
      ignoreBoundary
    >
      <span>
        <Tag closeable={false} kind={kind} variant={VARIANT.solid}>
          {score}
        </Tag>
      </span>
    </StatefulTooltip>
  );
};

export default TagData;
