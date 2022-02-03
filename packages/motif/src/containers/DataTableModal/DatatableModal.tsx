import React, { Key, useMemo, useState } from 'react';
import { Tabs, Tab } from 'baseui/tabs-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { Modal, ModalBody, SIZE } from 'baseui/modal';
import { GraphAttribute, GraphData, GraphSelectors } from '../../redux/graph';
import AttributeTable from './AttributeTable';
import { ModalState, UISelectors, UISlices } from '../../redux/ui';

export type TActiveKey = {
  activeKey: GraphAttribute | Key;
};

const DatatableModal = () => {
  const dispatch = useDispatch();
  const { modal } = useSelector((state) => UISelectors.getUI(state));

  const [activeKey, setActiveKey] = useState('nodes');
  const [, index] = modal.content.split('_');

  const graphData: GraphData = useSelector((state) => {
    return GraphSelectors.getGraph(state).graphList[Number(index)];
  });

  const isOpen: boolean = useMemo(() => {
    const { content, isOpen } = modal as ModalState;
    return content.startsWith('table') && isOpen;
  }, [modal.content, modal.isOpen]);

  const onCloseModal = () => {
    dispatch(UISlices.closeModal());
  };

  const onTabChange = ({ activeKey }: TActiveKey) => {
    setActiveKey(activeKey as string);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      closeable
      unstable_ModalBackdropScroll
      size={SIZE.auto}
      overrides={{
        Root: {
          style: {
            position: 'absolute',
          },
        },
      }}
    >
      <ModalBody>
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
      </ModalBody>
    </Modal>
  );
};

export default DatatableModal;
