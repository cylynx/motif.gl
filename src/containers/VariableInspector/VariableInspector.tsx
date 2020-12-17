// @ts-nocheck
import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  Fragment,
} from 'react';
import { styled } from 'baseui';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { Node, Edge } from '@antv/graphin';
import { GraphRefContext, EnumNodeAndEdgeStatus } from '../Graph';
import SelectVariable from '../../components/SelectVariable';
import { RangePlot } from '../../components/plots';
import {
  AnimationController,
  PlaybackControls,
} from '../../components/animation-controller';
import { getGraphFlatten, getGraphVisible } from '../../redux';
import { getFieldDomain, unixTimeConverter } from '../../utils/data-utils';

const dateTimeAnalyzerTypes = ['DATETIME', 'DATE', 'TIME'];
const validTypes = ['integer', 'real', 'timestamp', 'date'];

export const PlotDiv = styled('div', ({ $theme, $expanded }) => {
  const { animation, sizing } = $theme;
  return {
    paddingLeft: sizing.scale700,
    paddingRight: sizing.scale600,
    height: $expanded ? '150px' : 0,
    transitionProperty: 'all',
    transitionDuration: animation.timing400,
    transitionTimingFunction: animation.easeInOutCurve,
  };
});

const VariableInspector = () => {
  const graphRef = useContext(GraphRefContext);
  const [selection, setSelection] = useState([]);
  const [histogramProp, setHistogramProp] = useState({});
  const [value, setValue] = useState(false);
  const [speed, setSpeed] = useState(1);
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphVisible = useSelector((state) => getGraphVisible(state));
  const graphFields = graphFlatten.metadata.fields;

  /**
   * Any modification on the data list shall reset variable inspector.
   * - Prevent misleading use-case. (inspector values remain when no data in canvas)
   * - Prevent incosistencies during time-series analysis.
   * - Old selection, histogram and x-axis remains
   *   - does not update when new data had imported.
   *   - when specific data layer is hidden.
   *
   * @see
   * https://github.com/cylynx/motif.gl/issues/17
   */
  useEffect(() => {
    setSelection([]);
    setHistogramProp({});
    setValue([]);
  }, [graphFlatten]);

  const onChangeSpeed = useCallback(
    // eslint-disable-next-line no-shadow
    () => {
      if (speed === 1) {
        setSpeed(2);
      } else if (speed === 2) {
        setSpeed(4);
      } else if (speed === 4) {
        setSpeed(8);
      } else if (speed === 8) {
        setSpeed(16);
      } else if (speed === 16) {
        setSpeed(1);
      }
    },
    [speed, setSpeed],
  );

  const nodeOptions = useMemo(
    () =>
      graphFields.nodes
        .filter((f) => validTypes.includes(f.type))
        .map((f) => {
          return {
            id: f.name,
            label: f.name,
            type: f.type,
            analyzerType: f.analyzerType,
            format: f.format,
            from: 'nodes',
          };
        }),
    [graphFields],
  );

  const edgeOptions = useMemo(
    () =>
      graphFields.edges
        .filter((f) => validTypes.includes(f.type))
        .map((f) => {
          return {
            id: f.name,
            label: f.name,
            type: f.type,
            analyzerType: f.analyzerType,
            format: f.format,
            from: 'edges',
          };
        }),
    [graphFields],
  );

  const onChangeRange = useCallback(
    (val) => {
      setValue(val);
      const { graph } = graphRef;
      const { from, id, analyzerType } = selection[0];
      const isDateTime = dateTimeAnalyzerTypes.includes(analyzerType);
      graph.setAutoPaint(false);
      if (from === 'nodes') {
        for (const obj of graphVisible.nodes) {
          let prop = get(obj, id);
          if (isDateTime) {
            prop = unixTimeConverter(prop, analyzerType);
          }
          if (val[0] <= prop && prop <= val[1]) {
            graph.setItemState(obj.id, EnumNodeAndEdgeStatus.FILTERED, false);
          } else {
            graph.setItemState(obj.id, EnumNodeAndEdgeStatus.FILTERED, true);
          }
        }
      } else {
        for (const obj of graphVisible.edges) {
          let prop = get(obj, id);
          if (isDateTime) {
            if (Array.isArray(prop)) {
              // eslint-disable-next-line no-loop-func
              prop = prop.map((el: string) =>
                unixTimeConverter(el, analyzerType),
              );
            } else {
              prop = unixTimeConverter(prop, analyzerType);
            }
          }
          let condition = true;
          if (Array.isArray(prop)) {
            condition = prop.some((el: any) => {
              return val[0] <= el && el <= val[1];
            });
          } else {
            condition = val[0] <= prop && prop <= val[1];
          }
          if (condition) {
            graph.setItemState(obj.id, EnumNodeAndEdgeStatus.FILTERED, false);
          } else {
            graph.setItemState(obj.id, EnumNodeAndEdgeStatus.FILTERED, true);
          }
        }
      }
      graph.paint();
      graph.setAutoPaint(true);
    },
    [setValue, graphRef, selection, graphVisible],
  );

  const onChangeSelected = useCallback(
    (obj) => {
      if (obj?.id) {
        const { domain, step, histogram } = getFieldDomain(
          graphFlatten[obj.from],
          (x) => x[obj.id],
          obj.analyzerType,
        );
        setSelection([obj]);
        setHistogramProp({
          domain,
          step,
          histogram,
          format: obj.format,
          type: obj.type,
        });
        setValue(domain);
      } else {
        const { graph } = graphRef;
        graph.setAutoPaint(false);
        graph.getNodes().forEach((node: Node) => {
          graph.clearItemStates(node, EnumNodeAndEdgeStatus.FILTERED);
        });
        graph.getEdges().forEach((edge: Edge) => {
          graph.clearItemStates(edge, EnumNodeAndEdgeStatus.FILTERED);
        });
        graph.paint();
        graph.setAutoPaint(true);
        setSelection([]);
        setHistogramProp({});
        setValue(false);
      }
    },
    [graphRef, setSelection, setHistogramProp, setValue, graphFlatten],
  );

  return (
    <Fragment>
      <Block
        display='flex'
        height='50px'
        paddingTop='scale600'
        paddingLeft='scale600'
        paddingRight='scale600'
      >
        <LabelSmall width='100px'>Variable Inspector</LabelSmall>
        <SelectVariable
          value={selection}
          options={{ Nodes: nodeOptions, Edges: edgeOptions }}
          onChange={(obj) => onChangeSelected(obj)}
        />
        {histogramProp.histogram && (
          <AnimationController
            value={value}
            domain={histogramProp.domain}
            speed={speed}
            updateAnimation={(newValue) => {
              onChangeRange(newValue);
            }}
          >
            {(animating, start, pause, reset) => (
              <PlaybackControls
                isAnimating={animating}
                onPlay={start}
                onPause={pause}
                onReset={reset}
                onChangeSpeed={onChangeSpeed}
              />
            )}
          </AnimationController>
        )}
      </Block>
      <PlotDiv $expanded={histogramProp.histogram}>
        {histogramProp.histogram && (
          <RangePlot
            value={value}
            step={histogramProp.step}
            onChange={onChangeRange}
            range={histogramProp.domain}
            histogram={histogramProp.histogram}
            xAxisFormat={histogramProp.format}
            dataType={histogramProp.type}
          />
        )}
      </PlotDiv>
    </Fragment>
  );
};

export default VariableInspector;
