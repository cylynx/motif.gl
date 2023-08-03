import { useDispatch, useSelector } from '../../../redux/hooks';
import { DEFAULT_NODE_STYLE } from '../../../constants/graph-shapes';
import { GraphSelectors, GraphSlices } from '../index';

const useNodeStyle = () => {
  const dispatch = useDispatch();
  const nodeStyle = useSelector(
    (state) => GraphSelectors.getStyleOptions(state).nodeStyle,
  );

  const switchToFixNodeColor = () => {
    const dispatchData = {
      color: { id: 'fixed', value: DEFAULT_NODE_STYLE.color },
    };
    dispatch(GraphSlices.changeNodeStyle(dispatchData));
  };

  const updateNodeStyle = (data: any) => {
    dispatch(GraphSlices.changeNodeStyle(data));
  };

  const updateNodeMappingColor = (target: [string, string]) => {
    dispatch(GraphSlices.changeNodeMappingColor(target));
  };

  return {
    nodeStyle,
    switchToFixNodeColor,
    updateNodeStyle,
    updateNodeMappingColor,
  };
};

export default useNodeStyle;
