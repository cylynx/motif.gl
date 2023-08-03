import { useDispatch, useSelector } from '../../../redux/hooks';
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

  const updateEdgeStyle = (data: any) =>
    dispatch(GraphSlices.changeEdgeStyle(data));

  const updateEdgeMappingColor = (target: [string, string]) => {
    dispatch(GraphSlices.changeEdgeMappingColor(target));
  };

  return {
    edgeStyle,
    switchToFixEdgeColor,
    updateEdgeMappingColor,
    updateEdgeStyle,
  };
};

export default useEdgeStyle;
