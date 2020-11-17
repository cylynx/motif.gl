import React, { Fragment } from 'react';
import { useStyletron } from 'baseui';
import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { LabelSmall } from 'baseui/typography';
import { changeNodeStyle } from '../../redux/graph-slice';
import { getGraph } from '../../redux';
import { NestedForm, genNestedForm } from '../../components/form';
import { nodeColorForm } from '../SidePanel/OptionsPanel';
import { getFieldNames } from '../../utils/graph-utils';

const MAX_LEGEND_SIZE = 8;

const Legend = ({ data }: { [key: string]: string }) => {
  const [css] = useStyletron();
  let valueArr = Object.keys(data);
  let colorArr = Object.values(data);
  if (valueArr.length > MAX_LEGEND_SIZE) {
    valueArr = valueArr.slice(0, MAX_LEGEND_SIZE);
    valueArr.push('Others');
    colorArr = colorArr.slice(0, MAX_LEGEND_SIZE);
    colorArr.push(colorArr[MAX_LEGEND_SIZE - 1]);
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
  const graphFields = useSelector(
    (state) => getGraph(state).graphFlatten.metadata.fields,
  );

  const nodeOptions = getFieldNames(graphFields.nodes).map((x) => {
    return { id: x, label: x };
  });

  const updateNodeStyle = (data: any) => dispatch(changeNodeStyle(data));

  return (
    <Block padding='10px' width='300px'>
      <NestedForm
        data={genNestedForm(nodeColorForm, nodeStyle, updateNodeStyle, {
          'legend[0].options': nodeOptions,
        })}
      />
      {nodeStyle.color.id === 'legend' && nodeStyle.color.mapping && (
        // @ts-ignore
        <Legend data={nodeStyle.color.mapping} />
      )}
    </Block>
  );
};
export default LegendPopover;
