import React, { FC, MouseEvent } from 'react';
import { withStyle } from 'baseui';
import { ALIGNMENT, Cell, Grid } from 'baseui/layout-grid';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { Spinner } from 'baseui/spinner';
import { HeadingSmall, ParagraphSmall } from 'baseui/typography';

import { useDispatch, useSelector } from 'react-redux';
import { SampleData, SampleDataItem } from './types';
import { GraphSelectors, GraphThunks, JsonImport } from '../../../redux/graph';
import { UISelectors } from '../../../redux/ui';
import { defaultAccessors, sampleData } from './constant';
import useNodeStyle from '../../../redux/graph/hooks/useNodeStyle';
import useLayout from '../../../redux/graph/hooks/useLayout';

const ExtraLargeSpinner = withStyle(Spinner, {
  width: '48px',
  height: '48px',
  borderLeftWidth: '8px',
  borderRightWidth: '8px',
  borderTopWidth: '8px',
  borderBottomWidth: '8px',
});

const CenterSpinner = () => (
  <Block justifyContent='center' display='flex'>
    <ExtraLargeSpinner />
  </Block>
);

const ImportSampleData = (): JSX.Element => {
  const { loading } = useSelector((state) => UISelectors.getUI(state));

  return loading ? (
    <CenterSpinner />
  ) : (
    <Grid
      gridGaps={8}
      gridColumns={[2, 3, 3]}
      align={ALIGNMENT.center}
      overrides={{
        Grid: {
          style: {
            overflowY: 'auto',
            maxHeight: 'calc(67vh - 25px)',
            minHeight: 'calc(67vh - 25px)',
          },
        },
      }}
    >
      {sampleData.map((item: SampleDataItem) => (
        <Cell key={item.key} data-testid={item.key}>
          <Block display='flex' justifyContent='center'>
            <StyledItem item={item} />
          </Block>
        </Cell>
      ))}
    </Grid>
  );
};

type StyledItemProps = { item: SampleDataItem };
const StyledItem: FC<StyledItemProps> = ({ item }): JSX.Element => {
  const dispatch = useDispatch();
  const nodeOptions = useSelector(
    (state) => GraphSelectors.getStyleOptions(state).nodeStyle,
  );
  const { switchToFixNodeColor } = useNodeStyle();
  const { changeGraphLayout } = useLayout();

  const trySampleData = (
    item: SampleDataItem,
    e: MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();

    if (nodeOptions.color.id === 'legend') {
      switchToFixNodeColor();
    }

    // These two datasets come with x-y coordinates
    if (item.key === SampleData.AA || item.key === SampleData.NETWORK) {
      changeGraphLayout({ layout: { id: 'preset' } });
      Promise.resolve(item.data()).then((d: void) => {
        const sampleDataset: JsonImport = d;
        dispatch(GraphThunks.importSampleData(sampleDataset, defaultAccessors));
      });
      return;
    }

    changeGraphLayout({ layout: { id: 'concentric' } });
    Promise.resolve(item.data()).then((d: void) => {
      const sampleDataset: JsonImport = d;
      dispatch(GraphThunks.importSampleData(sampleDataset, defaultAccessors));
    });
  };

  return (
    <Button onClick={(e): void => trySampleData(item, e)} kind='tertiary'>
      <Block width='200px'>
        <img src={item.src} height='120px' width='180px' alt={item.title} />
        <HeadingSmall marginTop='6px' marginBottom='0'>
          {item.title}
        </HeadingSmall>
        <ParagraphSmall marginTop='6px' marginBottom='6px'>
          {item.description}
        </ParagraphSmall>
      </Block>
    </Button>
  );
};

export default ImportSampleData;
