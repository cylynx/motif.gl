import React, { FC, Fragment } from 'react';
import { Block } from 'baseui/block';
import { ParagraphSmall } from 'baseui/typography';
import { useDispatch } from 'react-redux';
import * as Icon from '../../../../../components/Icons';
import { ToggleAllButton } from '../../components/LayersPanelButtons';
import ToggleTokens from '../../../../../components/ToggleTokens';
import Accordion from '../../../../../components/Accordion';
import { GraphSlices, Selection } from '../../../../../redux/graph';

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

  return (
    <Accordion
      data-testid='edge-properties-accordion'
      title='EDGE PROPERTIES'
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
