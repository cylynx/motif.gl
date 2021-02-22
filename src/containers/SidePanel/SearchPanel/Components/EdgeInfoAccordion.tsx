import React, { useMemo } from 'react';
import Accordion from '../../../../components/Accordion';
import * as Icon from '../../../../components/Icons';
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
    return createNodeItem(sourceNode, expanded);
  }, [sourceNode]);

  const edgeItem = useMemo(() => {
    return createEdgeItem(edge, expanded);
  }, []);

  const targetNodeItem = useMemo(() => {
    return createNodeItem(targetNode, expanded);
  }, [targetNode]);

  return (
    <Accordion
      overrides={{
        Content: {
          style: ({ $expanded, $theme }) => ({
            paddingTop: $expanded ? $theme.sizing.scale300 : 0,
            paddingBottom: $expanded ? $theme.sizing.scale300 : 0,
            paddingLeft: $theme.sizing.scale300,
            paddingRight: $theme.sizing.scale300,
            backgroundColor: '#323742',
            color: $theme.colors.mono200,
            borderBottomWidth: 0,
          }),
        },
        Header: {
          style: ({ $theme }) => ({
            ...$theme.typography.ParagraphSmall,
            textTransform: 'capitalize',
            paddingLeft: $theme.sizing.scale500,
            paddingRight: $theme.sizing.scale300,
            paddingTop: $theme.sizing.scale200,
            paddingBottom: $theme.sizing.scale200,
            backgroundColor: $theme.colors.backgroundSecondary,
            color: $theme.colors.backgroundInverseSecondary,
            borderBottomStyle: 'none',
            fontWeight: 600,
          }),
        },
        ToggleIcon: {
          component: () => {
            return <Icon.ChevronDown />;
          },
        },
      }}
      items={[sourceNodeItem, edgeItem, targetNodeItem]}
    />
  );
};

export default EdgeInfoAccordion;
