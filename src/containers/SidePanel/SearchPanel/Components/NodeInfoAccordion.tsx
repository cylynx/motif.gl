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
      items={[nodeItem]}
    />
  );
};

export default NodeInfoAccordion;
