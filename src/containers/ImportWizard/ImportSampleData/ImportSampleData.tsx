import React, { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { Cell } from 'baseui/layout-grid';
import { LabelMedium, ParagraphMedium } from 'baseui/typography';
import * as Graph from '../../Graph/types';
import * as DATA from '../../../constants/sample-data';
import { FlushedGrid } from '../../../components/ui';
import { changeLayout, closeModal } from '../../../redux';
import { importSingleJsonData } from '../../../redux/add-data-thunk';
import { ImportType, JsonImport } from '../../../processors/import-data';

export enum SampleData {
  SIMPLE_GRAPH,
  CIRCLE_GRAPH,
  RANDOM_GRAPH,
  NETWORK,
  PERF_TEST,
}

export type SampleDataItem = {
  data: () => void;
  title: string;
  description: string;
  key: SampleData;
  src: string;
  type: ImportType.JSON | ImportType.EDGE_LIST_CSV | ImportType.NODE_EDGE_CSV;
};

const sampleData: SampleDataItem[] = [
  {
    data: DATA.TwoDataArray,
    title: 'Simple Graph Dataset',
    description: 'Demo graph dataset with multiple nodes and edges',
    key: SampleData.SIMPLE_GRAPH,
    type: ImportType.JSON,
    src: '/images/sample.png',
  },
  {
    data: DATA.CircleData,
    title: 'Circle Graph Dataset',
    description: 'Demo graph dataset with multiple nodes and edges',
    key: SampleData.CIRCLE_GRAPH,
    type: ImportType.JSON,
    src: '/images/sample.png',
  },
  {
    data: DATA.RandomData,
    title: 'Random Graph Dataset',
    description: 'Demo graph dataset with multiple nodes and edges',
    key: SampleData.RANDOM_GRAPH,
    type: ImportType.JSON,
    src: '/images/sample.png',
  },
  {
    data: DATA.NetworkData,
    title: 'Network Dataset',
    description: '1.5k Nodes, 2.7k edges',
    key: SampleData.NETWORK,
    type: ImportType.JSON,
    src: '/images/sample.png',
  },
  {
    data: DATA.NetworkData2,
    title: 'Perf Test Dataset',
    description: '7.1k Nodes, 5.4k edges',
    type: ImportType.JSON,
    key: SampleData.PERF_TEST,
    src: '/images/sample.png',
  },
];

const defaultAccessors: Graph.Accessors = {
  nodeID: 'id',
  edgeSource: 'source',
  edgeTarget: 'target',
};

const ImportSampleData = () => {
  return (
    <FlushedGrid>
      {sampleData &&
        sampleData.map((item) => (
          <Cell key={item.title} span={4}>
            <StyledItem item={item} />
          </Cell>
        ))}
    </FlushedGrid>
  );
};

const StyledItem = ({ item }: { item: SampleDataItem }) => {
  const dispatch = useDispatch();

  const trySampleData = (
    // eslint-disable-next-line no-shadow
    item: SampleDataItem,
    e: MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    dispatch(closeModal());

    // These two datasets come with x-y coordinates
    if (item.key === SampleData.PERF_TEST || item.key === SampleData.NETWORK) {
      dispatch(changeLayout({ layout: { id: 'none' } }));
    }

    Promise.resolve(item.data()).then((d: void) => {
      const sampleDataset: JsonImport = { data: d, type: ImportType.JSON };
      dispatch(importSingleJsonData(sampleDataset, defaultAccessors));
    });
  };

  return (
    <Button onClick={(e) => trySampleData(item, e)} kind='minimal'>
      <Block>
        <img src={item.src} height='100px' width='150px' alt={item.title} />
        <LabelMedium marginTop='12px' marginBottom='0'>
          {item.title}
        </LabelMedium>
        <ParagraphMedium marginTop='12px' marginBottom='12px'>
          {item.description}
        </ParagraphMedium>
      </Block>
    </Button>
  );
};

export default ImportSampleData;
