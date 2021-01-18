import React, { MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { Cell } from 'baseui/layout-grid';
import { LabelMedium, ParagraphSmall } from 'baseui/typography';
import * as Graph from '../../Graph/types';
import * as DATA from '../../../constants/sample-data';
import { FlushedGrid } from '../../../components/ui';
import { UISlices } from '../../../redux/ui';
import { GraphSlices, GraphThunks } from '../../../redux/graph';
import { JsonImport } from '../../../processors/import-data';

export enum SampleData {
  SIMPLE_GRAPH,
  CIRCLE_GRAPH,
  RANDOM_GRAPH,
  BANK,
  NETWORK,
  MISERABLE,
  AA,
}

export type SampleDataItem = {
  data: () => void;
  title: string;
  description: string;
  key: SampleData;
  src: string;
  type: 'json' | 'edgeListCsv' | 'nodeEdgeCsv';
};

const sampleData: SampleDataItem[] = [
  {
    data: DATA.CircleData,
    title: 'Circle Graph',
    description:
      'Try displaying the data as a circle using one of the layout options.',
    key: SampleData.CIRCLE_GRAPH,
    type: 'json',
    src:
      'https://storage.googleapis.com/cylynx-landing-content/circle-data.png',
  },
  {
    data: DATA.TwoDataArray,
    title: 'Random + Circle',
    description: 'Import multiple data as in this example.',
    key: SampleData.SIMPLE_GRAPH,
    type: 'json',
    src:
      'https://storage.googleapis.com/cylynx-landing-content/circle-random-data.png',
  },
  {
    data: DATA.BankData,
    title: 'Banking Connections',
    description:
      'Sample banking data with transfer, ownership, payments connections and rich data types. Use a sequential layout and try out the time-series filters and playback.',
    key: SampleData.BANK,
    type: 'json',
    src:
      'https://storage.googleapis.com/cylynx-landing-content/bank-connections.png',
  },
  {
    data: DATA.MiserablesData,
    title: 'Les Misérables',
    description:
      'Character co-occurence in Les Misérables. Try coloring the grouping and displaying the data using a force-directed plot.',
    type: 'json',
    key: SampleData.MISERABLE,
    src:
      'https://storage.googleapis.com/cylynx-landing-content/miserables-data.png',
  },
  {
    data: DATA.NetworkData,
    title: 'Authorship',
    description:
      'Co-authorship network of scientists working on network theory. 1.5k nodes and 2.7k edges.',
    type: 'json',
    key: SampleData.NETWORK,
    src:
      'https://storage.googleapis.com/cylynx-landing-content/network-data.png',
  },
  {
    data: DATA.AAData,
    title: 'American Airlines',
    description:
      'Aggregated arrival and departure flights laid out as a U.S. map.',
    type: 'json',
    key: SampleData.AA,
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
          <Cell key={item.key} span={4} data-testid={item.key}>
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
    dispatch(UISlices.closeModal());

    // These two datasets come with x-y coordinates
    if (item.key === SampleData.AA || item.key === SampleData.NETWORK) {
      dispatch(GraphSlices.changeLayout({ layout: { id: 'none' } }));
    }

    Promise.resolve(item.data()).then((d: void) => {
      const sampleDataset: JsonImport = { data: d, type: 'json' };
      dispatch(
        GraphThunks.importSingleJsonData(sampleDataset, defaultAccessors),
      );
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
