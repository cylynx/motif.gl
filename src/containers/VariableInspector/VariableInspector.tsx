// @ts-nocheck
import React, {
  useContext,
  useState,
  useCallback,
  useMemo,
  Fragment,
} from 'react';
import { styled } from 'baseui';
import get from 'lodash/get';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { GraphRefContext } from '../Graph';
import SelectVariable from '../../components/SelectVariable';
import { RangePlot } from '../../components/plots';
import { getGraphFlatten, getGraphVisible } from '../../redux';
import { getFieldDomain } from '../../utils/data-utils';

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
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphVisible = useSelector((state) => getGraphVisible(state));
  const graphFields = graphFlatten.metadata.fields;

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
      for (const obj of graphVisible[selection[0].from]) {
        if (
          val[0] <= get(obj, selection[0].id) &&
          get(obj, selection[0].id) <= val[1]
        ) {
          graph.setItemState(obj.id, 'highlight.dark', false);
        } else {
          graph.setItemState(obj.id, 'highlight.dark', true);
        }
      }
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
        setHistogramProp({ domain, step, histogram, format: obj.format });
        setValue(domain);
      } else {
        setSelection([]);
        setHistogramProp({});
        setValue(false);
      }
    },
    [setSelection, setHistogramProp, setValue, graphFlatten],
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
          />
        )}
      </PlotDiv>
    </Fragment>
  );
};

export default VariableInspector;
