import { useDispatch, useSelector } from 'react-redux';
import { EDGE_DEFAULT_COLOR } from '../../../constants/graph-shapes';
import { GraphSelectors, GraphSlices } from '../index';

const useEdgeStyle = () => {
  const dispatch = useDispatch();
  const edgeStyle = useSelector(
    (state) => GraphSelectors.getStyleOptions(state).edgeStyle,
  );

  const switchToFixEdgeColor = () => {
    const dispatchData = {
      color: { id: 'fixed', value: EDGE_DEFAULT_COLOR },
    };
    dispatch(GraphSlices.changeEdgeStyle(dispatchData));
  };

  return { edgeStyle, switchToFixEdgeColor };
};

export default useEdgeStyle;
