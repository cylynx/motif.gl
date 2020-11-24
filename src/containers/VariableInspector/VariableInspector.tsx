// @ts-nocheck
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import SelectVariable from '../../components/SelectVariable';
import { RangePlot } from '../../components/plots';
import { getGraphFlatten } from '../../redux';
import { getTimestampFieldDomain } from '../../utils/data-utils';

const validTypes = ['integer', 'real', 'timestamp', 'date'];

const VariableInspector = () => {
  const [histogramProp, setHistogramProp] = useState({});
  const [value, setValue] = useState(false);
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphFields = graphFlatten.metadata.fields;

  const nodeOptions = graphFields.nodes
    .filter((f) => validTypes.includes(f.type))
    .map((f) => {
      return { id: f.name, label: f.name, type: f.type, from: 'nodes' };
    });
  const edgeOptions = graphFields.edges
    .filter((f) => validTypes.includes(f.type))
    .map((f) => {
      return { id: f.name, label: f.name, type: f.type, from: 'edges' };
    });

  const onChangeSelected = (obj) => {
    if (obj?.id) {
      const { domain, step, histogram } = getTimestampFieldDomain(
        graphFlatten[obj.from],
        (x) => x[obj.id],
      );
      setHistogramProp({ domain, step, histogram });
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
      {histogramProp.step && histogramProp.domain && histogramProp.histogram && (
        <Block paddingLeft='scale700' paddingRight='scale600'>
          <RangePlot
            value={value}
            step={histogramProp.step}
            onChange={(val) => setValue(val)}
            range={histogramProp.domain}
            histogram={histogramProp.histogram}
          />
        </Block>
      )}
    </Fragment>
  );
};

export default VariableInspector;
