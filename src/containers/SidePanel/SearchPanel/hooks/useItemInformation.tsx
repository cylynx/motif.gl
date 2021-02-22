import React from 'react';
import { Block } from 'baseui/block';
import { Node, Edge } from '../../../../redux/graph';
import { flattenObject } from '../../../../redux/graph/processors/data';
import { removeEmptyValueInObject } from '../../../../utils/data-utils';

const useItemInformation = () => {
  const createNodeItem = (node: Node, expanded: boolean) => {
    const { id, comboId, style, defaultStyle, ...omittedResult } = node;

    const title: JSX.Element = (
      <Block
        display='flex'
        justifyContent='center'
        $style={{ textTransform: 'capitalize' }}
      >
        [Node] {id}
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
      key: id,
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
