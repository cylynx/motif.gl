import React, { Fragment } from 'react';
import { useStyletron } from 'baseui';
import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { FormControl } from 'baseui/form-control';
import { Select } from 'baseui/select';
import { LabelSmall, ParagraphSmall } from 'baseui/typography';
import { GraphSelectors, GraphSlices } from '../../redux/graph';
import { CATEGORICAL_COLOR } from '../../constants/colors';
import { DEFAULT_NODE_STYLE } from '../../constants/graph-shapes';
import useNodeStyle from '../../redux/graph/hooks/useNodeStyle';

const MAX_LEGEND_SIZE = CATEGORICAL_COLOR.length;

const Legend = ({ data }: { data: { [_: string]: string } }) => {
  const [css] = useStyletron();
  let valueArr = Object.keys(data);
  let colorArr = Object.values(data);
  if (valueArr.length > MAX_LEGEND_SIZE) {
    valueArr = valueArr.slice(0, MAX_LEGEND_SIZE);
    valueArr.push('Others');
    colorArr = colorArr.slice(0, MAX_LEGEND_SIZE);
    colorArr.push(CATEGORICAL_COLOR[MAX_LEGEND_SIZE - 1]);
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
          <LabelSmall width='250px' marginBottom='8px'>
            {value}
          </LabelSmall>
        </Block>
      ))}
    </Fragment>
  );
};

const LegendPopover = () => {
  const dispatch = useDispatch();
  const { switchToFixNodeColor } = useNodeStyle();
  const nodeStyle = useSelector(
    (state) => GraphSelectors.getStyleOptions(state).nodeStyle,
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

  const { allNodeFields } = useSelector((state) =>
    GraphSelectors.getGraphFieldsOptions(state),
  );

  const updateNodeStyle = (data: any): void => {
    const dispatchData = { color: { id: 'legend', variable: data[0].id } };
    dispatch(GraphSlices.changeNodeStyle(dispatchData));
  };

  const switchToFixedColor = (e: React.MouseEvent): void => {
    e.preventDefault();
    switchToFixNodeColor();
  };

  return (
    <Block width='300px'>
      <FormControl label='Legend Selection'>
        <Select
          id='legendSelection'
          options={allNodeFields}
          onChange={(params: any) => updateNodeStyle(params.value)}
          size='compact'
          clearable={false}
          value={selectValue}
          maxDropdownHeight='300px'
        />
      </FormControl>
      {nodeStyle.color &&
      nodeStyle.color.id === 'legend' &&
      nodeStyle.color.mapping ? (
        <Fragment>
          <Legend data={nodeStyle.color.mapping} />
          <Block display='flex' justifyContent='flex-end'>
            <Button
              data-testid='switchFixedColor'
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
