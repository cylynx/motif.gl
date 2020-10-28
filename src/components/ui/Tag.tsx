import * as React from 'react';
import { Block } from 'baseui/block';
import { Tag, KIND, VARIANT } from 'baseui/tag';
import { StatefulTooltip, PLACEMENT, TRIGGER_TYPE } from 'baseui/tooltip';
import { VscSymbolKey } from 'react-icons/vsc';
import { BiAdjust, BiBracket, BiText, BiHash, BiTime } from 'react-icons/bi';

export * from 'baseui/tag';

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
  | 'array';

export type TagDataProps = {
  type?: TypeProps;
  title: string;
  closeable?: boolean;
};

export type TagRisk = {
  score: number;
  title: string;
};

export const getIcon = (type: TypeProps) => {
  switch (type) {
    case 'boolean':
      return <BiAdjust size='14px' style={{ paddingRight: '8px' }} />;
    case 'date':
      return <BiTime size='14px' style={{ paddingRight: '8px' }} />;
    case 'integer':
      return <BiHash size='14px' style={{ paddingRight: '8px' }} />;
    case 'real':
      return <BiHash size='14px' style={{ paddingRight: '8px' }} />;
    case 'string':
      return <VscSymbolKey size='16px' style={{ paddingRight: '8px' }} />;
    case 'timestamp':
      return <BiTime size='14px' style={{ paddingRight: '8px' }} />;
    case 'array':
      return <BiBracket size='14px' style={{ paddingRight: '8px' }} />;
    default:
      return <BiBracket size='0px' />;
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

export const TagData = ({
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

export const TagRisk = ({ score, title }: TagRisk) => {
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
