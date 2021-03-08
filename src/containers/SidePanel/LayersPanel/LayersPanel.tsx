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
  const graphFlatten = useSelector((state) =>
    GraphSelectors.getGraphFlatten(state),
  );
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );

  const hiddenNodes = graphFlatten.nodes.length - graphVisible.nodes.length;
  const hiddenEdges = graphFlatten.edges.length - graphVisible.edges.length;

  return (
    <Fragment>
      <Header />
      <Block
        display='flex'
        justifyContent='space-between'
        marginLeft='scale600'
        width='260px'
      >
        <GraphStatistics
          nodeLength={graphVisible.nodes.length}
          edgeLength={graphVisible.edges.length}
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
      <Block marginBottom='scale1000' />
    </Fragment>
  );
};

export default LayersPanel;
