/* eslint-disable camelcase */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import isUndefined from 'lodash/isUndefined';
import { HeadingSmall, LabelMedium, ParagraphSmall } from 'baseui/typography';
import { ChevronLeft } from 'baseui/icon';
import { Button } from 'baseui/button';

import { Cell } from 'baseui/layout-grid';
import { FlushedGrid, Statistic, Hash } from '@blocklynx/ui';
import { clearDetails } from '../../redux/graphSlice';
import { RiskBarChart } from '../Charts';

import { CATEGORIES } from '../../utils/categories';
import {
  multiplyArr,
  timeConverter,
  processScoreVector,
  shortifyLabel,
} from '../../utils/utils';
import { getUI, getGraph } from '../../redux/accessors';

const InvestigateDetailed: React.FC<{}> = () => {
  const item = useSelector((state) => getGraph(state).detailedSelection).data;
  const currency = useSelector((state) => getUI(state).currency);
  const scoreLock = useSelector((state) => getUI(state).scoreLock);
  const timeLock = useSelector((state) => getUI(state).timeLock);
  const valueLock = useSelector((state) => getUI(state).valueLock);
  const score = useSelector((state) => getUI(state).score);
  const {
    getEdgeWidth,
    getEdgeSourceAdd,
    getEdgeTargetAdd,
    getEdgeTime,
    getEdgeScore,
  } = useSelector((state) => getGraph(state).getFns);

  const { label } = item;
  const fromAddress = isUndefined(getEdgeSourceAdd) ?
    item.source :
    getEdgeSourceAdd(item);
  const toAddress = isUndefined(getEdgeTargetAdd) ?
    item.target :
    getEdgeTargetAdd(item);
  const riskScore = scoreLock ?
    'NA' :
    multiplyArr(Object.values(getEdgeScore(item)), Object.values(score));
  const time = timeLock ? 'NA' : timeConverter(getEdgeTime(item));
  const headingTitle = `Transaction ${shortifyLabel(label)}...`;
  const valueTitle = valueLock ? 'NA' : `${getEdgeWidth(item)} ${currency}`;

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
          {!valueLock && <Statistic value={valueTitle} label="Value" />}
        </Cell>
        <Cell span={6}>
          {!scoreLock && (
            <Statistic
              value={Math.round(riskScore as number)}
              label="Risk Score"
            />
          )}
        </Cell>
      </FlushedGrid>
      <hr />
      <br />
      <LabelMedium>Sending Address</LabelMedium>
      <Hash text={fromAddress} />
      <LabelMedium>Receiving Address</LabelMedium>
      <Hash text={toAddress} />
      {!timeLock && (
        <>
          <LabelMedium>Time</LabelMedium>
          <ParagraphSmall>{time}</ParagraphSmall>
        </>
      )}
      {!scoreLock && (
        <>
          <LabelMedium>Source of Funds</LabelMedium>
          <div style={{ height: '180px' }}>
            <RiskBarChart
              title=""
              data={processScoreVector(CATEGORIES, getEdgeScore(item))}
            />
          </div>
        </>
      )}
    </>
  );
};

const BackButton: React.FC<{}> = () => {
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
