import React, { FC, Fragment } from 'react';
import { Block } from 'baseui/block';
import { ParagraphSmall } from 'baseui/typography';
import { useDispatch } from 'react-redux';
import { useStyletron } from 'styletron-react';
import { ToggleAllButton } from '../../components/LayersPanelButtons';
import ToggleTokens from '../../../../../components/ToggleTokens';
import Accordion from '../../../../../components/Accordion';
import { GraphSlices, Selection } from '../../../../../redux/graph';
import QuestionMarkTooltip from '../../../../../components/FormSelectWithTooltip/QuestionMarkTooltip';

type EdgePropertiesProps = { haveData: boolean; edgeFields: Selection[] };
const EdgeProperties: FC<EdgePropertiesProps> = ({ haveData, edgeFields }) => {
  const dispatch = useDispatch();

  const isAllEdgeSelected = edgeFields.every(
    (f: Selection) => f.selected === true,
  );

  const onSelectAllEdgeToken = () => {
    dispatch(
      GraphSlices.updateAllEdgeSelection({ status: !isAllEdgeSelected }),
    );
  };

  const onClickEdgeToken = (index: number, status: boolean) => {
    dispatch(GraphSlices.updateEdgeSelection({ index, status }));
  };

  const [css] = useStyletron();

  return (
    <Accordion
      data-testid='edge-properties-accordion'
      title={
        <div className={css({ display: 'flex', alignItems: 'center' })}>
          EDGE PROPERTIES
          <QuestionMarkTooltip
            tooltip={
              <Block width='170px'>
                Overview of all the edge properties from imported data sources.
                Selected properties are shown when hovering over edges.
              </Block>
            }
          />
        </div>
      }
      expanded
      content={
        <Fragment>
          {haveData ? (
            <Block display='flex'>
              <ParagraphSmall marginTop={0} color='contentTertiary'>
                Select edge properties to display in tooltip
              </ParagraphSmall>
              <ToggleAllButton
                selected={isAllEdgeSelected}
                onClick={onSelectAllEdgeToken}
              />
            </Block>
          ) : (
            <ParagraphSmall marginTop={0}>
              Import data to get started.
            </ParagraphSmall>
          )}
          <ToggleTokens
            options={haveData ? edgeFields : []}
            onClick={onClickEdgeToken}
          />
        </Fragment>
      }
    />
  );
};

export default EdgeProperties;
