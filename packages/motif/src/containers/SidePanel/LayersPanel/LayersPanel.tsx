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
    <Block data-testid='layers-panel' $style={{ userSelect: 'none' }}>
      <Header />
      <Card>
        <Block display='flex' alignItems='end' marginBottom='scale400'>
          <HeadingXSmall
            marginTop={0}
            marginBottom={0}
            color='contentInverseSecondary'
            $style={{ letterSpacing: '1px' }}
          >
            DATA SOURCES
          </HeadingXSmall>
          <QuestionMarkTooltip
            tooltip={
              <Block width='190px'>
                <span>
                  Import data to get started or view your imported data in the
                  panel below.
                </span>
                <br />
                <br />
                <span>
                  You can group edges to combine multiple edges from the same
                  source and target node as a single edge. Add aggregations such
                  as max, min, or sum on properties of interest.
                </span>
              </Block>
            }
          />
        </Block>

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
