import { useDispatch, useSelector } from 'react-redux';
import { Value } from 'baseui/select';
import { NodeConfig } from '@antv/graphin';
import {
  SearchOptionPayload,
  GraphSlices,
  GraphSelectors,
  EdgeNode,
  GraphAttribute,
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

  const updateEdgeSearch = (value: Value): void => {
    const payload: SearchOptionPayload = {
      key: 'edgeSearchCase',
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

  const updateTabs = (activeTab: GraphAttribute): void => {
    const payload: SearchOptionPayload = {
      key: 'activeTabs',
      value: activeTab,
    };

    dispatch(GraphSlices.updateSearchOptions(payload));
  };

  const displayNodeInformation = (nodeConfigs: NodeConfig[]) => {
    console.log(nodeConfigs);
  };

  return {
    searchOptions,
    updateNodeSearch,
    updateEdgeSearch,
    updateSearchResults,
    updateTabs,
    displayNodeInformation,
  };
};

export default useSearchOption;
