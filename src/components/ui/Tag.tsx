import * as React from 'react';
import { Tag, KIND, VARIANT } from 'baseui/tag';
import { StatefulTooltip, PLACEMENT, TRIGGER_TYPE } from 'baseui/tooltip';

export * from 'baseui/tag';

type TagValueProps = {
  value: string;
  title: string;
};

type TagRisk = {
  score: number;
  title: string;
};

const TagValue = ({ value, title }: TagValueProps) => {
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

const TagRisk = ({ score, title }: TagRisk) => {
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

export { TagValue, TagRisk };
