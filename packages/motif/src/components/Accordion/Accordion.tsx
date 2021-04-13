// @ts-nocheck
import React from 'react';
import { useStyletron } from 'baseui';
import {
  Accordion as BaseAccordion,
  AccordionOverrides,
  SharedProps,
  StatefulPanel,
} from 'baseui/accordion';
import * as Icon from '../Icons';

export type AccordionProps = {
  items: AccordionItem[];
  icon?: React.ReactNode;
  overrides?: AccordionOverrides<SharedProps>;
};

export type AccordionItem = {
  key?: string | number;
  title: React.ReactNode;
  content: React.ReactNode;
  expanded?: boolean;
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

const Accordion = ({ items, icon, overrides }: AccordionProps) => {
  const listItems = items.map((x) => {
    return (
      <StatefulPanel
        title={x.title}
        key={x.key}
        initialState={{ expanded: x.expanded || false }}
      >
        {x.content}
      </StatefulPanel>
    );
  });

  const BASE_ACCORDION_OVERRIDES: AccordionOverrides<SharedProps> = {
    ToggleIcon: {
      // eslint-disable-next-line react/display-name
      component: ({ $expanded }: { $expanded: boolean }) =>
        icon || <Icon.ChevronDown />,
    },
    Header: {
      style: ({ $theme }) => ({
        ...$theme.typography.LabelSmall,
        paddingTop: $theme.sizing.scale300,
        paddingLeft: $theme.sizing.scale600,
        paddingBottom: $theme.sizing.scale300,
        borderBottomStyle: 'none',
      }),
    },
    Content: {
      style: ({ $expanded, $theme }) => ({
        paddingTop: $expanded ? $theme.sizing.scale500 : 0,
        paddingBottom: $expanded ? $theme.sizing.scale500 : 0,
        paddingLeft: $theme.sizing.scale600,
        paddingRight: $theme.sizing.scale600,
        borderBottomWidth: 0,
      }),
    },
  };

  return (
    <BaseAccordion overrides={overrides ?? BASE_ACCORDION_OVERRIDES}>
      {listItems}
    </BaseAccordion>
  );
};

export default Accordion;
