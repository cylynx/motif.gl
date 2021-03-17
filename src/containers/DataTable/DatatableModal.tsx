import React, { FC, useState } from 'react';
import { Tabs, Tab } from 'baseui/tabs-motion';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { GraphAttribute, GraphData, GraphSelectors } from '../../redux/graph';
import AttributeTable from './AttributeTable';

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

  return (
    <Tabs activeKey={activeKey} onChange={onTabChange}>
      <Tab key='nodes' title='Nodes'>
        <Block height='600px' width='800px' paddingBottom='scale100'>
          <AttributeTable graphData={graphData} types='nodes' />
        </Block>
      </Tab>
      <Tab key='edges' title='Edges'>
        <Block height='600px' width='800px' paddingBottom='scale100'>
          <AttributeTable graphData={graphData} types='edges' />
        </Block>
      </Tab>
    </Tabs>
  );
};

export default DatatableModal;
