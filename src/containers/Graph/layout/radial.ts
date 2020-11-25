// eslint-disable-next-line import/no-extraneous-dependencies
import G6 from '@antv/g6';
import { cloneDeep } from 'lodash';
import Graphin, { LayoutOptionBase, Data, GraphinProps } from '@antv/graphin';

export interface RadialLayoutOption extends LayoutOptionBase {
  /** 中心点坐标 */
  center: [number, number];
  /** 防止覆盖 */
  preventOverlap: boolean;
  /** 节点大小 */
  nodeSize: number;
  /** 每层的半径 */
  unitRadius: number;
}

const radialLayout = (data: Data, options: RadialLayoutOption) => {
  console.log(options);
  const source = cloneDeep(data);
  // eslint-disable-next-line new-cap
  const layout = new G6.Layout.radial({
    ...options,
  });

  layout.init(source);
  layout.execute();

  return {
    nodes: layout.nodes,
    edges: data.edges,
  };
};

// @ts-ignore
const layout = (graphin: Graphin, props: GraphinProps) => {
  const { graph } = graphin;
  const width = graph?.get('width');
  const height = graph?.get('height');
  return [
    {
      name: 'radialLayout',
      desc: 'radial layout',
      icon: 'radial',
      layout: (data: Data, options: LayoutOptionBase): { data: Data } => {
        const defaultOptions = {
          /** 中心点坐标 */
          center: [width / 2, height / 2],
          /** 防止覆盖 */
          preventOverlap: true,
          /** 节点大小 */
          nodeSize: 100,
          /** 每层的半径 */
          unitRadius: 150,
        };
        console.log(options);
        return {
          data: radialLayout(data, {
            ...defaultOptions,
            ...options,
          } as RadialLayoutOption),
        };
      },
    },
  ];
};

export default layout;
