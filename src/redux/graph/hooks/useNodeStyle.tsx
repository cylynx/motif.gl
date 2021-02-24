import { useDispatch } from 'react-redux';
import { DEFAULT_NODE_STYLE } from '../../../constants/graph-shapes';
import { GraphSlices } from '../index';

const useNodeStyle = () => {
  const dispatch = useDispatch();

  const switchToFixNodeColor = () => {
    const dispatchData = {
      color: { id: 'fixed', value: DEFAULT_NODE_STYLE.color },
    };
    dispatch(GraphSlices.changeNodeStyle(dispatchData));
  };

  return { switchToFixNodeColor };
};

export default useNodeStyle;
