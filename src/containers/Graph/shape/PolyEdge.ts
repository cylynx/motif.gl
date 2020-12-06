/* eslint-disable import/no-extraneous-dependencies */
// @ts-nocheck
import Group from '@antv/g-canvas/lib/group';
import { IShape } from '@antv/g-canvas/lib/interfaces';
import { IEdge } from '@antv/g6/lib/interface/item';
import { G6Edge } from '@antv/graphin';
import { normalizeColor, mapEdgePattern } from './utils';
import {
  DEFAULT_EDGE_STYLE,
  HIDDEN_LABEL_COLOR as HIDDEN_LABEL_COLOR_RGB,
  GREY as GREY_RGB,
  EnumNodeAndEdgeStatus,
} from './constants';

const HIDDEN_LABEL_COLOR = normalizeColor(HIDDEN_LABEL_COLOR_RGB);
const GREY = normalizeColor(GREY_RGB);

interface Position {
  x: number;
  y: number;
}

// function getControlPoint(p1, p2, d) {
//   const pm = {
//     x: (p2.x + p1.x) / 2,
//     y: (p2.y + p1.y) / 2,
//   };
//   const dx = p2.x - p1.x;
//   const dy = p2.y - p1.y;
//   const y = pm.y - (dx * d) / Math.sqrt(dx ** 2 + dy ** 2) || 0;
//   const x = pm.x + (dy * d) / Math.sqrt(dx ** 2 + dy ** 2) || 0;
//   return {
//     x, y,
//   };
// }

