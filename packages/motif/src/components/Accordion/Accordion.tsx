// @ts-nocheck
import React, { useState } from 'react';
import { useStyletron } from 'baseui';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import {
  Accordion as BaseAccordion,
  AccordionOverrides,
  SharedProps,
  StatefulPanel,
} from 'baseui/accordion';
import * as Icon from '../Icons';

export type AccordionProps = {
  title: React.ReactNode;
  content: React.ReactNode;
  actionButtons?: React.ReactNode;
  expanded?: boolean;
  overrides?: AccordionOverrides<SharedProps>;
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

const Accordion = ({
  title,
  content,
  actionButtons = null,
  expanded = false,
  overrides,
}: AccordionProps) => {
  const BASE_ACCORDION_OVERRIDES: AccordionOverrides<SharedProps> = {
    ToggleIcon: {
      component: () => actionButtons,
    },
    Header: {
      style: ({ $theme, $expanded }) => ({
        ...$theme.typography.HeadingXSmall,
        color: $theme.colors.contentTertiary,
        backgroundColor: $theme.colors.backgroundSecondary,
        paddingTop: $theme.sizing.scale300,
        paddingLeft: $theme.sizing.scale600,
        paddingBottom: $theme.sizing.scale300,
        borderBottomStyle: 'none',
        borderTopLeftRadius: $theme.borders.radius200,
        borderTopRightRadius: $theme.borders.radius200,
        borderBottomLeftRadius: $expanded ? '0px' : $theme.borders.radius200,
        borderBottomRightRadius: $expanded ? '0px' : $theme.borders.radius200,
      }),
    },
    Content: {
      style: ({ $expanded, $theme }) => ({
        backgroundColor: $theme.colors.backgroundSecondary,
        paddingTop: $expanded ? $theme.sizing.scale500 : 0,
        paddingBottom: $expanded ? $theme.sizing.scale500 : 0,
        paddingLeft: $theme.sizing.scale600,
        paddingRight: $theme.sizing.scale600,
        borderBottomLeftRadius: $theme.borders.radius200,
        borderBottomRightRadius: $theme.borders.radius200,
        borderBottomWidth: 0,
      }),
    },
    PanelContainer: {
      style: {
        borderBottomStyle: 'none',
      },
    },
  };

  return (
    <BaseAccordion overrides={overrides ?? BASE_ACCORDION_OVERRIDES}>
      <StatefulPanel
        title={
          <Block display='flex' alignItems='center'>
            <Icon.ChevronDown />
            <Block marginLeft='8px'>{title}</Block>
          </Block>
        }
        initialState={{ expanded }}
      >
        {content}
      </StatefulPanel>
    </BaseAccordion>
  );
};

export default Accordion;
