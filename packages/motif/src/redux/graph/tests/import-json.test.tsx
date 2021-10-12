// ts-nocheck
import { render } from '@testing-library/react';
import React from 'react';
import { ToasterContainer } from 'baseui/toast';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import {
  initialState,
  addQuery,
  processGraphResponse,
  updateStyleOption,
} from '../slice';
import { importJson } from '../processors/import';
import { Accessors } from '../types';

import * as Constant from './constants/positive';
import { importJsonData } from '../thunk';
import {
  clearError,
  fetchBegin,
  fetchDone,
  updateToast,
  closeModal,
} from '../../ui/slice';
import { resetState } from '../../import/fileUpload/slice';
import { combineGraphs } from '../../../utils/graph-utils/utils';

const mockStore = configureStore([thunk]);
const getStore = () => {
  const graphState = cloneDeep(initialState);
  const store = {
    investigate: {
      ui: {},
      widget: {},
      graph: {
        present: graphState,
      },
    },
  };
  return store;
};

describe('Import JSON', () => {
  let store;
  beforeEach(() => {
    render(<ToasterContainer />);
    store = mockStore(getStore());
  });

  afterEach(() => {
    store.clearActions();
  });

  it('should process custom accessors with numeric values accurately', async (done) => {
    const importDataArr = [Constant.simpleGraphThree];
    const groupEdgeToggle = false;

    const customAccessors: Accessors = {
      nodeID: 'custom_id',
      edgeID: 'id',
      edgeSource: 'custom_source',
      edgeTarget: 'custom_target',
    };

    // processes
    const batchDataPromises = importDataArr.map((graphData) => {
      const { data } = graphData;
      return importJson(data as any, customAccessors, groupEdgeToggle);
    });

    const graphDataArr = await Promise.all(batchDataPromises);
    const [graphData] = flatten(graphDataArr);

    // group edge configuration arrangements
    const groupEdgeConfig = { availability: false, toggle: groupEdgeToggle };
    Object.assign(graphData.metadata.groupEdges, groupEdgeConfig);

    const expectedActions = [
      fetchBegin(),
      addQuery([graphData]),
      processGraphResponse({
        data: graphData,
        accessors: customAccessors,
      }),
      updateToast('toast-0'),
      resetState(),
      clearError(),
      fetchDone(),
      closeModal(),
    ];

    return store
      .dispatch(
        importJsonData(importDataArr as any, groupEdgeToggle, customAccessors),
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 50);
      });
  });

  it('should receive array of importData and process graph responses accurately', async (done) => {
    // input
    const importDataArr = [Constant.jsonDataOne, Constant.jsonDataTwo];
    const groupEdgeToggle = false;

    // processes
    const batchDataPromises = importDataArr.map((graphData) => {
      const { data } = graphData;
      return importJson(data as any, initialState.accessors, groupEdgeToggle);
    });

    const graphDataArr = await Promise.all(batchDataPromises);
    const [firstGraphData, secondGraphData] = flatten(graphDataArr);

    // group edge configuration arrangements
    const groupEdgeConfig = { availability: false, toggle: groupEdgeToggle };
    Object.assign(firstGraphData.metadata.groupEdges, groupEdgeConfig);
    Object.assign(secondGraphData.metadata.groupEdges, groupEdgeConfig);

    const combinedGraph = combineGraphs([firstGraphData, secondGraphData]);

    // expected results
    const expectedActions = [
      fetchBegin(),
      addQuery([firstGraphData, secondGraphData]),
      processGraphResponse({
        data: combinedGraph,
        accessors: initialState.accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      clearError(),
      fetchDone(),
      closeModal(),
    ];

    // assertions
    return store
      .dispatch(
        importJsonData(
          importDataArr as any,
          groupEdgeToggle,
          initialState.accessors,
        ),
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 50);
      });
  });

  it('should display different success message in toast with filter applied', async (done) => {
    const currentStore = getStore();
    Object.assign(currentStore.investigate.graph.present.filterOptions, {
      value: 'something',
    });

    const modifiedStore = mockStore(currentStore) as any;

    // input
    const importDataArr = [Constant.jsonDataOne, Constant.jsonDataTwo];
    const groupEdgeToggle = false;

    // processes
    const batchDataPromises = importDataArr.map((graphData) => {
      const { data } = graphData;
      return importJson(data as any, initialState.accessors, groupEdgeToggle);
    });

    const graphDataArr = await Promise.all(batchDataPromises);
    const [firstGraphData, secondGraphData] = flatten(graphDataArr);

    // group edge configuration arrangements
    const groupEdgeConfig = { availability: false, toggle: groupEdgeToggle };
    firstGraphData.metadata.groupEdges = groupEdgeConfig;
    secondGraphData.metadata.groupEdges = groupEdgeConfig;

    const mergedGraph = combineGraphs([firstGraphData, secondGraphData]);

    // expected results
    const expectedActions = [
      fetchBegin(),
      addQuery([firstGraphData, secondGraphData]),
      processGraphResponse({
        data: mergedGraph,
        accessors: initialState.accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      clearError(),
      fetchDone(),
      closeModal(),
    ];

    // @ts-ignore
    return modifiedStore
      .dispatch(
        importJsonData(
          importDataArr as any,
          groupEdgeToggle,
          initialState.accessors,
        ),
      )
      .then(() => {
        setTimeout(() => {
          expect(modifiedStore.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
  });

  it('should overwrite styles with the last file', async (done) => {
    // input
    const importDataArr = [Constant.jsonDataOne, Constant.jsonDataTwo];
    let { styleOptions } = initialState;
    const groupEdgeToggle = false;

    // processes
    const batchDataPromises = importDataArr.map((graphData) => {
      const { data, style } = graphData as any;

      if (style) {
        styleOptions = style;
      }

      return importJson(data, initialState.accessors, groupEdgeToggle);
    });

    const graphDataArr = await Promise.all(batchDataPromises);
    const [firstGraphData, secondGraphData] = flatten(graphDataArr);

    // group edge configuration arrangements
    const groupEdgeConfig = { availability: false, toggle: groupEdgeToggle };
    firstGraphData.metadata.groupEdges = groupEdgeConfig;
    secondGraphData.metadata.groupEdges = groupEdgeConfig;

    const mergedGraph = combineGraphs([firstGraphData, secondGraphData]);

    // expected results
    const expectedActions = [
      fetchBegin(),
      updateStyleOption(styleOptions),
      addQuery([firstGraphData, secondGraphData]),
      processGraphResponse({
        data: mergedGraph,
        accessors: initialState.accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      clearError(),
      fetchDone(),
      closeModal(),
    ];

    // assertions
    return store
      .dispatch(
        importJsonData(
          importDataArr as any,
          groupEdgeToggle,
          initialState.accessors,
          true,
        ),
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
  });

  it('should import successfully without metadata', async (done) => {
    const graphWithoutMetadata = Constant.simpleGraphOne;
    delete graphWithoutMetadata.data.metadata;
    const groupEdgeToggle = false;

    const importDataArr = [graphWithoutMetadata];

    // processes
    const batchDataPromises = importDataArr.map((graphData) => {
      const { data } = graphData;
      return importJson(data as any, initialState.accessors, groupEdgeToggle);
    });

    const graphDataArr = await Promise.all(batchDataPromises);
    const [graphData] = flatten(graphDataArr);

    // group edge configuration arrangements
    const groupEdgeConfig = {
      availability: false,
      toggle: groupEdgeToggle,
    };
    graphData.metadata.groupEdges = groupEdgeConfig;

    // expected results
    const expectedActions = [
      fetchBegin(),
      addQuery([graphData]),
      processGraphResponse({
        data: graphData,
        accessors: initialState.accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      clearError(),
      fetchDone(),
      closeModal(),
    ];

    // assertions
    await store.dispatch(
      importJsonData(
        importDataArr as any,
        groupEdgeToggle,
        initialState.accessors,
      ),
    );

    setTimeout(() => {
      expect(store.getActions()).toEqual(expectedActions);
      done();
    }, 300);
  });

  it('should not overwrite styles if data has no style', async (done) => {
    // input
    const jsonOneWithoutStyle = {
      data: Constant.jsonDataOne.data,
    };

    const jsonTwoWithoutStyle = {
      data: Constant.jsonDataTwo.data,
    };

    const groupEdgeToggle = false;

    const importDataArr = [jsonOneWithoutStyle, jsonTwoWithoutStyle];
    let { styleOptions } = initialState;

    // processes
    const batchDataPromises = importDataArr.map((graphData) => {
      const { data, style } = graphData as any;

      if (style) {
        styleOptions = style;
      }

      return importJson(data, initialState.accessors, groupEdgeToggle);
    });

    const graphDataArr = await Promise.all(batchDataPromises);
    const [firstGraphData, secondGraphData] = flatten(graphDataArr);

    // group edge configuration arrangements
    const groupEdgeConfig = { availability: false, toggle: groupEdgeToggle };
    firstGraphData.metadata.groupEdges = groupEdgeConfig;
    secondGraphData.metadata.groupEdges = groupEdgeConfig;

    const mergedGraph = combineGraphs([firstGraphData, secondGraphData]);

    // expected results
    const expectedActions = [
      fetchBegin(),
      addQuery([firstGraphData, secondGraphData]),
      processGraphResponse({
        data: mergedGraph,
        accessors: initialState.accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      clearError(),
      fetchDone(),
      closeModal(),
    ];

    // assertions
    return store
      .dispatch(
        importJsonData(
          importDataArr as any,
          groupEdgeToggle,
          initialState.accessors,
          true,
        ),
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
  });

  it('should import with single file contains two graph lists', async (done) => {
    // input
    const importDataArr = [Constant.simpleGraphTwo];
    const groupEdgeToggle = false;

    // processes
    const batchDataPromises = importDataArr.map((graphData) => {
      const { data } = graphData;
      return importJson(data, initialState.accessors, groupEdgeToggle);
    });

    const graphDataArr = await Promise.all(batchDataPromises);
    const [firstGraphData, secondGraphData] = flatten(graphDataArr);

    // group edge configuration arrangements
    const groupEdgeConfig = {
      availability: false,
      toggle: groupEdgeToggle,
    };
    firstGraphData.metadata.groupEdges = groupEdgeConfig;
    secondGraphData.metadata.groupEdges = groupEdgeConfig;

    const mergedGraph = combineGraphs([firstGraphData, secondGraphData]);

    // expected results
    const expectedActions = [
      fetchBegin(),
      addQuery([firstGraphData, secondGraphData]),
      processGraphResponse({
        data: mergedGraph,
        accessors: initialState.accessors,
      }),

      updateToast('toast-0'),
      resetState(),
      clearError(),
      fetchDone(),
      closeModal(),
    ];

    // assertions
    return store
      .dispatch(
        importJsonData(
          importDataArr as any,
          groupEdgeToggle,
          initialState.accessors,
        ),
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
  });

  it('should import with two files contain three graph lists', async (done) => {
    // input
    const importDataArr = [Constant.simpleGraphOne, Constant.simpleGraphTwo];
    const groupEdgeToggle = false;

    // processes
    const batchDataPromises = importDataArr.map((graphData) => {
      const { data } = graphData;
      return importJson(data, initialState.accessors, groupEdgeToggle);
    });

    const graphDataArr = await Promise.all(batchDataPromises);
    const [firstGraphData, secondGraphData, thirdGraphData] =
      flatten(graphDataArr);

    // group edge configuration arrangements
    const groupEdgeConfig = {
      availability: false,
      toggle: groupEdgeToggle,
    };
    firstGraphData.metadata.groupEdges = groupEdgeConfig;
    secondGraphData.metadata.groupEdges = groupEdgeConfig;
    thirdGraphData.metadata.groupEdges = groupEdgeConfig;

    const mergedGraph = combineGraphs([
      firstGraphData,
      secondGraphData,
      thirdGraphData,
    ]);

    // expected results
    const expectedActions = [
      fetchBegin(),
      addQuery([firstGraphData, secondGraphData, thirdGraphData]),
      processGraphResponse({
        data: mergedGraph,
        accessors: initialState.accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      clearError(),
      fetchDone(),
      closeModal(),
    ];

    // assertions
    return store
      .dispatch(
        importJsonData(
          importDataArr as any,
          groupEdgeToggle,
          initialState.accessors,
        ),
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
  });

  it('should determine whether graph possess duplicate connectivity', async (done) => {
    // arrange
    const importDataArr = [Constant.simpleGraphWithGroupEdge];
    const groupEdgeToggle = false;

    // act
    const batchDataPromises = importDataArr.map((graphData) => {
      const { data } = graphData;
      return importJson(data, initialState.accessors, groupEdgeToggle);
    });

    const graphDataArr = await Promise.all(batchDataPromises);
    const [firstGraphData] = flatten(graphDataArr);

    // group edge configuration arrangements
    const groupEdgeConfig = {
      availability: true,
      toggle: groupEdgeToggle,
    };
    firstGraphData.metadata.groupEdges = groupEdgeConfig;

    // expected results
    const expectedActions = [
      fetchBegin(),
      addQuery([firstGraphData]),
      processGraphResponse({
        data: firstGraphData,
        accessors: initialState.accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      clearError(),
      fetchDone(),
      closeModal(),
    ];

    // assertions
    return store
      .dispatch(
        importJsonData(
          importDataArr as any,
          groupEdgeToggle,
          initialState.accessors,
        ),
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 50);
      });
  });
});