function getPolyEdgeControlPoint(p1: Position, p2: Position, d: number) {
  const pm = {
    x: (p2.x + p1.x) / 2,
    y: (p2.y + p1.y) / 2,
  };
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const y = pm.y - (dx * d) / Math.sqrt(dx ** 2 + dy ** 2) || 0;
  const x = pm.x + (dy * d) / Math.sqrt(dx ** 2 + dy ** 2) || 0;
  return {
    x,
    y,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (g6: any) => {
  g6.registerEdge('PolyEdge', {
    draw(cfg: G6Edge, group: Group) {
      const hasLabel = cfg.label;
      const { startPoint, endPoint, style, defaultStyle } = cfg;

      const points = [
        { id: cfg.source, point: startPoint },
        { id: cfg.target, point: endPoint },
      ]
        .sort((a, b) => {
          if (a.id < b.id) return -1;
          if (a.id > b.id) return 1;
          return 0;
        })
        .map((item) => item.point);

      const controlPoints = getPolyEdgeControlPoint(
        points[0],
        points[1],
        cfg.poly?.distance || 0,
      );

      const attrs = {
        path: [
          ['M', startPoint.x, startPoint.y],
          ['Q', controlPoints.x, controlPoints.y, endPoint.x, endPoint.y],
        ],
      };

      const lineColor = style?.dark
        ? GREY
        : normalizeColor(
            style?.color || defaultStyle?.color || DEFAULT_EDGE_STYLE.color,
          );

      const linePattern = mapEdgePattern(
        style?.pattern || defaultStyle?.pattern || DEFAULT_EDGE_STYLE.pattern,
      );

      const basicLineWidth =
        style?.width || defaultStyle?.width || DEFAULT_EDGE_STYLE.width;

      const d = basicLineWidth + 1;

      const labelFontColor = style?.dark
        ? HIDDEN_LABEL_COLOR
        : normalizeColor(
            style?.fontColor ||
              defaultStyle?.fontColor ||
              DEFAULT_EDGE_STYLE.fontColor,
          );

      const labelFontSize =
        style?.fontSize ||
        defaultStyle?.fontSize ||
        DEFAULT_EDGE_STYLE.fontSize;

      const labelFontFamily =
        style?.fontFamily ||
        defaultStyle?.fontFamily ||
        DEFAULT_EDGE_STYLE.fontFamily;

      group.addShape('path', {
        attrs: {
          id: 'selected',
          ...attrs,
          lineWidth: 1,
          stroke: '#000',
          opacity: 0.05,
        },
      });

      const key = group.addShape('path', {
        attrs: {
          id: 'main',
          ...attrs,
          lineAppendWidth: 4,
          stroke: lineColor.dark,
          lineWidth: basicLineWidth,
          lineDash: linePattern,
          endArrow: {
            d: -d / 2,
            path: `M 0,0 L ${d},${d / 2} L ${d},-${d / 2} Z`,
          },
        },
      });

      if (hasLabel) {
        const label = group.addShape('text', {
          attrs: {
            id: 'label',
            x: 0,
            y: 0,
            fontSize: labelFontSize,
            text: cfg.label,
            textAlign: 'center',
            fontFamily: labelFontFamily,
            fill: labelFontColor.dark,
          },
        });
        label.rotate(
          endPoint.x - startPoint.x === 0
            ? Math.PI / 2
            : Math.atan(
                (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x),
              ),
        );
        const mid: [number, number] = [
          (startPoint.x + endPoint.x) / 2,
          (startPoint.y + endPoint.y) / 2,
        ];
        // TODO: 这里label坐标计算有问题，需要调整算法, 今天搞不动了，明天再处理
        label.translate(
          (controlPoints.x + mid[0]) / 2,
          (controlPoints.y + mid[1]) / 2,
        );
      }
      return key;
    },
    setState(name: EnumNodeAndEdgeStatus, _value: string, edge: IEdge) {
      if (!name) return;
      // eslint-disable-next-line no-underscore-dangle
      const { states } = edge._cfg;
      const data: G6Edge = edge.get('model');
      const { style, defaultStyle } = data;
      const mainShape = edge
        .getContainer()
        .get('children')
        .find((item: IShape) => item.attr().id === 'main');
      const selectedShape = edge
        .getContainer()
        .get('children')
        .find((item: IShape) => item.attr().id === 'selected');
      const textShape = edge
        .getContainer()
        .get('children')
        .find((item: IShape) => item.attr().id === 'label');

      const lineColor = data.style?.dark
        ? GREY
        : normalizeColor(
            style?.color || defaultStyle?.color || DEFAULT_EDGE_STYLE.color,
          );

      const basicLineWidth =
        style?.width || defaultStyle?.width || DEFAULT_EDGE_STYLE.width;

      const d = basicLineWidth + 1;

      const labelFontColor = data.style?.dark
        ? HIDDEN_LABEL_COLOR
        : normalizeColor(
            style?.fontColor ||
              defaultStyle?.fontColor ||
              DEFAULT_EDGE_STYLE.fontColor,
          );

      const targetAttrs = {
        main: {},
        selected: {},
        text: {},
      };

      targetAttrs.main = {
        stroke: lineColor.dark,
        lineWidth: basicLineWidth,
        endArrow: {
          d: -d / 2,
          path: `M 0,0 L ${d},${d / 2} L ${d},-${d / 2} Z`,
        },
      };
      targetAttrs.selected = {
        lineWidth: 0,
      };
      targetAttrs.text = {
        fill: labelFontColor.dark,
      };

      if (states.includes(EnumNodeAndEdgeStatus.HOVERED)) {
        const deltaD = d + 1;
        targetAttrs.main = {
          lineWidth: basicLineWidth + 1,
          endArrow: {
            d: -deltaD / 2,
            path: `M 0,0 L ${deltaD},${deltaD / 2} L ${deltaD},-${
              deltaD / 2
            } Z`,
          },
        };
      }
      if (
        states.includes(EnumNodeAndEdgeStatus.SELECTED) ||
        states.includes(EnumNodeAndEdgeStatus.LIGHT)
      ) {
        const deltaD = d + 1;
        targetAttrs.main = {
          lineWidth: basicLineWidth + 1,
          endArrow: {
            d: -deltaD / 2,
            path: `M 0,0 L ${deltaD},${deltaD / 2} L ${deltaD},-${
              deltaD / 2
            } Z`,
          },
        };
        targetAttrs.selected = {
          lineWidth: basicLineWidth + 3,
        };
      }
      if (
        states.includes(EnumNodeAndEdgeStatus.DARK) ||
        states.includes(EnumNodeAndEdgeStatus.FILTERED)
      ) {
        targetAttrs.main = {
          stroke: GREY.dark,
          lineWidth: 1,
          endArrow: {
            d: -1,
            path: 'M 0,0 L 2,1 L 2,-1 Z',
          },
        };
        targetAttrs.text = {
          fill: GREY.dark,
        };
      }

      mainShape.attr(targetAttrs.main);
      selectedShape.attr(targetAttrs.selected);
      if (textShape) textShape.attr(targetAttrs.text);
    },
  });
};
