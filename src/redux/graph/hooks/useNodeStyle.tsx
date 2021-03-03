import { useDispatch, useSelector } from 'react-redux';
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

  return { nodeStyle, switchToFixNodeColor };
};

export default useNodeStyle;
