// @ts-nocheck
import React from 'react';
import { useStyletron } from 'baseui';
import { Accordion as BaseAccordion, Panel } from 'baseui/accordion';
import * as Icon from '../Icons';

export type AccordionProps = {
  items: AccordionItem[];
  icon?: React.ReactNode;
};

export type AccordionItem = {
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
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
        overflowY: 'auto',
      })}
    >
      {children}
    </ul>
  );
};

const Accordion = ({ items, icon }: AccordionProps) => {
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
            icon || <Icon.ChevronDown />,
        },
        Header: {
          style: ({ $theme }) => ({
            ...$theme.typography.LabelSmall,
            paddingTop: $theme.sizing.scale200,
            paddingLeft: $theme.sizing.scale600,
            paddingBottom: $theme.sizing.scale200,
            borderBottomStyle: 'none',
          }),
        },
        Content: {
          style: ({ $expanded, $theme }) => ({
            paddingTop: $expanded ? $theme.sizing.scale600 : 0,
            paddingBottom: $expanded ? $theme.sizing.scale600 : 0,
            paddingLeft: $theme.sizing.scale600,
            paddingRight: $theme.sizing.scale600,
            borderBottomWidth: 0,
          }),
        },
      }}
    >
      {listItems}
    </BaseAccordion>
  );
};

export default Accordion;
