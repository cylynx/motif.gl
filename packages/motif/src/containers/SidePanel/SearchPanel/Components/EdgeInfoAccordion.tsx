import React, { useMemo } from 'react';
import Accordion from '../../../../components/Accordion';
import { EdgeInformation } from '../../../../redux/graph';
import useItemInformation from '../hooks/useItemInformation';

type EdgeInformationProps = {
  results: EdgeInformation;
  expanded?: boolean;
};

const EdgeInfoAccordion = ({
  results,
  expanded = false,
}: EdgeInformationProps) => {
  const { sourceNode, edge, targetNode } = results;
  const { createNodeItem, createEdgeItem } = useItemInformation();

  const sourceNodeItem = useMemo(() => {
    return createNodeItem(sourceNode, expanded, 'source');
  }, [sourceNode]);

  const edgeItem = useMemo(() => {
    return createEdgeItem(edge, expanded);
  }, []);

  const targetNodeItem = useMemo(() => {
    return createNodeItem(targetNode, expanded, 'target');
  }, [targetNode]);

  return (
    <>
      {[sourceNodeItem, edgeItem, targetNodeItem].map((x) => (
        <Accordion
          title={x.title}
          content={x.content}
          expanded={x.expanded}
          key={x.key}
          iconPosition='right'
        />
      ))}
    </>
  );
};

export default EdgeInfoAccordion;
