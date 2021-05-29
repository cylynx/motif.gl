import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';

import ImportLayers from './sections/ImportLayers/ImportLayers';
import {
  ImportDataButton,
  ClearDataButton,
} from './components/LayersPanelButtons';

import { GraphSelectors } from '../../../redux/graph';
import Header from '../Header';
import GraphStatistics from './components/GraphStatistics';
import PropertiesSelections from './sections/PropertiesSelection';

const LayersPanel = () => {
  const ungroupGraphFlatten = useSelector((state) => {
    return GraphSelectors.getUngroupedGraphFlatten(state);
  });

  const graphFlatten = useSelector((state) =>
    GraphSelectors.getGraphFlatten(state),
  );

  const hiddenNodes =
    ungroupGraphFlatten.nodes.length - graphFlatten.nodes.length;
  const hiddenEdges =
    ungroupGraphFlatten.edges.length - graphFlatten.edges.length;

  return (
    <Block data-testid='layers-panel'>
      <Header />
      <Block
        display='flex'
        justifyContent='space-between'
        marginLeft='scale600'
        width='260px'
      >
        <GraphStatistics
          nodeLength={graphFlatten.nodes.length}
          edgeLength={graphFlatten.edges.length}
          hiddenNodeLength={hiddenNodes}
          hiddenEdgeLength={hiddenEdges}
        />
      </Block>
      <PropertiesSelections />
      <br />
      <hr />
      <Block width='100%' display='flex' justifyContent='space-between'>
        <ClearDataButton />
        <ImportDataButton />
      </Block>
      <ImportLayers />
      <Block marginBottom='scale300' />
    </Block>
  );
};

export default LayersPanel;
