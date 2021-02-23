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
            borderBottomLeftRadius: $theme.sizing.scale300,
            borderBottomRightRadius: $theme.sizing.scale300,
          }),
        },
        Header: {
          style: ({ $expanded, $theme }) => ({
            paddingLeft: $theme.sizing.scale500,
            paddingRight: $theme.sizing.scale300,
            paddingTop: $theme.sizing.scale200,
            paddingBottom: $theme.sizing.scale200,
            backgroundColor: $theme.colors.backgroundSecondary,
            borderTopLeftRadius: $theme.sizing.scale200,
            borderTopRightRadius: $theme.sizing.scale200,
            borderBottomLeftRadius: $expanded ? 0 : $theme.sizing.scale300,
            borderBottomRightRadius: $expanded ? 0 : $theme.sizing.scale300,
            color: $theme.colors.contentSecondary,
            borderBottomStyle: 'none',
            fontWeight: 600,
            fontSize: '12px',
          }),
        },
        ToggleIcon: {
          component: () => {
            return <Icon.ChevronDown />;
          },
        },
      }}
      key={nodeItem.key}
      items={[nodeItem]}
    />
  );
};

export default NodeInfoAccordion;
