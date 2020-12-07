import React, { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { Cell } from 'baseui/layout-grid';
import { LabelMedium, ParagraphSmall } from 'baseui/typography';
import * as Graph from '../../Graph/types';
import * as DATA from '../../../constants/sample-data';
import { changeLayout } from '../../../redux/graph-slice';
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
    data: DATA.RandomData,
    title: 'Random Graph',
    description: 'A small random dataset to get started.',
    type: 'json',
    src:
      'https://storage.googleapis.com/cylynx-landing-content/random-data.png',
  },
  {
    data: DATA.CircleData,
    title: 'Circle Graph',
    description:
      'Try displaying the data as a circle using one of the layout options.',
    type: 'json',
    src:
      'https://storage.googleapis.com/cylynx-landing-content/circle-data.png',
  },
  {
    data: DATA.TwoDataArray,
    title: 'Random + Circle',
    description: 'Import multiple data as in this example.',
    type: 'json',
    src:
      'https://storage.googleapis.com/cylynx-landing-content/circle-random-data.png',
  },
  {
    data: DATA.MiserablesData,
    title: 'Les Misérables',
    description:
      'Character co-occurence in Les Misérables. Try coloring the grouping and displaying the data using a force-directed plot.',
    type: 'json',
    src:
      'https://storage.googleapis.com/cylynx-landing-content/miserables-data.png',
  },
  {
    data: DATA.NetworkData,
    title: 'Authorship',
    description:
      'Co-authorship network of scientists working on network theory. 1.5k nodes and 2.7k edges.',
    type: 'json',
    src:
      'https://storage.googleapis.com/cylynx-landing-content/network-data.png',
  },
  {
    data: DATA.AAData,
    title: 'American Airlines',
    description:
      'Aggregated arrival and departure flights laid out as a U.S. map.',
    type: 'json',
    src: 'https://storage.googleapis.com/cylynx-landing-content/aa-data.png',
  },
];

const defaultAccessors: Graph.Accessors = {
  nodeID: 'id',
  edgeSource: 'source',
  edgeTarget: 'target',
};

const ImportSampleData = () => {
  return (
    <FlushedGrid gridGutters={0}>
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
    if (item.title === 'Authorship' || item.title === 'American Airlines') {
      dispatch(changeLayout({ layout: { id: 'none' } }));
    }
    Promise.resolve(item.data()).then((d) => {
      // @ts-ignore
      dispatch(addData({ data: d, type: item.type }, defaultAccessors));
    });
  };

  return (
    <Button onClick={(e) => trySampleData(item, e)} kind='minimal'>
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
