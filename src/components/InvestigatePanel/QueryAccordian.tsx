import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { ChevronDown, ChevronUp } from 'baseui/icon';
import { Accordion, Panel } from 'baseui/accordion';
import { ListItem } from 'baseui/list';
import { GoInfo } from 'react-icons/go';
import { TagValue, TagRisk, SimpleTooltip } from '@blocklynx/ui';
import * as Graph from '../../types/Graph';
import { getDetails } from '../../redux/graphSlice';

import { multiplyArr, roundToTwo, shortifyLabel } from '../../utils/utils';
import { getGraph, getUI } from '../../redux/accessors';

const QueryAccordian: React.FC<{}> = () => {
  const [css, theme] = useStyletron();
  const graphList = useSelector((state) => getGraph(state).graphList);
  const listItems = graphList.map((query: Graph.Data, index: number) => {
    let title = `import ${index}`;
    if (query.metadata && query.metadata.title) {
      title = query.metadata.title;
    }
    return (
      <Panel title={title} key={title}>
        {query.edges.length > 0 && <QueryList items={query.edges} />}
      </Panel>
    );
  });

  return (
    <div
      className={css({
        // TODO: better approx top and bottom margin
        maxHeight: 'calc(100vh - 200px - 150px)',
        overflowY: 'scroll',
        '::-webkit-scrollbar-thumb': {
          backgroundColor: theme.colors.contentSecondary,
        },
      })}
    >
      <Accordion
        overrides={{
          ToggleIcon: {
            // eslint-disable-next-line react/display-name
            component: ({ $expanded }) =>
              ($expanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />),
          },
          Header: {
            style: ({ $theme }) => ({
              height: '50px',
              ...$theme.typography.LabelSmall,
            }),
          },
          Content: {
            style: {
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        }}
      >
        {graphList && listItems}
      </Accordion>
    </div>
  );
};

const QueryList = ({ items }) => {
  const [css, theme] = useStyletron();
  const dispatch = useDispatch();
  const currency = useSelector((state) => getUI(state).currency);
  const scoreLock = useSelector((state) => getUI(state).scoreLock);
  const valueLock = useSelector((state) => getUI(state).valueLock);
  const score = useSelector((state) => getUI(state).score);
  const { getEdgeWidth, getEdgeScore } = useSelector(
    (state) => getGraph(state).getFns,
  );
  const subList = items.map((item, index) => {
    const riskScore = scoreLock ?
      'NA' :
      multiplyArr(Object.values(getEdgeScore(item)), Object.values(score));
    const { label } = item;
    let value = 0;
    if (!valueLock) {
      value = getEdgeWidth(item);
    }
    const shortenedLabel = shortifyLabel(label);

    return (
      // TODO: add unique key (unique import id + txn hash + trace)
      // eslint-disable-next-line react/no-array-index-key
      <QueryListItem title={`import ${index}`} key={index}>
        <Block width="100%" display="flex" justifyContent="space-between">
          <div
            className={css({
              paddingTop: '7px',
            })}
          >
            <SimpleTooltip title={shortenedLabel} tooltip={label} />
          </div>
          {!valueLock && (
            <TagValue value={Math.round(value)} title={currency} />
          )}
          {!scoreLock && (
            <TagRisk
              score={Math.round(riskScore as number)}
              title={roundToTwo(riskScore as number)}
            />
          )}
          <InfoButton
            onClick={() => dispatch(getDetails({ type: 'txn', hash: item.id }))}
          />
        </Block>
      </QueryListItem>
    );
  });
  return (
    <ul
      className={css({
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        maxHeight: '300px',
        overflowY: 'scroll',
        '::-webkit-scrollbar-thumb': {
          backgroundColor: theme.colors.contentSecondary,
        },
      })}
    >
      {subList}
    </ul>
  );
};

// We want the List item to blend in with the side panel background
const QueryListItem = ({ children, ...rest }) => (
  <ListItem
    sublist
    overrides={{
      Root: {
        style: ({ $theme }) => ({
          backgroundColor: $theme.colors.backgroundSecondary,
        }),
      },
    }}
    {...rest}
  >
    {children}
  </ListItem>
);

const InfoButton = ({ onClick }) => (
  <Button size="compact" kind="tertiary" onClick={onClick} shape="square">
    <GoInfo />
  </Button>
);

export default QueryAccordian;
