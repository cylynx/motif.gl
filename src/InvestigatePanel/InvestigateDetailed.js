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
  roundToTwo,
  timeConverter,
  processScoreVector,
} from '../Utilities/utils';
import { getGraphInit, getGraph } from '../redux/accessors';

const InvestigateDetailed = () => {
  const detailedSelection = useSelector(
    state => getGraph(state).detailedSelection
  );
  const score = useSelector(state => getGraphInit(state).score);
  const { data } = detailedSelection.data;
  const riskScore = multiplyArr(
    Object.values(data.score_vector),
    Object.values(score)
  );
  const headingTitle = `Transaction ${data.txn_hash.substring(2, 7)}...`;
  const value = roundToTwo(data.value);

  return (
    <>
      <BackButton />
      <HeadingSmall marginTop="0">{headingTitle}</HeadingSmall>

      <div style={{ overflowWrap: 'break-word', width: '310px' }}>
        <Hash text={data.txn_hash} />
      </div>
      <br />
      <FlushedGrid>
        <Cell span={6}>
          <Statistic value={Math.round(riskScore)} label="Risk Score" />
        </Cell>
        <Cell span={6}>
          <Statistic value={`${value} ETH`} label="Value" />
        </Cell>
      </FlushedGrid>
      <hr />
      <br />
      <LabelMedium>Sending Address</LabelMedium>
      <Hash text={data.from_address} />
      <LabelMedium>Receiving Address</LabelMedium>
      <Hash text={data.to_address} />
      <LabelMedium>Block</LabelMedium>
      <ParagraphSmall>
        {`${data.blk_num}, ${timeConverter(data.blk_ts_unix)}`}
      </ParagraphSmall>
      <LabelMedium>Source of Funds</LabelMedium>
      <div style={{ height: '180px' }}>
        <RiskBarChart
          data={processScoreVector(CATEGORIES, data.score_vector)}
        />
      </div>
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
