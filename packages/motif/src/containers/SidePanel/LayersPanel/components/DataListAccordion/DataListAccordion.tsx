import React, { FC } from 'react';
import { Theme } from 'baseui/theme';
import Accordion, { AccordionItem } from '../../../../../components/Accordion';
import * as Icon from '../../../../../components/Icons';

type DataListAccordionProps = { items: AccordionItem[] };

type TNormalStyle = { $theme: Theme };
const HeaderStyle = ({ $theme }: TNormalStyle) => ({
  ...$theme.typography.LabelSmall,
  paddingTop: $theme.sizing.scale200,
  paddingLeft: $theme.sizing.scale500,
  paddingBottom: $theme.sizing.scale200,
  paddingRight: $theme.sizing.scale500,
  borderBottomStyle: 'none',
});

type TContentStyle = { $theme: Theme; $expanded: boolean | undefined };
const ContentStyle = ({ $theme, $expanded }: TContentStyle) => ({
  paddingTop: $expanded ? $theme.sizing.scale400 : 0,
  paddingBottom: $expanded ? $theme.sizing.scale400 : 0,
  paddingLeft: $theme.sizing.scale200,
  paddingRight: $theme.sizing.scale200,
  marginBottom: $theme.sizing.scale400,
  borderBottomWidth: 0,
});

const DataListAccordion: FC<DataListAccordionProps> = ({ items }) => {
  return (
    <Accordion
      items={items}
      overrides={{
        ToggleIcon: {
          // @ts-ignore
          component: () => <Icon.ChevronDown />,
        },
        Header: {
          // @ts-ignore
          style: HeaderStyle,
        },
        Content: {
          // @ts-ignore
          style: ContentStyle,
        },
      }}
    />
  );
};

export default DataListAccordion;
