import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import { importJsonData } from './add-data-thunk';
import { initialState, addQuery, processGraphResponse } from './graph-slice';
import { importJson, ImportType } from '../processors/import-data';
import { fetchBegin, fetchDone } from './ui-slice';

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

describe('add-data-thunk.test.js', () => {
  const store = mockStore(getStore());

  describe('importJsonData', () => {
    const jsonDataOne = {
      data: {
        nodes: [{ id: 'node-1' }, { id: 'node-2' }],
        edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
        metadata: {
          key: 123,
        },
      },
      type: ImportType.JSON,
    };
    const jsonDataTwo = {
      data: {
        nodes: [{ id: 'node-3' }, { id: 'node-4' }],
        edges: [{ id: 'edge-2', source: 'node-3s', target: 'node-4' }],
        metadata: {
          key: 234,
        },
      },
      type: ImportType.JSON,
    };

    it('should receives array of importData and process graph responses accurate', async () => {
      // input
      const importDataArr = [jsonDataOne, jsonDataTwo];

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data } = graphData;
        return importJson(data, initialState.accessors);
      });

      const graphDataArr = await Promise.all(batchDataPromises);
      const [firstGraphData, secondGraphData] = flatten(graphDataArr);

      // results
      const expectedActions = [
        fetchBegin(),
        addQuery(firstGraphData),
        processGraphResponse({
          data: firstGraphData,
          accessors: initialState.accessors,
        }),
        fetchDone(),
        addQuery(secondGraphData),
        processGraphResponse({
          data: secondGraphData,
          accessors: initialState.accessors,
        }),
        fetchDone(),
      ];

      // assertions
      await store.dispatch(importJsonData(importDataArr));
      expect(store.getActions()).toEqual(expectedActions);
    });
    it('should throw errors if importData parameter is not array', async () => {
      // assertions
      await expect(importJsonData(jsonDataOne)).toThrow(Error);
    });
  });

  describe('importNodeEdgeData', () => {
    it('should receives importData as object and process graph responses accurately', async () => {});
    it('should throw errors if importData parameter is array', async () => {});
  });
});
