/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';
import { HeadingSmall, LabelMedium, ParagraphSmall } from 'baseui/typography';
import { ChevronLeft } from 'baseui/icon';
import { Button } from 'baseui/button';

import { Cell } from 'baseui/layout-grid';
import { FlushedGrid, Statistic, Hash } from '../ui';
import { clearDetails } from '../../redux/graph-slice';
import { RiskBarChart } from '../Charts';

import { CATEGORIES } from '../../utils/categories';
import { timeConverter, shortifyLabel } from '../../utils/utils';
import { getUI, getGraph, getAccessors } from '../../redux';

const InvestigateDetailed = () => {
  const item = useSelector((state) => getGraph(state).detailedSelection).data;
  const currency = useSelector((state) => getUI(state).currency);
  const timeLock = useSelector((state) => getUI(state).timeLock);
  const { edgeStyle, edgeTime } = useSelector((state) => getAccessors(state));

  const { label } = item;
  const time = timeLock ? 'NA' : timeConverter(get(item, edgeTime));
  const headingTitle = `Transaction ${shortifyLabel(label)}...`;

  return (
    <Fragment>
      <BackButton />
      <HeadingSmall marginTop='0'>Temp</HeadingSmall>
      {/* <div style={{ overflowWrap: 'break-word', width: '310px' }}>
        <Hash text={label} />
      </div>
      <br />
      <FlushedGrid>
        <Cell span={6}>
          {!valueLock && <Statistic value={valueTitle} label='Value' />}
        </Cell>
        <Cell span={6}>
          {!scoreLock && (
            <Statistic
              value={Math.round(riskScore as number)}
              label='Risk Score'
            />
          )}
        </Cell>
      </FlushedGrid>
      <hr />
      <br />
      <LabelMedium>Sending Address</LabelMedium>
      <Hash text='sender' />
      <LabelMedium>Receiving Address</LabelMedium>
      <Hash text='receiver' />
      {!timeLock && (
        <Fragment>
          <LabelMedium>Time</LabelMedium>
          <ParagraphSmall>{time}</ParagraphSmall>
        </Fragment>
      )}
      {!scoreLock && (
        <Fragment>
          <LabelMedium>Source of Funds</LabelMedium>
          <div style={{ height: '180px' }}>
            <RiskBarChart
              title=''
              // @ts-ignore - Bug here needs to be fixed when removing getEdgeScore
              data={processScoreVector(CATEGORIES, edgeScore(item))}
            />
          </div>
        </Fragment>
      )} */}
    </Fragment>
  );
};

const BackButton = () => {
  const dispatch = useDispatch();
  return (
    <Button
      startEnhancer={() => <ChevronLeft size={24} />}
      kind='tertiary'
      size='compact'
      onClick={() => dispatch(clearDetails())}
      overrides={{
        BaseButton: {
          style: {
            paddingLeft: 0,
          },
        },
      }}
    >
      Back
    </Button>
  );
};

export default InvestigateDetailed;
