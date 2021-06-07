import React from 'react';
import { useStyletron } from 'baseui';
import { HeadingXSmall } from 'baseui/typography';
import { Block } from 'baseui/block';

import ImportLayers from './sections/ImportLayers';
import { ImportDataButton } from './components/LayersPanelButtons';
import Header from '../Header';
import PropertiesSelections from './sections/PropertiesSelection';
import { Card } from '../../../components/ui';

const LayersPanel = () => {
  const [css, theme] = useStyletron();

  return (
    <Block data-testid='layers-panel'>
      <Header />
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
