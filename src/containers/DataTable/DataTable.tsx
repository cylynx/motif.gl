import React, { FC, useState } from 'react';
import { Tabs, Tab } from 'baseui/tabs';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { StatefulDataTable } from 'baseui/data-table';
import {
  EdgeNode,
  GraphAttribute,
  GraphData,
  GraphSelectors,
} from '../../redux/graph';
import { graphData2Columns } from './utils';
import { TabBarStyle, TabContentStyle, TabStyle } from './styles';

export type TActiveKey = {
  activeKey: GraphAttribute;
};

export type DataTableModalProps = { dataKey: string };
const DatatableModal: FC<DataTableModalProps> = ({ dataKey }) => {
  const [activeKey, setActiveKey] = useState('nodes');
  const [, index] = dataKey.split('_');

  const graphData: GraphData = useSelector((state) => {
    return GraphSelectors.getGraph(state).graphList[Number(index)];
  });

  const onTabChange = ({ activeKey }: TActiveKey) => {
    setActiveKey(activeKey);
  };

  const tabularData = (attribute: GraphAttribute) => {
    const graphDataAttributes: EdgeNode[] = graphData[attribute];
    const rows = graphDataAttributes.map((r: EdgeNode) => ({
      id: r.id,
      data: r,
    }));

    const columns = graphData2Columns(graphData.metadata.fields[attribute]);
    return [rows, columns];
  };

  const [nodeRows, nodeColumns] = tabularData('nodes');
  const [edgeRows, edgeColumns] = tabularData('edges');

  return (
    <Tabs
      activeKey={activeKey}
      onChange={onTabChange}
      overrides={{
        Tab: {
          // @ts-ignore
          style: TabStyle,
        },
        TabContent: {
          style: TabContentStyle,
        },
        TabBar: {
          style: TabBarStyle,
        },
      }}
    >
      <Tab key='nodes' title='Nodes'>
        <Block height='600px' width='800px' paddingBottom='scale300'>
          <StatefulDataTable columns={nodeColumns} rows={nodeRows} />
        </Block>
      </Tab>
      <Tab key='edges' title='Edges'>
        <Block height='600px' width='800px' paddingBottom='scale300'>
          <StatefulDataTable columns={edgeColumns} rows={edgeRows} />
        </Block>
      </Tab>
    </Tabs>
  );
};

export default DatatableModal;
