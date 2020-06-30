/* eslint-disable camelcase */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
} from '../Utilities/utils';
import { getGraphInit, getGraph } from '../redux/accessors';

const InvestigateDetailed = () => {
  const item = useSelector(state => getGraph(state).detailedSelection).data;
  const currency = useSelector(state => getGraphInit(state).currency);
  const scoreLock = useSelector(state => getGraphInit(state).scoreLock);
  const score = useSelector(state => getGraphInit(state).score);
  let riskScore = 0;
  if (!scoreLock) {
    riskScore = multiplyArr(
      Object.values(item.data.score_vector),
      Object.values(score)
    );
  }

  const {
    value,
    label,
    from_address,
    to_address,
    blk_num,
    blk_ts_unix,
  } = item.data;
  const headingTitle = `Transaction ${label.substring(0, 6)}...`;
  const valueTitle = `${value} ${currency}`;
  let blockTitle = '';
  if (blk_num) {
    blockTitle = `${blk_num}, ${timeConverter(blk_ts_unix)}`;
  } else {
    blockTitle = timeConverter(blk_ts_unix);
  }
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
      <Hash text={from_address} />
      <LabelMedium>Receiving Address</LabelMedium>
      <Hash text={to_address} />
      <LabelMedium>Block</LabelMedium>
      <ParagraphSmall>{blockTitle}</ParagraphSmall>
      {!scoreLock && (
        <>
          <LabelMedium>Source of Funds</LabelMedium>
          <div style={{ height: '180px' }}>
            <RiskBarChart
              data={processScoreVector(CATEGORIES, item.data.score_vector)}
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
