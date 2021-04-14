import React, {
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  Fragment,
} from 'react';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import { styled } from 'baseui';
import { Block } from 'baseui/block';
import { LabelSmall, ParagraphSmall } from 'baseui/typography';
import { GraphinContextType, IUserEdge, IUserNode } from '@antv/graphin';
import isEmpty from 'lodash/isEmpty';
import { IEdge, INode } from '@antv/g6';
import { GraphRefContext } from '../Graph';
import SelectVariable from '../../components/SelectVariable';
import { RangePlot } from '../../components/plots';
import {
  AnimationController,
  PlaybackControls,
} from '../../components/AnimationController';
import { Field, GraphData, GraphSelectors } from '../../redux/graph';
import {
  getFieldDomain,
  TimeRangeFieldDomain,
  unixTimeConverter,
} from '../../utils/data-utils/data-utils';
import { TPlotDiv, THistogramProp } from './types';

const dateTimeAnalyzerTypes = ['DATETIME', 'DATE', 'TIME'];
const validTypes = ['integer', 'real', 'timestamp', 'date'];

export const PlotDiv = styled('div', ({ $theme, $expanded }: TPlotDiv) => {
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
  const graphRef = useContext(GraphRefContext) as GraphinContextType;
  const [selection, setSelection] = useState([]);
  const [histogramProp, setHistogramProp] = useState<THistogramProp>({});
  const [value, setValue] = useState<number[]>([]);
  const [speed, setSpeed] = useState<number>(1);

  const graphFlatten: GraphData = useSelector((state) =>
    GraphSelectors.getGraphFlatten(state),
  );
  const graphVisible = useSelector((state) =>
    GraphSelectors.getGraphVisible(state),
  );
  const graphFields = graphFlatten.metadata.fields;

  /**
   * Any modification on the graph visible shall reset variable inspector.
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
  }, [graphVisible]);

  const onChangeSpeed = useCallback(() => {
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
  }, [speed, setSpeed]);

  const nodeOptions = useMemo(
    () =>
      graphFields.nodes
        .filter((f: Field) => validTypes.includes(f.type))
        .map((f) => {
          const optionKey = `nodes-${f.name}`;
          return {
            id: f.name,
            label: f.name,
            type: f.type,
            analyzerType: f.analyzerType,
            format: f.format,
            from: 'nodes',
            optionKey,
          };
        }),
    [graphFields],
  );

  const edgeOptions = useMemo(
    () =>
      graphFields.edges
        .filter((f: Field) => validTypes.includes(f.type))
        .map((f) => {
          const optionKey = `edges-${f.name}`;
          return {
            id: f.name,
            label: f.name,
            type: f.type,
            analyzerType: f.analyzerType,
            format: f.format,
            from: 'edges',
            optionKey,
          };
        }),
    [graphFields],
  );

  const onChangeRange = useCallback(
    (val) => {
      setValue(val);
      const { graph } = graphRef;
      const { from, id, analyzerType, format } = selection[0];
      const isDateTime: boolean = dateTimeAnalyzerTypes.includes(analyzerType);

      graph.setAutoPaint(false);
      if (from === 'nodes') {
        graphVisible.nodes.forEach((node: IUserNode) => {
          let prop = get(node, id);

          if (isDateTime) {
            prop = unixTimeConverter(prop, analyzerType, format);
          }

          const [startRange, endRange] = val;
          const nodeId: string = node.id;
          if (startRange <= prop && prop <= endRange) {
            graph.clearItemStates(nodeId, ['disabled']);
          } else {
            graph.setItemState(nodeId, 'disabled', true);
          }
        });
      } else {
        graphVisible.edges.forEach((edge: IUserEdge) => {
          let prop = get(edge, id);
          let condition: boolean;

          if (isDateTime) {
            if (Array.isArray(prop)) {
              prop = prop.map((el: string) =>
                unixTimeConverter(el, analyzerType, format),
              );
            } else {
              prop = unixTimeConverter(prop, analyzerType, format);
            }
          }

          if (Array.isArray(prop)) {
            condition = prop.some((el: any) => {
              return val[0] <= el && el <= val[1];
            });
          } else {
            condition = val[0] <= prop && prop <= val[1];
          }

          const edgeID: string = edge.id;
          if (condition) {
            graph.setItemState(edgeID, 'disabled', false);
          } else {
            graph.setItemState(edgeID, 'disabled', true);
          }
        });
      }
      graph.paint();
      graph.setAutoPaint(true);
    },
    [setValue, graphRef, selection, graphVisible],
  );

  const onChangeSelected = useCallback(
    (obj) => {
      if (obj?.id) {
        const fieldDomain = getFieldDomain(
          graphVisible[obj.from],
          (x) => x[obj.id],
          obj.analyzerType,
          obj.format,
        );

        setSelection([obj]);
        if (fieldDomain === false) {
          setHistogramProp({});
          setValue([]);
          return;
        }

        const { domain, step, histogram } = fieldDomain as TimeRangeFieldDomain;
        setHistogramProp({
          domain,
          step,
          histogram,
          format: obj.format,
          analyzerType: obj.analyzerType,
        });
        setValue(domain);
        return;
      }

      const { graph } = graphRef;
      graph.setAutoPaint(false);
      graph.getNodes().forEach((node) => {
        graph.clearItemStates(node, 'disabled');
      });
      graph.getEdges().forEach((edge) => {
        graph.clearItemStates(edge, 'disabled');
      });
      graph.paint();
      graph.setAutoPaint(true);
      setSelection([]);
      setHistogramProp({});
      setValue([]);
    },
    [graphRef, setSelection, setHistogramProp, setValue, graphVisible],
  );

  const LabelSmallMemo = useMemo(
    () => <LabelSmall>Variable Inspector</LabelSmall>,
    [],
  );

  const SelectVariableMemo = useMemo(
    () => (
      <SelectVariable
        value={selection}
        options={{ Nodes: nodeOptions, Edges: edgeOptions }}
        onChange={(obj) => onChangeSelected(obj)}
        valueKey='optionKey'
      />
    ),
    [selection, nodeOptions, edgeOptions, onChangeSelected],
  );

  return (
    <Fragment>
      <Block display='flex' height='50px'>
        {LabelSmallMemo}
        {SelectVariableMemo}
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
      <PlotDiv $expanded={selection.length !== 0}>
        {histogramProp.histogram && (
          <RangePlot
            value={value as [number, number]}
            step={histogramProp.step}
            onChange={onChangeRange}
            range={histogramProp.domain}
            histogram={histogramProp.histogram}
            xAxisFormat={histogramProp.format}
            dataType={histogramProp.analyzerType}
          />
        )}
        {isEmpty(histogramProp) && selection.length !== 0 && (
          <Block
            height='inherit'
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            <ParagraphSmall>
              Data not found after edge is grouped.
            </ParagraphSmall>
          </Block>
        )}
      </PlotDiv>
    </Fragment>
  );
};

export default VariableInspector;
