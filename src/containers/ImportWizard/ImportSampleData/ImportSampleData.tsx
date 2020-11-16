import React, { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { Cell } from 'baseui/layout-grid';
import { LabelMedium, ParagraphMedium } from 'baseui/typography';
import * as Graph from '../../Graph/types';
import * as DATA from '../../../constants/sample-data';
import { FlushedGrid } from '../../../components/ui';
import { addData, closeModal } from '../../../redux';

export type SampleDataItem = {
  data: () => void;
  title: string;
  description: string;
  src: string;
  type: 'json' | 'edgeListCsv' | 'nodeEdgeCsv';
};

const sampleData: SampleDataItem[] = [
  {
    data: DATA.TwoDataArray,
    title: 'Simple Graph Dataset',
    description: 'Demo graph dataset with multiple nodes and edges',
    type: 'json',
    src: '/images/sample.png',
  },
  {
    data: DATA.CircleData,
    title: 'Circle Graph Dataset',
    description: 'Demo graph dataset with multiple nodes and edges',
    type: 'json',
    src: '/images/sample.png',
  },
  {
    data: DATA.RandomData,
    title: 'Random Graph Dataset',
    description: 'Demo graph dataset with multiple nodes and edges',
    type: 'json',
    src: '/images/sample.png',
  },
  {
    data: DATA.NetworkData,
    title: 'Network Dataset',
    description: '1.5k Nodes, 2.7k edges',
    type: 'json',
    src: '/images/sample.png',
  },
  {
    data: DATA.NetworkData2,
    title: 'Perf Test Dataset',
    description: '7.1k Nodes, 5.4k edges',
    type: 'json',
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
    Promise.resolve(item.data()).then((d) => {
      // @ts-ignore
      dispatch(addData({ data: d, type: item.type }, defaultAccessors));
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
