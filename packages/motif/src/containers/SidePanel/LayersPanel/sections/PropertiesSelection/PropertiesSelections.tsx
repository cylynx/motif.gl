import React from 'react';
import { Block } from 'baseui/block';
import { useSelector } from 'react-redux';
import { GraphSelectors } from '../../../../../redux/graph';
import NodeProperties from './NodeProperties';
import EdgeProperties from './EdgeProperties';

const PropertiesSelections = () => {
  const graphList = useSelector((state) => GraphSelectors.getGraphList(state));
  const { nodeSelection, edgeSelection } = useSelector((state) =>
    GraphSelectors.getGraph(state),
  );

  const isGraphListHaveData: boolean = graphList.length > 0;

  return (
    <>
      <Block marginTop='scale300'>
        <NodeProperties
          haveData={isGraphListHaveData}
          nodeFields={nodeSelection}
        />
      </Block>
      <Block marginTop='scale300'>
        <EdgeProperties
          haveData={isGraphListHaveData}
          edgeFields={edgeSelection}
        />
      </Block>
    </>
  );
};

export default PropertiesSelections;
