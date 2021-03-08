import { useDispatch, useSelector } from 'react-redux';
import {
  GraphSelectors,
  GraphSlices,
  StyleOptions,
} from '../../../../redux/graph';

const useGroupEdges = () => {
  const dispatch = useDispatch();
  const { groupEdges }: StyleOptions = useSelector((state) =>
    GraphSelectors.getStyleOptions(state),
  );

  const toggle = () => {
    const params = {
      key: 'groupEdges',
      value: !groupEdges,
    };

    dispatch(GraphSlices.changeOptions(params));
  };

  return { groupEdges, toggle };
};

export default useGroupEdges;
