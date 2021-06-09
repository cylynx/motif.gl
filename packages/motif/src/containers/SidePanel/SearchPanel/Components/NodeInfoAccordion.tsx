import React, { useMemo, FC } from 'react';
import Accordion from '../../../../components/Accordion';
import * as Icon from '../../../../components/Icons';
import { Node } from '../../../../redux/graph';
import useItemInformation from '../hooks/useItemInformation';

type NodeInformationProps = {
  results: Node;
  expanded?: boolean;
};

const NodeInfoAccordion: FC<NodeInformationProps> = ({
  results,
  expanded = false,
}) => {
  const { createNodeItem } = useItemInformation();

  const nodeItem = useMemo(() => {
    return createNodeItem(results, expanded);
  }, [results, expanded]);

  return (
    <>
      {[nodeItem].map((x) => (
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

export default NodeInfoAccordion;
