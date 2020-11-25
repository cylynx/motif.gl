import Graphin, { Data, GraphinProps, LayoutOptionBase } from '@antv/graphin';

// @ts-ignore
const layout = (graphin: Graphin, props: GraphinProps) => {
  return [
    {
      name: 'custom',
      desc: 'random layout',
      icon: 'home',
      layout: (data: Data): { data: Data } => {
        console.log(data);
        const nodes = data.nodes.map((node) => {
          return {
            ...node,
            x: Math.round(Math.random() * 800),
            y: Math.round(Math.random() * 500),
          };
        });
        return {
          data: {
            nodes,
            edges: props.data.edges,
          },
        };
      },
    },
  ];
};

export default layout;
