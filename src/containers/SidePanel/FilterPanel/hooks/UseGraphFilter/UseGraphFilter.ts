import get from 'lodash/get';
import { Value } from 'baseui/select';
import { GraphAttribute } from './types';
import { Node, Edge, GraphData } from '../../../../Graph';

const useGraphFilter = (graphFlatten: GraphData) => {
  const getStringOptions = (
    attribute: GraphAttribute,
    criteria: string,
  ): Value => {
    const properties: (Node | Edge)[] = graphFlatten[attribute];
    const stringValues: string[] = properties.map((node: Node | Edge) => {
      const data: string = get(node, criteria);
      return data;
    });

    const optionsSet: Set<string> = new Set(stringValues);
    const options: Value = [...optionsSet].map((value: string) => ({
      id: value,
      label: value,
    }));

    return options;
  };

  return { getStringOptions };
};

export default useGraphFilter;
