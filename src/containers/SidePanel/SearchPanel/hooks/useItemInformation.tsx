import React, { useMemo } from 'react';
import { Block } from 'baseui/block';
import { NodeStyle } from '@antv/graphin';
import { darken } from 'polished';
import { Theme } from 'baseui/theme';
import shortid from 'shortid';
import { Node, Edge, NodeItemType, EdgeNode } from '../../../../redux/graph';
import { flattenObject } from '../../../../redux/graph/processors/data';
import { removeEmptyValueInObject } from '../../../../utils/data-utils';
import * as Icon from '../../../../components/Icons';

/**
 * This component is leave for future implementation for better UI/UX.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
const EdgeShape = () => {
  return (
    <Block top='-14px' left='4px' position='absolute'>
      <Block
        height='45px'
        backgroundColor='contentTertiary'
        marginLeft='3px'
        width='2px'
      />
      <Block
        width='0'
        height='0'
        overrides={{
          Block: {
            style: ({ $theme }: { $theme: Theme }) => {
              return {
                borderLeft: `${$theme.sizing.scale100} solid transparent`,
                borderRight: `${$theme.sizing.scale100} solid transparent`,
                borderTop: `${$theme.sizing.scale100} solid ${$theme.colors.contentTertiary}`,
              };
            },
          },
        }}
      />
    </Block>
  );
};

type NodeShapeProps = { fill: string; borderColor: string };
const NodeShape = ({ fill, borderColor }: NodeShapeProps) => {
  return (
    <span
      style={{
        background: fill,
        width: 14,
        height: 14,
        border: `1px solid ${borderColor}`,
        borderRadius: '50%',
        marginTop: '2px',
      }}
    />
  );
};

type TableContentProps = { results: Partial<EdgeNode> };
const TableContent = ({ results }: TableContentProps) => {
  const tableRows: JSX.Element[] = useMemo(() => {
    const properties = flattenObject(results);
    removeEmptyValueInObject(properties);

    return Object.entries(properties).map((property) => {
      const [key, value] = property as [string, any];

      return (
        <tr key={key}>
          <th style={{ width: '40%', textTransform: 'lowercase' }}>{key}</th>
          <td style={{ width: '60%', verticalAlign: 'top' }}>{value}</td>
        </tr>
      );
    });
  }, [results]);

  return (
    <table style={{ fontSize: '12px' }}>
      <tbody>{tableRows}</tbody>
    </table>
  );
};

const useItemInformation = () => {
  const createNodeItem = (
    node: Node,
    expanded = false,
    type: NodeItemType = 'normal',
  ) => {
    const { id, comboId, style, defaultStyle, ...omittedResult } = node;

    const { fill } = style.keyshape as NodeStyle['keyshape'];
    const borderColor = darken(0.4, fill);
    const title: JSX.Element = (
      <Block display='flex' justifyContent='center'>
        <NodeShape fill={fill} borderColor={borderColor} />
        <Block
          as='span'
          marginLeft='scale300'
          color='contentTertiary'
          overrides={{
            Block: {
              style: {
                maxWidth: '240px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              },
            },
          }}
        >
          {id}
        </Block>
      </Block>
    );

    return {
      title,
      key: `${id}-${type}`,
      content: <TableContent results={omittedResult} />,
      expanded,
    };
  };

  const createEdgeItem = (edge: Edge, expanded = false) => {
    // only display metadata that are useful for the users.
    const {
      id,
      comboId,
      style,
      defaultStyle,
      source,
      target,
      ...omittedResult
    } = edge;

    const title: JSX.Element = (
      <Block display='flex' justifyContent='center'>
        <Block as='span' marginTop='scale0'>
          <Icon.ArrowDown size={14} />
        </Block>
        <Block
          as='span'
          marginLeft='scale300'
          color='contentTertiary'
          overrides={{
            Block: {
              style: {
                maxWidth: '240px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              },
            },
          }}
        >
          {id}
        </Block>
      </Block>
    );

    return {
      title,
      key: `${id}-${shortid.generate()}`,
      content: <TableContent results={omittedResult} />,
      expanded,
    };
  };

  return { createNodeItem, createEdgeItem };
};

export default useItemInformation;
