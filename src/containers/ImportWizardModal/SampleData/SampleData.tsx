import React, { FC, MouseEvent } from 'react';
import { ALIGNMENT, Cell, Grid } from 'baseui/layout-grid';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { LabelMedium, ParagraphSmall } from 'baseui/typography';

import { useDispatch, useSelector } from 'react-redux';
import { SampleData, SampleDataItem } from './types';
import {
  GraphSelectors,
  GraphSlices,
  GraphThunks,
  JsonImport,
} from '../../../redux/graph';
import { UISlices } from '../../../redux/ui';
import { defaultAccessors, sampleData } from './constant';
import useNodeStyle from '../../../redux/graph/hooks/useNodeStyle';

const ImportSampleData = (): JSX.Element => {
  return (
    <Grid
      gridGaps={8}
      gridColumns={[2, 3, 4]}
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

  const trySampleData = (
    item: SampleDataItem,
    e: MouseEvent<HTMLButtonElement>,
  ): void => {
    e.preventDefault();
    dispatch(UISlices.closeModal());

    if (nodeOptions.color.id === 'legend') {
      switchToFixNodeColor();
    }

    // These two datasets come with x-y coordinates
    if (item.key === SampleData.AA || item.key === SampleData.NETWORK) {
      dispatch(GraphSlices.changeLayout({ layout: { id: 'preset' } }));
      Promise.resolve(item.data()).then((d: void) => {
        const sampleDataset: JsonImport = d;
        dispatch(
          GraphThunks.importSingleJsonData(sampleDataset, defaultAccessors),
        );
      });
      return;
    }

    dispatch(GraphSlices.changeLayout({ layout: { id: 'concentric' } }));
    Promise.resolve(item.data()).then((d: void) => {
      const sampleDataset: JsonImport = d;
      dispatch(
        GraphThunks.importSingleJsonData(sampleDataset, defaultAccessors),
      );
    });
  };

  return (
    <Button onClick={(e): void => trySampleData(item, e)} kind='minimal'>
      <Block width='200px'>
        <img src={item.src} height='120px' width='180px' alt={item.title} />
        <LabelMedium marginTop='6px' marginBottom='0'>
          {item.title}
        </LabelMedium>
        <ParagraphSmall marginTop='6px' marginBottom='6px'>
          {item.description}
        </ParagraphSmall>
      </Block>
    </Button>
  );
};

export default ImportSampleData;
