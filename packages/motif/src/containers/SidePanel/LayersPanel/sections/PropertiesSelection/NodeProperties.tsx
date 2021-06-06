import React, { FC, Fragment } from 'react';
import { Block } from 'baseui/block';
import { ParagraphSmall } from 'baseui/typography';
import { useDispatch } from 'react-redux';
import * as Icon from '../../../../../components/Icons';
import { ToggleAllButton } from '../../components/LayersPanelButtons';
import ToggleTokens from '../../../../../components/ToggleTokens';
import Accordion from '../../../../../components/Accordion';
import { GraphSlices, Selection } from '../../../../../redux/graph';

type NodePropertiesProps = { haveData: boolean; nodeFields: Selection[] };
const NodeProperties: FC<NodePropertiesProps> = ({ haveData, nodeFields }) => {
  const isAllNodeSelected = nodeFields.every(
    (f: Selection) => f.selected === true,
  );

  const onSelectAllNodeToken = () => {
    dispatch(
      GraphSlices.updateAllNodeSelection({ status: !isAllNodeSelected }),
    );
  };

  const dispatch = useDispatch();
  const onClickNodeToken = (index: number, status: boolean) => {
    dispatch(GraphSlices.updateNodeSelection({ index, status }));
  };

  return (
    <Accordion
      data-testid='node-properties-accordion'
      title='NODE PROPERTIES'
      expanded
      content={
        <Fragment>
          {haveData ? (
            <Block display='flex'>
              <ParagraphSmall marginTop={0} color='contentTertiary'>
                Select node properties to display in tooltip
              </ParagraphSmall>
              <ToggleAllButton
                selected={isAllNodeSelected}
                onClick={onSelectAllNodeToken}
              />
            </Block>
          ) : (
            <ParagraphSmall marginTop={0}>
              Import data to get started.
            </ParagraphSmall>
          )}
          <ToggleTokens
            options={haveData ? nodeFields : []}
            onClick={onClickNodeToken}
          />
        </Fragment>
      }
    />
  );
};

export default NodeProperties;
