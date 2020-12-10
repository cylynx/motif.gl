/* eslint-disable import/no-extraneous-dependencies */
import { Group, Shape } from '@antv/g-canvas';
import { INode } from '@antv/g6/lib/interface/item';
import { G6Edge, G6Node } from '@antv/graphin';
import {
  normalizeColor,
  mapEdgePattern,
  isArrowDisplay,
  processArrowOption,
} from './utils';
import {
  DEFAULT_EDGE_STYLE,
  HIDDEN_LABEL_COLOR as HIDDEN_LABEL_COLOR_RGB,
  GREY as GREY_RGB,
  EnumNodeAndEdgeStatus,
} from './constants';
import { ArrowOptions } from '../types';

const HIDDEN_LABEL_COLOR = normalizeColor(HIDDEN_LABEL_COLOR_RGB);
const GREY = normalizeColor(GREY_RGB);

const PADDING = 2;
const RADIO = 0.75;

// NOT IN USE EVEN IN GRAPHIN, they use the default loop

export default (g6: any) => {
  g6.registerEdge('LoopEdge', {
    draw(cfg: G6Edge, group: Group) {
      const hasLabel = cfg.label;
      const { startPoint, endPoint, style, defaultStyle } = cfg;

      const target = cfg.sourceNode.get('model') as G6Node;
      let size =
        (target.style?.nodeSize || 0) > 28
          ? (target.style?.nodeSize as number)
          : 28;
      size *= RADIO;

      const attrs = {
        path: [
          [
            'M',
            startPoint.x - size / 2 - PADDING,
            startPoint.y - (Math.sqrt(3) / 2) * size - PADDING,
          ],
          [
            'A',
            size,
            size,
            0,
            1,
            1,
            startPoint.x + size / 2 + PADDING,
            startPoint.y - (Math.sqrt(3) / 2) * size - PADDING,
          ],
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
        draggable: true,
        name: 'selected',
      });

      const arrowOptions: ArrowOptions = processArrowOption(
        defaultStyle?.arrow,
      );

      const endArrow = isArrowDisplay(arrowOptions, {
        d: -d / 2,
        path: `M 0,0 L ${d},${d / 2} L ${d},-${d / 2} Z`,
      });

      const key = group.addShape('path', {
        attrs: {
          id: 'main',
          ...attrs,
          lineAppendWidth: 4,
          stroke: lineColor.dark,
          lineWidth: basicLineWidth,
          lineDash: linePattern,
          endArrow,
          draggable: true,
          name: 'path',
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
          draggable: true,
          name: 'label',
        });
        label.rotate(
          endPoint.x - startPoint.x === 0
            ? Math.PI / 2
            : Math.atan(
                (endPoint.y - startPoint.y) / (endPoint.x - startPoint.x),
              ),
        );
        label.translate(
          (startPoint.x + endPoint.x) / 2,
          (startPoint.y + endPoint.y) / 2,
        );
        label.translate(-5, -5);
      }
      return key;
    },
    setState(name: EnumNodeAndEdgeStatus, _value: string, edge: INode) {
      if (!name) return;
      // eslint-disable-next-line no-underscore-dangle
      const { states } = edge._cfg;
      const data: G6Edge = edge.get('model');
      const { style, defaultStyle } = data;
      const mainShape = edge
        .getContainer()
        .get('children')
        .find((item: Shape.Base) => item.attr().id === 'main');
      const selectedShape = edge
        .getContainer()
        .get('children')
        .find((item: Shape.Base) => item.attr().id === 'selected');
      const textShape = edge
        .getContainer()
        .get('children')
        .find((item: Shape.Base) => item.attr().id === 'label');
      const lineColor = data.style?.dark
        ? GREY
        : normalizeColor(
            style?.color || defaultStyle?.color || DEFAULT_EDGE_STYLE.color,
          );

      const basicLineWidth =
        style?.width || defaultStyle?.width || DEFAULT_EDGE_STYLE.width;

      const arrowOptions: ArrowOptions = processArrowOption(
        defaultStyle?.arrow,
      );

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
        endArrow: isArrowDisplay(arrowOptions, {
          d: -d / 2,
          path: `M 0,0 L ${d},${d / 2} L ${d},-${d / 2} Z`,
        }),
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
          endArrow: isArrowDisplay(arrowOptions, {
            d: -deltaD / 2,
            path: `M 0,0 L ${deltaD},${deltaD / 2} L ${deltaD},-${
              deltaD / 2
            } Z`,
          }),
        };
      }

      if (
        states.includes(EnumNodeAndEdgeStatus.SELECTED) ||
        states.includes(EnumNodeAndEdgeStatus.LIGHT)
      ) {
        const deltaD = d + 1;
        targetAttrs.main = {
          lineWidth: basicLineWidth + 1,
          endArrow: isArrowDisplay(arrowOptions, {
            d: -deltaD / 2,
            path: `M 0,0 L ${deltaD},${deltaD / 2} L ${deltaD},-${
              deltaD / 2
            } Z`,
          }),
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
          endArrow: isArrowDisplay(arrowOptions, {
            d: -1,
            path: 'M 0,0 L 2,1 L 2,-1 Z',
          }),
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
