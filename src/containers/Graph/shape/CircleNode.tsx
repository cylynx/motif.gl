/* eslint-disable import/no-extraneous-dependencies */
import { Group, Shape } from '@antv/g-canvas';
import G6, { INode } from '@antv/g6';
import { IUserNode } from '@antv/graphin/lib/typings/type';
import {
  GREY as GREY_RGB,
  EnumNodeAndEdgeStatus,
  DEFAULT_NODE_STYLE,
} from './constants';
import { normalizeColor } from './utils';
import iconmap from '../../../components/font-icon/icon-map.json';

const GREY = normalizeColor(GREY_RGB);

const getIcon = (str: string) => {
  const unicode = iconmap[str]
    ? String.fromCodePoint(parseInt(iconmap[str], 16))
    : '';
  return unicode;
};

export default (g6: typeof G6) => {
  g6.registerNode('CircleNode', {
    draw(cfg: any, group: Group) {
      const hasLabel = cfg.label;
      const { defaultStyle, style } = cfg;
      const innerSize =
        style?.size || defaultStyle?.size || DEFAULT_NODE_STYLE.size;
      const outerSize = innerSize > 5 ? innerSize + 4 : innerSize + 2;

      const color = style?.dark
        ? GREY
        : normalizeColor(
            style?.color || defaultStyle?.color || DEFAULT_NODE_STYLE.color,
          );

      const strokeColor = style?.dark
        ? GREY
        : normalizeColor(style?.stroke || defaultStyle?.stroke || color);

      const labelFontSize =
        style?.fontSize ||
        defaultStyle?.fontSize ||
        DEFAULT_NODE_STYLE.fontSize;

      const labelFontFamily =
        style?.fontFamily ||
        defaultStyle?.fontFamily ||
        DEFAULT_NODE_STYLE.fontFamily;

      group.addShape('circle', {
        attrs: {
          id: 'circle-floor',
          x: 0,
          y: 0,
          r: outerSize / 2,
        },
        draggable: true,
        name: 'circle-floor',
      });
      group.addShape('circle', {
        attrs: {
          id: 'circle-selected',
          x: 0,
          y: 0,
          r: 0,
          fill: '#000',
          opacity: 0.05,
        },
        draggable: true,
        name: 'circle-selected',
      });

      const keyShape = group.addShape('circle', {
        attrs: {
          id: 'circle-inner',
          x: 0,
          y: 0,
          r: innerSize / 2,
          fill: color.dark,
          stroke: strokeColor.normal,
          lineWidth: innerSize > 10 ? 2 : 1,
        },
        draggable: true,
        name: 'circle-inner',
      });
      const inner = group.addGroup(
        {
          attrs: {
            id: 'circle-inner-group',
          },
          draggable: true,
          name: 'circle-inner-group',
          // tslint:disable-next-line: align
        },
        {},
      );
      // font-icon
      inner.addShape('text', {
        attrs: {
          id: 'circle-icon',
          x: 0,
          y: 0,
          text: getIcon(cfg.style?.icon || cfg.icon),
          fontSize: innerSize > 12 ? innerSize - 8 : innerSize - 4,
          textAlign: 'center',
          textBaseline: 'middle',
          fontFamily: 'Material Icons',
          fill: style?.dark ? GREY.dark : '#FFFFFF',
        },
        draggable: true,
        name: 'circle-icon',
      });
      if (hasLabel) {
        group.addShape('text', {
          attrs: {
            id: 'circle-label',
            x: 0,
            y: outerSize / 2 + labelFontSize,
            fontSize: labelFontSize,
            text: cfg.label,
            textAlign: 'center',
            fontFamily: labelFontFamily,
            fill: style?.dark ? GREY.dark : '#3B3B3B',
          },
          draggable: true,
          name: 'circle-label',
        });
      }

      if (!cfg.badge) return keyShape;

      const children = group.addGroup(
        {
          attrs: {
            id: 'circle-children-group',
          },
          draggable: true,
          name: 'circle-children-group',
          // tslint:disable-next-line: align
        },
        {},
      );
      children.addShape('circle', {
        attrs: {
          id: 'circle-children',
          x: outerSize / 2 - 9,
          y: -outerSize / 2 + 9,
          r: 9,
          fill: style?.dark ? '#1E202D' : color.dark,
        },
        draggable: true,
        name: 'circle-children',
      });
      children.addShape('text', {
        attrs: {
          id: 'circle-children-icon',
          x: outerSize / 2 - 9,
          y: -outerSize / 2 + 9,
          text: cfg.badge,
          fontSize: 10,
          textAlign: 'center',
          textBaseline: 'middle',
          fill: style?.dark ? GREY.dark : '#FFFFFF',
        },
        draggable: true,
        name: 'circle-children-icon',
      });
      return keyShape;
    },
    setState(name: EnumNodeAndEdgeStatus, _value: string, node: INode) {
      if (!name) return;
      // eslint-disable-next-line no-underscore-dangle
      const { states } = node._cfg;
      const data: IUserNode = node.get('model');
      const { defaultStyle, style } = data;
      const container = node.getContainer();
      const circleSelected = container
        .get('children')
        .find((item: Shape.Base) => item.attr().id === 'circle-selected');
      const circleInnerGroup = container
        .get('children')
        .find((item: Shape.Base) => item.attr().id === 'circle-inner-group');
      const circleInner = container
        .get('children')
        .find((item: Shape.Base) => item.attr().id === 'circle-inner');
      const circleIcon = circleInnerGroup
        .get('children')
        .find((item: Shape.Base) => item.attr().id === 'circle-icon');
      const circleLabel = container
        .get('children')
        .find((item: Shape.Base) => item.attr().id === 'circle-label');
      const circleChildrenGroup = container
        .get('children')
        .find((item: Shape.Base) => item.attr().id === 'circle-children-group');
      const circleChildren = circleChildrenGroup
        ?.get('children')
        .find((item: Shape.Base) => item.attr().id === 'circle-children');
      const circleChildrenIcon = circleChildrenGroup
        ?.get('children')
        .find((item: Shape.Base) => item.attr().id === 'circle-children-icon');

      const innerSize =
        style?.size || defaultStyle?.size || DEFAULT_NODE_STYLE.size;
      const outerSize = innerSize > 5 ? innerSize + 4 : innerSize + 2;
      const adjustment = innerSize > 10 ? 4 : 2;

      const color = style?.dark
        ? GREY
        : normalizeColor(
            style?.color || defaultStyle?.color || DEFAULT_NODE_STYLE.color,
          );

      const strokeColor = style?.dark
        ? GREY
        : normalizeColor(style?.stroke || defaultStyle?.stroke || color);

      const targetAttrs = {
        selected: {
          r: 0,
        },
        inner: {
          fill: color.dark,
          stroke: strokeColor.normal,
          lineWidth: innerSize > 10 ? 2 : 1,
        },
        icon: {
          fill: style?.dark ? GREY.dark : '#FFFFFF',
        },
        label: {
          fill: style?.dark ? GREY.dark : '#3B3B3B',
        },
        children: {
          fill: color.normal,
        },
        childrenIcon: {
          fill: style?.dark ? GREY.dark : '#FFFFFF',
        },
      };

      if (states.includes(EnumNodeAndEdgeStatus.SELECTED)) {
        targetAttrs.inner.lineWidth = innerSize > 10 ? 4 : 2;
        targetAttrs.selected.r = outerSize / 2 + adjustment;
      }

      if (states.includes(EnumNodeAndEdgeStatus.LIGHT)) {
        targetAttrs.selected.r = outerSize / 2 + adjustment;
      }

      if (
        states.includes(EnumNodeAndEdgeStatus.DARK) ||
        states.includes(EnumNodeAndEdgeStatus.FILTERED)
      ) {
        targetAttrs.inner.stroke = GREY.dark;
        targetAttrs.inner.fill = GREY.dark;
        targetAttrs.icon.fill = GREY.dark;
        targetAttrs.label.fill = GREY.dark;
        targetAttrs.children.fill = GREY.normal;
        targetAttrs.childrenIcon.fill = GREY.dark;
      }

      // circleBorder.attr(targetAttrs.border);
      circleSelected.attr(targetAttrs.selected);
      circleInner.attr(targetAttrs.inner);
      circleIcon.attr(targetAttrs.icon);
      if (circleLabel) circleLabel.attr(targetAttrs.label);
      if (circleChildren) circleChildren.attr(targetAttrs.children);
      if (circleChildrenIcon) circleChildrenIcon.attr(targetAttrs.childrenIcon);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};
