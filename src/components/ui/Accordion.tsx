// @ts-nocheck
import React from 'react';
import { useStyletron } from 'baseui';
import { ChevronDown, ChevronUp } from 'baseui/icon';
import { Accordion as BaseAccordion, Panel } from 'baseui/accordion';

type AccordionItem = {
  key: string;
  title: string;
  content: React.ReactNode;
};

export const Accordion = ({ items }: { items: AccordionItem[] }) => {
  const listItems = items.map((x) => {
    return (
      <Panel title={x.title} key={x.key}>
        {x.content}
      </Panel>
    );
  });

  return (
    <BaseAccordion
      overrides={{
        ToggleIcon: {
          // eslint-disable-next-line react/display-name
          component: ({ $expanded }: { $expanded: boolean }) =>
            $expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />,
        },
        Header: {
          style: ({ $theme }) => ({
            ...$theme.typography.LabelSmall,
            paddingTop: $theme.sizing.scale400,
            paddingBottom: $theme.sizing.scale400,
          }),
        },
      }}
    >
      {listItems}
    </BaseAccordion>
  );
};

export const Content = ({ children }: { children: React.ReactNode }) => {
  const [css] = useStyletron();
  return (
    <ul
      className={css({
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        maxHeight: '300px',
        overflowY: 'auto',
      })}
    >
      {children}
    </ul>
  );
};
