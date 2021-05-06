import React, { FC, useMemo, useState } from 'react';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';
import {
  GraphAttribute,
  TableTabs,
  TableTabItem,
  TablePreview,
  GraphData,
} from '@cylynx/motif';

type DataPreviewProps = {
  isEdgeGroupable: boolean;
  dataType: string;
  graphData: GraphData;
};
const DataPreview: FC<DataPreviewProps> = ({
  isEdgeGroupable,
  dataType,
  graphData,
}) => {
  const defaultTab: GraphAttribute = useMemo(() => {
    if (dataType === 'edgeListCsv') {
      return 'edges';
    }

    return 'nodes';
  }, [dataType]);

  const TABLE_TABS: TableTabItem[] = useMemo(() => {
    if (dataType === 'edgeListCsv') {
      return [{ key: 'edges', label: 'Edge' }];
    }
    return [
      { key: 'nodes', label: 'Node' },
      { key: 'edges', label: 'Edge' },
    ];
  }, [dataType]);

  const [activeTab, setActiveTab] = useState<GraphAttribute>(defaultTab);

  return (
    <Block marginTop='scale500'>
      <Block
        display='flex'
        justifyContent='space-between'
        alignItems='baseline'
      >
        <LabelXSmall
          color='#4D6A83'
          overrides={{ Block: { style: { textTransform: 'uppercase' } } }}
        >
          uploaded data preview
        </LabelXSmall>

        <TableTabs
          items={TABLE_TABS}
          activeKey={activeTab}
          onClick={setActiveTab}
        />
      </Block>
      <Block marginTop='scale300'>
        <TablePreview
          maxHeight={`calc(100% - ${isEdgeGroupable ? '306px' : '215px'})`}
          isEdgeGroupable={isEdgeGroupable}
          activeTab={activeTab}
          graphData={graphData}
        />
      </Block>
    </Block>
  );
};

export default DataPreview;
