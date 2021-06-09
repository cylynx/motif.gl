import React from 'react';
import { useStyletron } from 'baseui';
import { HeadingXSmall } from 'baseui/typography';
import { Block } from 'baseui/block';

import ImportLayers from './sections/ImportLayers';
import { ImportDataButton } from './components/LayersPanelButtons';
import Header from '../Header';
import PropertiesSelections from './sections/PropertiesSelection';
import { Card } from '../../../components/ui';
import QuestionMarkTooltip from '../../../components/ui/QuestionMarkTooltip';

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
          DATA SOURCES{' '}
          <QuestionMarkTooltip
            tooltip={
              <Block width='180px'>
                Import data to get started or view your imported data in the
                panel below.
                {'\n'}
                You can group edges to combine multiple edges from the same
                source and target node as a single edge. Add aggregations such
                as max, min, or sum on properties of interest.
              </Block>
            }
          />
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
