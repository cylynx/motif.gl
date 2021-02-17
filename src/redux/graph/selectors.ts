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
} from './types';
import {
  deriveVisibleGraph,
  filterGraph,
  getField,
} from '../../containers/Graph/styles/utils';

const getGraph = (state: any): GraphState => state.investigate.graph.present;
const getAccessors = (state: any): Accessors => getGraph(state).accessors;
const getGraphList = (state: any): GraphList => getGraph(state).graphList;
const getGraphFlatten = (state: any): GraphData => getGraph(state).graphFlatten;
const getStyleOptions = (state: any): StyleOptions =>
  getGraph(state).styleOptions;
const getFilterOptions = (state: any): FilterOptions =>
  getGraph(state).filterOptions;

/** Selector to get graph data after it is filtered */
const getGraphFiltered = createSelector(
  [getGraphFlatten, getFilterOptions],
  (graphFlatten: GraphData, filterOptions: FilterOptions) => {
    const graphFiltered = produce(graphFlatten, (draftState: GraphData) => {
      filterGraph(draftState, filterOptions);
    });

    return graphFiltered;
  },
);

/** Selector to derive visible data */
const getGraphVisible = createSelector(
  [getGraphFiltered, getStyleOptions],
  (graphFiltered: GraphData, styleOptions: StyleOptions) => {
    const graphVisible = produce(graphFiltered, (draftState: GraphData) => {
      deriveVisibleGraph(draftState, styleOptions);
    });

    return graphVisible;
  },
);

/** Selector to get node fields as select options */
const getGraphFieldsOptions = createSelector(
  [getGraphFlatten],
  (graphFlatten: GraphData) => {
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
      if (name !== 'id' && name !== 'none') {
        allNodeFields.push({ id: name, label: name });
      }
      if (name !== 'id' && name !== 'degree') {
        layoutFields.push({ id: name, label: name });
      }
      if (type === 'integer' || type === 'real') {
        numericNodeFields.push({ id: name, label: name });
      }
    });
    const nodeLabelFields = [...allNodeFields, { id: 'none', label: 'none' }];

    getField(graphFields.edges).forEach(({ name, type }) => {
      if (name !== 'id' && name !== 'none') {
        allEdgeFields.push({ id: name, label: name });
      }
      if (type === 'integer' || type === 'real') {
        numericEdgeFields.push({ id: name, label: name });
      }
    });
    const edgeLabelFields = [...allEdgeFields, { id: 'none', label: 'none' }];

    return {
      allNodeFields,
      layoutFields,
      nodeLabelFields,
      numericNodeFields,
      allEdgeFields,
      edgeLabelFields,
      numericEdgeFields,
    };
  },
);

export {
  getGraph,
  getAccessors,
  getGraphList,
  getGraphFlatten,
  getStyleOptions,
  getFilterOptions,
  getGraphFiltered,
  getGraphVisible,
  getGraphFieldsOptions,
};
