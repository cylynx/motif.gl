import { useDispatch, useSelector } from '../../../redux/hooks';
import { changeLayout } from '../slice';
import { LayoutParams } from '../types';
import { getStyleOptions } from '../selectors';

const useLayout = () => {
  const dispatch = useDispatch();

  const layout = useSelector((state) => getStyleOptions(state).layout);

  const changeGraphLayout = (layout: LayoutParams) => {
    dispatch(changeLayout(layout));
  };

  return { layout, changeGraphLayout };
};

export default useLayout;
