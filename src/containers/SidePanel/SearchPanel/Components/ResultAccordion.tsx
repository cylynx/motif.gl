import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
import Accordion from '../../../../components/Accordion';
import * as Icon from '../../../../components/Icons';
import { EdgeNode } from '../../../../redux/graph';
import { flattenObject } from '../../../../redux/graph/processors/data';

type ResultAccordionProps = {
  results: EdgeNode[];
  expanded: boolean;
};

const ResultAccordion = ({
  results,
  expanded = false,
}: ResultAccordionProps) => {
  const items = useMemo(
    () =>
      results.map((result: EdgeNode) => {
        const { id, comboId, style, defaultStyle, ...omittedResult } = result;

        const title: JSX.Element = (
          <Block
            display='flex'
            justifyContent='center'
            $style={{ textTransform: 'capitalize' }}
            key={id}
          >
            {id}
          </Block>
        );

        const properties = flattenObject(omittedResult);
        const tableRows: JSX.Element[] = Object.entries(properties).map(
          (property) => {
            const [key, value] = property as [string, any];

            return (
              <tr key={key}>
                <th style={{ width: '35%', textTransform: 'lowercase' }}>
                  {key}
                </th>
                <td style={{ width: '65%', verticalAlign: 'top' }}>{value}</td>
              </tr>
            );
          },
        );

        const tableContent: JSX.Element = (
          <table id={id} style={{ fontSize: '12px' }} key={id}>
            <tbody>{tableRows}</tbody>
          </table>
        );

        return {
          title,
          key: id,
          content: tableContent,
          expanded,
        };
      }),
    [results],
  );

  return (
    <Accordion
      overrides={{
        Content: {
          style: ({ $expanded, $theme }) => ({
            paddingTop: $expanded ? $theme.sizing.scale300 : 0,
            paddingBottom: $expanded ? $theme.sizing.scale300 : 0,
            paddingLeft: $theme.sizing.scale300,
            paddingRight: $theme.sizing.scale300,
            backgroundColor: '#323742',
            color: $theme.colors.mono200,
            borderBottomWidth: 0,
          }),
        },
        Header: {
          style: ({ $theme }) => ({
            ...$theme.typography.ParagraphSmall,
            textTransform: 'capitalize',
            paddingLeft: $theme.sizing.scale300,
            paddingRight: $theme.sizing.scale300,
            paddingTop: $theme.sizing.scale200,
            paddingBottom: $theme.sizing.scale200,
            backgroundColor: $theme.colors.backgroundSecondary,
            color: $theme.colors.backgroundInverseSecondary,
            borderBottomStyle: 'none',
          }),
        },
        PanelContainer: {
          style: ({ $theme }) => ({
            marginBottom: $theme.sizing.scale500,
          }),
        },
        ToggleIcon: {
          component: () => {
            return <Icon.ChevronDown />;
          },
        },
      }}
      items={items}
    />
  );
};

export default ResultAccordion;
