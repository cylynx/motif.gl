import React from 'react';
import { useStyletron } from 'baseui';
import { useSelector } from 'react-redux';
import { HeadingXSmall } from 'baseui/typography';
import { Block } from 'baseui/block';

import ImportLayers from './sections/ImportLayers';
import { ImportDataButton } from './components/LayersPanelButtons';

import { GraphSelectors } from '../../../redux/graph';
import Header from '../Header';
import GraphStatistics from './components/GraphStatistics';
import PropertiesSelections from './sections/PropertiesSelection';
import { Card } from '../../../components/ui';

const LayersPanel = () => {
  const [css, theme] = useStyletron();
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
      {/* <Block
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
      </Block> */}
      <Card>
        <HeadingXSmall
          marginTop={0}
          marginBottom='scale400'
          color='contentInverseSecondary'
          $style={{ letterSpacing: '1px' }}
        >
          DATA SOURCES
        </HeadingXSmall>
        <ImportDataButton />
        <hr
          className={css({ borderColor: theme.colors.contentInverseSecondary })}
        />
        <ImportLayers />
      </Card>
      <PropertiesSelections />
      <Block marginBottom='scale300' />
    </Block>
  );
};

export default LayersPanel;
