import React from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import {
  Accordion as BaseAccordion,
  AccordionOverrides,
  Panel,
} from 'baseui/accordion';
import * as Icon from '../Icons';

export type AccordionProps = {
  title: React.ReactNode;
  content: React.ReactNode;
  iconPosition?: 'left' | 'right';
  width?: 'full' | 'default';
  actionButtons?: React.ReactNode;
  expanded?: boolean;
  overrides?: AccordionOverrides;
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
  iconPosition = 'left',
  width = 'default',
  actionButtons = null,
  expanded = false,
  overrides,
}: AccordionProps) => {
  const BASE_ACCORDION_OVERRIDES: AccordionOverrides = {
    ToggleIcon: {
      component: () => {
        return iconPosition === 'left' ? (
          actionButtons
        ) : (
          <>
            {actionButtons}
            <Icon.ChevronDown />
          </>
        );
      },
    },
    Header: {
      style: ({ $theme, $expanded }) => ({
        ...$theme.typography.HeadingXSmall,
        color: $theme.colors.contentInverseSecondary,
        backgroundColor: $theme.colors.backgroundSecondary,
        paddingTop: $theme.sizing.scale300,
        paddingLeft: width === 'full' ? 0 : $theme.sizing.scale300,
        paddingRight: width === 'full' ? 0 : $theme.sizing.scale300,
        paddingBottom: $theme.sizing.scale300,
        borderBottomStyle: 'none',
        borderTopLeftRadius: $theme.borders.radius200,
        borderTopRightRadius: $theme.borders.radius200,
        borderBottomLeftRadius: $expanded ? '0px' : $theme.borders.radius200,
        borderBottomRightRadius: $expanded ? '0px' : $theme.borders.radius200,
        letterSpacing: '1px',
      }),
    },
    Content: {
      style: ({ $expanded, $theme }) => ({
        backgroundColor: $theme.colors.backgroundSecondary,
        paddingTop: $expanded ? $theme.sizing.scale500 : 0,
        paddingBottom: $expanded ? $theme.sizing.scale500 : 0,
        paddingLeft: width === 'full' ? 0 : $theme.sizing.scale300,
        paddingRight: width === 'full' ? 0 : $theme.sizing.scale300,
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
      <Panel
        title={
          <Block display='flex' alignItems='center'>
            {iconPosition === 'left' ? (
              <>
                <Icon.ChevronDown />
                <Block marginLeft='8px'>{title}</Block>
              </>
            ) : (
              title
            )}
          </Block>
        }
        initialState={{ expanded }}
      >
        {content}
      </Panel>
    </BaseAccordion>
  );
};

export default Accordion;
