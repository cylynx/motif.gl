// ts-nocheck
import { render } from '@testing-library/react';
import React from 'react';
import { ToasterContainer } from 'baseui/toast';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import { importJson } from '../processors/import';
import { Accessors } from '../types';
import * as Json from './constants/positive/json';
import { importJsonData } from '../thunk';
import { resetState } from '../../import/fileUpload/slice';
import { combineGraphs } from '../../../utils/graph-utils/utils';
import * as GraphSlice from '../slice';
import * as UiSlice from '../../ui/slice';
import * as GraphThunk from '../thunk';

const mockStore = configureStore([thunk]);
const getStore = () => {
  const graphState = cloneDeep(GraphSlice.initialState);
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

  describe('Normal Import', () => {
    it('should determine whether graph possess duplicate connectivity', async (done) => {
      // arrange
      const importDataArr = [Json.simpleGraphWithGroupEdge];
      const groupEdgeToggle = false;

      // act
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data } = graphData;
        return importJson(
          data,
          GraphSlice.initialState.accessors,
          groupEdgeToggle,
        );
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
        UiSlice.fetchBegin(),
        GraphSlice.addQuery([firstGraphData]),
        GraphSlice.processGraphResponse({
          data: firstGraphData,
          accessors: GraphSlice.initialState.accessors,
        }),
        UiSlice.updateToast('toast-0'),
        resetState(),
        UiSlice.clearError(),
        UiSlice.fetchDone(),
        UiSlice.closeModal(),
      ];

      const executions = GraphThunk.importJsonData(
        importDataArr as any,
        groupEdgeToggle,
        GraphSlice.initialState.accessors,
      ) as any;

      // assertions
      return store.dispatch(executions).then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 50);
      });
    });
    it('should process custom accessors with numeric values accurately', async (done) => {
      const importDataArr = [Json.simpleGraphThree];
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
        UiSlice.fetchBegin(),
        GraphSlice.addQuery([graphData]),
        GraphSlice.processGraphResponse({
          data: graphData,
          accessors: customAccessors,
        }),
        UiSlice.updateToast('toast-0'),
        resetState(),
        UiSlice.clearError(),
        UiSlice.fetchDone(),
        UiSlice.closeModal(),
      ];

      return store
        .dispatch(
          importJsonData(
            importDataArr as any,
            groupEdgeToggle,
            customAccessors,
          ),
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
      const importDataArr = [Json.jsonDataOne, Json.jsonDataTwo];
      const groupEdgeToggle = false;

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data } = graphData;
        return importJson(
          data as any,
          GraphSlice.initialState.accessors,
          groupEdgeToggle,
        );
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
        UiSlice.fetchBegin(),
        GraphSlice.addQuery([firstGraphData, secondGraphData]),
        GraphSlice.processGraphResponse({
          data: combinedGraph,
          accessors: GraphSlice.initialState.accessors,
        }),
        UiSlice.updateToast('toast-0'),
        resetState(),
        UiSlice.clearError(),
        UiSlice.fetchDone(),
        UiSlice.closeModal(),
      ];

      // assertions
      return store
        .dispatch(
          importJsonData(
            importDataArr as any,
            groupEdgeToggle,
            GraphSlice.initialState.accessors,
          ),
        )
        .then(() => {
          setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
          }, 50);
        });
    });

    it('should display different success message in toast with existing filter applied', async (done) => {
      const currentStore = getStore();
      Object.assign(currentStore.investigate.graph.present.filterOptions, {
        value: 'something',
      });

      const modifiedStore = mockStore(currentStore) as any;

      // input
      const importDataArr = [Json.jsonDataOne, Json.jsonDataTwo];
      const groupEdgeToggle = false;

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data } = graphData;
        return importJson(
          data as any,
          GraphSlice.initialState.accessors,
          groupEdgeToggle,
        );
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
        UiSlice.fetchBegin(),
        GraphSlice.addQuery([firstGraphData, secondGraphData]),
        GraphSlice.processGraphResponse({
          data: mergedGraph,
          accessors: GraphSlice.initialState.accessors,
        }),
        UiSlice.updateToast('toast-0'),
        resetState(),
        UiSlice.clearError(),
        UiSlice.fetchDone(),
        UiSlice.closeModal(),
      ];

      // @ts-ignore
      return modifiedStore
        .dispatch(
          importJsonData(
            importDataArr as any,
            groupEdgeToggle,
            GraphSlice.initialState.accessors,
          ),
        )
        .then(() => {
          setTimeout(() => {
            expect(modifiedStore.getActions()).toEqual(expectedActions);
            done();
          }, 300);
        });
    });

    it('should import successfully without metadata', async (done) => {
      const graphWithoutMetadata = Json.simpleGraphOne;
      delete graphWithoutMetadata.data.metadata;
      const groupEdgeToggle = false;

      const importDataArr = [graphWithoutMetadata];

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data } = graphData;
        return importJson(
          data as any,
          GraphSlice.initialState.accessors,
          groupEdgeToggle,
        );
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
        UiSlice.fetchBegin(),
        GraphSlice.addQuery([graphData]),
        GraphSlice.processGraphResponse({
          data: graphData,
          accessors: GraphSlice.initialState.accessors,
        }),
        UiSlice.updateToast('toast-0'),
        resetState(),
        UiSlice.clearError(),
        UiSlice.fetchDone(),
        UiSlice.closeModal(),
      ];

      // assertions
      await store.dispatch(
        importJsonData(
          importDataArr as any,
          groupEdgeToggle,
          GraphSlice.initialState.accessors,
        ),
      );

      setTimeout(() => {
        expect(store.getActions()).toEqual(expectedActions);
        done();
      }, 300);
    });

    it('should import with single file contains two graph lists', async (done) => {
      // input
      const importDataArr = [Json.simpleGraphTwo];
      const groupEdgeToggle = false;

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data } = graphData;
        return importJson(
          data,
          GraphSlice.initialState.accessors,
          groupEdgeToggle,
        );
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
        UiSlice.fetchBegin(),
        GraphSlice.addQuery([firstGraphData, secondGraphData]),
        GraphSlice.processGraphResponse({
          data: mergedGraph,
          accessors: GraphSlice.initialState.accessors,
        }),

        UiSlice.updateToast('toast-0'),
        resetState(),
        UiSlice.clearError(),
        UiSlice.fetchDone(),
        UiSlice.closeModal(),
      ];

      // assertions
      return store
        .dispatch(
          importJsonData(
            importDataArr as any,
            groupEdgeToggle,
            GraphSlice.initialState.accessors,
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
      const importDataArr = [Json.simpleGraphOne, Json.simpleGraphTwo];
      const groupEdgeToggle = false;

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data } = graphData;
        return importJson(
          data,
          GraphSlice.initialState.accessors,
          groupEdgeToggle,
        );
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
        UiSlice.fetchBegin(),
        GraphSlice.addQuery([firstGraphData, secondGraphData, thirdGraphData]),
        GraphSlice.processGraphResponse({
          data: mergedGraph,
          accessors: GraphSlice.initialState.accessors,
        }),
        UiSlice.updateToast('toast-0'),
        resetState(),
        UiSlice.clearError(),
        UiSlice.fetchDone(),
        UiSlice.closeModal(),
      ];

      // assertions
      return store
        .dispatch(
          importJsonData(
            importDataArr as any,
            groupEdgeToggle,
            GraphSlice.initialState.accessors,
          ),
        )
        .then(() => {
          setTimeout(() => {
            expect(store.getActions()).toEqual(expectedActions);
            done();
          }, 300);
        });
    });
  });

  describe('Style Override Imports', () => {
    it('should overwrite styles with the last file', async (done) => {
      // input
      const importDataArr = [Json.jsonDataOne, Json.jsonDataTwo];
      let { styleOptions } = GraphSlice.initialState;
      const groupEdgeToggle = false;

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data, style } = graphData as any;

        if (style) {
          styleOptions = style;
        }

        return importJson(
          data,
          GraphSlice.initialState.accessors,
          groupEdgeToggle,
        );
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
        UiSlice.fetchBegin(),
        GraphSlice.updateStyleOption(styleOptions),
        GraphSlice.addQuery([firstGraphData, secondGraphData]),
        GraphSlice.processGraphResponse({
          data: mergedGraph,
          accessors: GraphSlice.initialState.accessors,
        }),
        UiSlice.updateToast('toast-0'),
        resetState(),
        UiSlice.clearError(),
        UiSlice.fetchDone(),
        UiSlice.closeModal(),
      ];

      // assertions
      return store
        .dispatch(
          importJsonData(
            importDataArr as any,
            groupEdgeToggle,
            GraphSlice.initialState.accessors,
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

    it('should not overwrite styles if data has no style', async (done) => {
      // input
      const jsonOneWithoutStyle = {
        data: Json.jsonDataOne.data,
      };

      const jsonTwoWithoutStyle = {
        data: Json.jsonDataTwo.data,
      };

      const groupEdgeToggle = false;

      const importDataArr = [jsonOneWithoutStyle, jsonTwoWithoutStyle];
      // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
      let { styleOptions } = GraphSlice.initialState;

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data, style } = graphData as any;

        if (style) {
          styleOptions = style;
        }

        return importJson(
          data,
          GraphSlice.initialState.accessors,
          groupEdgeToggle,
        );
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
        UiSlice.fetchBegin(),
        GraphSlice.addQuery([firstGraphData, secondGraphData]),
        GraphSlice.processGraphResponse({
          data: mergedGraph,
          accessors: GraphSlice.initialState.accessors,
        }),
        UiSlice.updateToast('toast-0'),
        resetState(),
        UiSlice.clearError(),
        UiSlice.fetchDone(),
        UiSlice.closeModal(),
      ];

      // assertions
      return store
        .dispatch(
          importJsonData(
            importDataArr as any,
            groupEdgeToggle,
            GraphSlice.initialState.accessors,
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
  });

  // it('should override the filter attributes', async () => {});
});
