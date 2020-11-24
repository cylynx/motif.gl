// @ts-nocheck
import React, { Fragment, useState } from 'react';
import { styled } from 'baseui';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import SelectVariable from '../../components/SelectVariable';
import { RangePlot } from '../../components/plots';
import { getGraphFlatten } from '../../redux';
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
  const [histogramProp, setHistogramProp] = useState({});
  const [value, setValue] = useState(false);
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphFields = graphFlatten.metadata.fields;

  const nodeOptions = graphFields.nodes
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
    });
  const edgeOptions = graphFields.edges
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
    });

  const onChangeSelected = (obj) => {
    if (obj?.id) {
      const { domain, step, histogram } = getFieldDomain(
        graphFlatten[obj.from],
        (x) => x[obj.id],
        obj.analyzerType,
      );
      setHistogramProp({ domain, step, histogram, format: obj.format });
      setValue(domain);
    } else {
      setHistogramProp({});
      setValue(false);
    }
  };

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
          options={{ Nodes: nodeOptions, Edges: edgeOptions }}
          onChange={(obj) => onChangeSelected(obj)}
        />
      </Block>
      <PlotDiv $expanded={histogramProp.histogram}>
        {histogramProp.histogram && (
          <RangePlot
            value={value}
            step={histogramProp.step}
            onChange={(val) => setValue(val)}
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
