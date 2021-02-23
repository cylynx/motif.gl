import React, { FC } from 'react';
import { Block, BlockOverrides } from 'baseui/block';
import { useSelector } from 'react-redux';
import { Theme } from 'baseui/theme';
import NodeInfoAccordion from '../Components/NodeInfoAccordion';
import { Node, EdgeInformation, GraphSelectors } from '../../../../redux/graph';
import EdgeInfoAccordion from '../Components/EdgeInfoAccordion';

const itemBlockOverrides: BlockOverrides = {
  Block: {
    style: ({ $theme }: { $theme: Theme }) => ({
      ':hover': {
        boxShadow: `0px 0px 10px 2px ${$theme.colors.contentInverseSecondary}`,
        borderTopLeftRadius: $theme.sizing.scale200,
        borderTopRightRadius: $theme.sizing.scale200,
        borderBottomLeftRadius: $theme.sizing.scale200,
        borderBottomRightRadius: $theme.sizing.scale200,
      },
    }),
  },
};

const ItemResults: FC = () => {
  const { nodes, edges } = useSelector((state) =>
    GraphSelectors.getPaginateItems(state),
  );

  return (
    <Block
      paddingBottom='scale300'
      paddingLeft='scale550'
      paddingRight='scale550'
      paddingTop='scale300'
      marginTop='scale500'
      position='absolute'
      top={0}
      bottom='35px'
      right={0}
      left={0}
      width='auto'
      $style={{ overflowY: 'auto', scrollbarWidth: 'thin' }}
    >
      {edges.map((edgeInfo: EdgeInformation) => (
        <Block
          marginBottom='scale550'
          key={edgeInfo.edge.id}
          overrides={itemBlockOverrides}
        >
          <EdgeInfoAccordion results={edgeInfo} expanded={false} />
        </Block>
      ))}
      {nodes.map((node: Node) => (
        <Block
          marginBottom='scale550'
          key={node.id}
          overrides={itemBlockOverrides}
        >
          <NodeInfoAccordion results={node} expanded={false} />
        </Block>
      ))}
    </Block>
  );
};

export default ItemResults;
