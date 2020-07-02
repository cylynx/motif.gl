/* eslint-disable camelcase */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import { HeadingSmall, LabelMedium, ParagraphSmall } from 'baseui/typography';
import { ChevronLeft } from 'baseui/icon';
import { Button } from 'baseui/button';

import { Cell } from 'baseui/layout-grid';
import { FlushedGrid, Statistic, Hash } from '@blocklynx/ui';
import { clearDetails } from '../redux/graphSlice';
import { RiskBarChart } from '../Charts';

import { CATEGORIES } from '../Utilities/categories';
import {
  multiplyArr,
  timeConverter,
  processScoreVector,
  shortifyLabel,
} from '../Utilities/utils';
import { getGraphInit, getGraph } from '../redux/accessors';

const InvestigateDetailed = () => {
  const item = useSelector(state => getGraph(state).detailedSelection).data;
  const currency = useSelector(state => getGraphInit(state).currency);
  const scoreLock = useSelector(state => getGraphInit(state).scoreLock);
  const score = useSelector(state => getGraphInit(state).score);
  const {
    getEdgeValue,
    getEdgeSourceAdd,
    getEdgeTargetAdd,
    getEdgeTime,
    getEdgeScore,
  } = useSelector(state => getGraph(state).getFns);
  let riskScore = 0;
  if (!scoreLock) {
    riskScore = multiplyArr(
      Object.values(getEdgeScore(item)),
      Object.values(score)
    );
  }
  const value = getEdgeValue(item);
  const { label } = item;
  const fromAddress = isUndefined(getEdgeSourceAdd)
    ? item.source
    : getEdgeSourceAdd(item);
  const toAddress = isUndefined(getEdgeTargetAdd)
    ? item.target
    : getEdgeTargetAdd(item);
  const time = timeConverter(getEdgeTime(item));
  const headingTitle = `Transaction ${shortifyLabel(label)}...`;
  // Value will not be displayed if it does not exists
  const valueTitle = value ? `${value} ${currency}` : 'NA';

  return (
    <>
      <BackButton />
      <HeadingSmall marginTop="0">{headingTitle}</HeadingSmall>
      <div style={{ overflowWrap: 'break-word', width: '310px' }}>
        <Hash text={label} />
      </div>
      <br />
      <FlushedGrid>
        <Cell span={6}>
          <Statistic value={valueTitle} label="Value" />
        </Cell>
        <Cell span={6}>
          {!scoreLock && (
            <Statistic value={Math.round(riskScore)} label="Risk Score" />
          )}
        </Cell>
      </FlushedGrid>
      <hr />
      <br />
      <LabelMedium>Sending Address</LabelMedium>
      <Hash text={fromAddress} />
      <LabelMedium>Receiving Address</LabelMedium>
      <Hash text={toAddress} />
      <LabelMedium>Time</LabelMedium>
      <ParagraphSmall>{time}</ParagraphSmall>
      {!scoreLock && (
        <>
          <LabelMedium>Source of Funds</LabelMedium>
          <div style={{ height: '180px' }}>
            <RiskBarChart
              data={processScoreVector(CATEGORIES, getEdgeScore(item))}
            />
          </div>
        </>
      )}
    </>
  );
};

const BackButton = () => {
  const dispatch = useDispatch();
  return (
    <Button
      startEnhancer={() => <ChevronLeft size={24} />}
      kind="tertiary"
      size="compact"
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
