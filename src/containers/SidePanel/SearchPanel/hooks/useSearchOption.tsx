import { useDispatch, useSelector } from 'react-redux';
import { Value } from 'baseui/select';
import {
  SearchOptionPayload,
  GraphSlices,
  GraphSelectors,
  EdgeNode,
} from '../../../../redux/graph';
import { IUseSearchOptions } from '../types';
import { RootState } from '../../../../redux/investigate';

const useSearchOption = (): IUseSearchOptions => {
  const dispatch = useDispatch();
  const searchOptions = useSelector((state: RootState) =>
    GraphSelectors.getSearchOptions(state),
  );

  const updateNodeSearch = (value: Value): void => {
    const payload: SearchOptionPayload = {
      key: 'nodeSearchCase',
      value,
    };

    dispatch(GraphSlices.updateSearchOptions(payload));
  };

  const updateSearchResults = (results: EdgeNode[]): void => {
    const payload: SearchOptionPayload = {
      key: 'results',
      value: results,
    };

    dispatch(GraphSlices.updateSearchOptions(payload));
  };

  return { searchOptions, updateNodeSearch, updateSearchResults };
};

export default useSearchOption;
