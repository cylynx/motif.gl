import React from 'react';
import { Block } from 'baseui/block';
import { NodeStyle } from '@antv/graphin';
import { darken } from 'polished';
import { Node, Edge, NodeItemType } from '../../../../redux/graph';
import { flattenObject } from '../../../../redux/graph/processors/data';
import { removeEmptyValueInObject } from '../../../../utils/data-utils';

const useItemInformation = () => {
  const createNodeItem = (
    node: Node,
    expanded: boolean,
    type: NodeItemType = 'normal',
  ) => {
    const { id, comboId, style, defaultStyle, ...omittedResult } = node;

    const { fill } = style.keyshape as NodeStyle['keyshape'];
    const borderColor = darken(0.4, fill);
    const title: JSX.Element = (
      <Block display='flex' justifyContent='center'>
        <span
          style={{
            background: fill,
            width: 14,
            height: 14,
            border: `2px solid ${borderColor}`,
            borderRadius: '50%',
          }}
        />
        <span style={{ marginLeft: '8px' }}>{id}</span>
      </Block>
    );

    const properties = flattenObject(omittedResult);
    removeEmptyValueInObject(properties);
    const tableRows: JSX.Element[] = Object.entries(properties).map(
      (property) => {
        const [key, value] = property as [string, any];

        return (
          <tr key={key}>
            <th style={{ width: '40%', textTransform: 'lowercase' }}>{key}</th>
            <td style={{ width: '60%', verticalAlign: 'top' }}>{value}</td>
          </tr>
        );
      },
    );

    const tableContent: JSX.Element = (
      <table style={{ fontSize: '12px' }}>
        <tbody>{tableRows}</tbody>
      </table>
    );

    return {
      title,
      key: `${id}-${type}`,
      content: tableContent,
      expanded,
    };
  };

  const createEdgeItem = (edge: Edge, expanded: boolean) => {
    const { id, comboId, style, defaultStyle, ...omittedResult } = edge;

    const title: JSX.Element = (
      <Block
        display='flex'
        justifyContent='center'
        $style={{ textTransform: 'capitalize' }}
      >
        [Edge] {id}
      </Block>
    );

    const properties = flattenObject(omittedResult);
    removeEmptyValueInObject(properties);
    const tableRows: JSX.Element[] = Object.entries(properties).map(
      (property) => {
        const [key, value] = property as [string, any];

        return (
          <tr key={key}>
            <th style={{ width: '40%', textTransform: 'lowercase' }}>{key}</th>
            <td style={{ width: '60%', verticalAlign: 'top' }}>{value}</td>
          </tr>
        );
      },
    );

    const tableContent: JSX.Element = (
      <table id={id} style={{ fontSize: '12px' }} key={id}>
        <tbody>{tableRows}</tbody>
      </table>
    );

    return {
      title,
      key: id,
      content: tableContent,
      expanded,
    };
  };

  return { createNodeItem, createEdgeItem };
};

export default useItemInformation;
