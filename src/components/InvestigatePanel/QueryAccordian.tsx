// @ts-nocheck
import React from 'react';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { Accordion, Content } from '../ui';
import * as Graph from '../../types/Graph';
import { getGraph } from '../../redux';

const QueryAccordian = () => {
  const graphList = useSelector((state) => getGraph(state).graphList);
  const accordianItems = graphList.map((query: Graph.Data, index: number) => {
    let title = `import ${index}`;
    if (query.metadata && query.metadata.title) {
      title = query.metadata.title;
    }
    return { key: title, title, content: <Content>Test Hello world</Content> };
  });

  return (
    <Block overflow='auto' maxHeight='calc(100vh - 200px - 150px)'>
      <Accordion items={accordianItems} />
    </Block>
  );
};

// const InfoButton = ({ onClick }) => (
//   <Button size='compact' kind='tertiary' onClick={onClick} shape='square'>
//     <GoInfo />
//   </Button>
// );

export default QueryAccordian;
