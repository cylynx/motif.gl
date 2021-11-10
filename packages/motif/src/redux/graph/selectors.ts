import { createSelector } from '@reduxjs/toolkit';
import { Option } from 'baseui/select';
import produce from 'immer';
import {
  Accessors,
  GraphList,
  GraphData,
  StyleOptions,
  FilterOptions,
  GraphState,
  SearchOptions,
  ItemProperties,
  SearchOptPagination,
} from './types';
import {
  deriveVisibleGraph,
  filterGraph,
  paginateItems,
  getField,
  combineProcessedData,
} from '../../utils/graph-utils/utils';
import { IGraphSelector } from './interfaces';

const getGraph = (state: any): GraphState => state.investigate.graph.present;
const getAccessors = (state: any): Accessors => getGraph(state).accessors;
const getGraphList = (state: any): GraphList => getGraph(state).graphList;

// obtain the grouped edges graph flatten
const getGraphFlatten = (state: any): GraphData => getGraph(state).graphFlatten;
const getStyleOptions = (state: any): StyleOptions =>
  getGraph(state).styleOptions;
const getFilterOptions = (state: any): FilterOptions =>
  getGraph(state).filterOptions;
const getSearchOptions = (state: any): SearchOptions =>
  getGraph(state).searchOptions;
const getSelectedItems = (state: any): ItemProperties =>
  getSearchOptions(state).results;
const getItemsPagination = (state: any): SearchOptPagination =>
  getSearchOptions(state).pagination;

const getPaginateItems: IGraphSelector['getPaginateItems'] = createSelector(
  [getSelectedItems, getItemsPagination],
  (selectedItems: ItemProperties, pagination: SearchOptPagination) => {
    const paginatedItems = paginateItems(selectedItems, pagination);
    return paginatedItems;
  },
);

/** Selector to get graph data after it is filtered */
const getGraphFiltered: IGraphSelector['getGraphFiltered'] = createSelector(
  [getGraphFlatten, getFilterOptions],
  (graphFlatten: GraphData, filterOptions: FilterOptions) => {
    const graphFiltered = produce(graphFlatten, (draftState: GraphData) => {
      filterGraph(draftState, filterOptions);
    });

    return graphFiltered;
  },
);

/** Selector to derive visible data */
const getGraphVisible: IGraphSelector['getGraphVisible'] = createSelector(
  [getGraphFiltered, getStyleOptions],
  (graphFiltered: GraphData, styleOptions: StyleOptions) => {
    const graphVisible = produce(graphFiltered, (draftState: GraphData) => {
      deriveVisibleGraph(draftState, styleOptions);
    });

    return graphVisible;
  },
);

/** Selector to derive visible node ids */
const getGraphVisibleNodeOptions: IGraphSelector['getGraphVisibleNodeOptions'] =
  createSelector([getGraphVisible], (graphVisible: GraphData) => {
    const nodeIdOptions: Option[] = graphVisible.nodes.map((n) => {
      return { id: n.id, label: n.id };
    });
    return nodeIdOptions;
  });

/** Selector to get node fields as select options */
const getGraphFieldsOptions: IGraphSelector['getGraphFieldsOptions'] =
  createSelector([getGraphFlatten], (graphFlatten: GraphData) => {
    const graphFields = graphFlatten.metadata.fields;

    const allNodeFields: Option[] = [{ id: 'id', label: 'id' }];
    const numericNodeFields: Option[] = [];
    const allEdgeFields: Option[] = [{ id: 'id', label: 'id' }];
    const numericEdgeFields: Option[] = [];
    const layoutFields: Option[] = [
      { id: 'id', label: 'id' },
      { id: 'degree', label: 'degree' },
    ];

    getField(graphFields.nodes).forEach(({ name, type }) => {
      if (name !== 'id') {
        allNodeFields.push({ id: name, label: name });
      }
      if (name !== 'id' && name !== 'degree') {
        layoutFields.push({ id: name, label: name, type });
      }
      if (type === 'integer' || type === 'real') {
        numericNodeFields.push({ id: name, label: name, type });
      }
    });
    const nodeLabelFields = [...allNodeFields];

    getField(graphFields.edges).forEach(({ name, type }) => {
      if (name !== 'id') {
        allEdgeFields.push({ id: name, label: name });
      }
      if (type === 'integer' || type === 'real') {
        numericEdgeFields.push({ id: name, label: name, type });
      }
    });
    const edgeLabelFields = [...allEdgeFields];

    return {
      allNodeFields,
      layoutFields,
      nodeLabelFields,
      numericNodeFields,
      allEdgeFields,
      edgeLabelFields,
      numericEdgeFields,
    };
  });

// obtain the ungroup edges graph flatten
const getUngroupedGraphFlatten: IGraphSelector['getUngroupedGraphFlatten'] =
  createSelector([getGraphList], (graphList: GraphList) => {
    let ungroupedGraphFlatten: GraphData = {
      nodes: [],
      edges: [],
      metadata: { fields: { nodes: [], edges: [] } },
    };
    graphList.forEach((graphData: GraphData) => {
      ungroupedGraphFlatten = combineProcessedData(
        graphData,
        ungroupedGraphFlatten,
      );
    });

    return ungroupedGraphFlatten;
  });

export {
  getGraph,
  getAccessors,
  getGraphList,
  getGraphFlatten,
  getStyleOptions,
  getFilterOptions,
  getSearchOptions,
  getPaginateItems,
  getGraphFiltered,
  getGraphVisible,
  getGraphVisibleNodeOptions,
  getGraphFieldsOptions,
  getUngroupedGraphFlatten,
};
