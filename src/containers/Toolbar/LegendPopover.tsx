import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Block } from 'baseui/block';
import { changeNodeStyle } from '../../redux/graph-slice';
import { getGraph } from '../../redux';
import { NestedForm, genNestedForm } from '../../components/form';
import { nodeColorForm } from '../SidePanel/OptionsPanel';
import { getFieldNames } from '../../utils/graph-utils';

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
    <div style={{ width: '300px' }}>
      <Block padding='10px'>
        <NestedForm
          data={genNestedForm(nodeColorForm, nodeStyle, updateNodeStyle, {
            'legend[0].options': nodeOptions,
          })}
        />
      </Block>
    </div>
  );
};
export default LegendPopover;
