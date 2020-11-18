import React, { Fragment } from 'react';
import { useStyletron } from 'baseui';
import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { LabelSmall, ParagraphSmall } from 'baseui/typography';
import { changeNodeStyle } from '../../redux/graph-slice';
import { getGraph } from '../../redux';
import { getFieldNames } from '../../utils/graph-utils';

const MAX_LEGEND_SIZE = 8;

const Legend = ({ data }: { data: { [key: string]: string } }) => {
  const [css] = useStyletron();
  let valueArr = Object.keys(data);
  let colorArr = Object.values(data);
  if (valueArr.length > MAX_LEGEND_SIZE) {
    valueArr = valueArr.slice(0, MAX_LEGEND_SIZE);
    valueArr.push('Others');
    colorArr = colorArr.slice(0, MAX_LEGEND_SIZE);
    colorArr.push('grey');
  }
  return (
    <Fragment>
      {valueArr.map((value, i) => (
        <Block key={value} display='flex' alignItems='center'>
          <div
            className={css({
              height: '18px',
              width: '18px',
              marginRight: '16px',
              marginLeft: '8px',
              marginTop: '8px',
              marginBottom: '8px',
              backgroundColor: colorArr[i],
              borderRadius: '50%',
            })}
          />
          <LabelSmall>{value}</LabelSmall>
        </Block>
      ))}
    </Fragment>
  );
};

const LegendPopover = () => {
  const dispatch = useDispatch();
  const nodeStyle = useSelector(
    (state) => getGraph(state).styleOptions.nodeStyle,
  );

  let selectValue: any;
  if (
    nodeStyle.color &&
    nodeStyle.color.id === 'legend' &&
    nodeStyle.color.mapping
  ) {
    selectValue = [
      { id: nodeStyle.color.variable, label: nodeStyle.color.variable },
    ];
  } else {
    selectValue = [];
  }

  const graphFields = useSelector(
    (state) => getGraph(state).graphFlatten.metadata.fields,
  );

  const nodeOptions = getFieldNames(graphFields.nodes).map((x) => {
    return { id: x, label: x };
  });

  const updateNodeStyle = (data: any) => {
    const dispatchData = { color: { id: 'legend', variable: data[0].id } };
    dispatch(changeNodeStyle(dispatchData));
  };

  const switchToFixedColor = (e: React.MouseEvent) => {
    e.preventDefault();
    const dispatchData = { color: { id: 'fixed' } };
    dispatch(changeNodeStyle(dispatchData));
  };

  return (
    <Block padding='10px' width='300px'>
      <FormControl label='Legend selection'>
        <Select
          options={nodeOptions}
          onChange={(params: any) => updateNodeStyle(params.value)}
          size='compact'
          clearable={false}
          value={selectValue}
        />
      </FormControl>
      {nodeStyle.color &&
      nodeStyle.color.id === 'legend' &&
      nodeStyle.color.mapping ? (
        <Fragment>
          <Legend data={nodeStyle.color.mapping} />
          <Block display='flex' justifyContent='flex-end'>
            <Button
              kind='tertiary'
              size='compact'
              onClick={(e) => switchToFixedColor(e)}
            >
              Switch to fixed color
            </Button>
          </Block>
        </Fragment>
      ) : (
        <ParagraphSmall>Select a variable to map as legend</ParagraphSmall>
      )}
    </Block>
  );
};
export default LegendPopover;
