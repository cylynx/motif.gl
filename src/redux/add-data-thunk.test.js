import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import { importJsonData, importNodeEdgeData } from './add-data-thunk';
import graphReducer, { initialState, addQuery, processGraphResponse } from './graph-slice';
import {
  addRequiredFieldsJson,
  importJson,
  importNodeEdgeCsv,
  ImportType,
} from '../processors/import-data';
import { fetchBegin, fetchDone } from './ui-slice';
import { getGraph, getGraphFlatten } from './combine-reducers';


import { processNodeEdgeCsv } from '../processors/data-processors';

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
  describe('importJsonData', () => {
    const store = mockStore(getStore());

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

      // expected results
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
    const sampleNodeEdgeData = {
      data: {
        edgeData:
          'id,relation,source,target\ntxn1,hello,a,b\ntxn2,works,b,c\ntxn3,abc,c,a',
        nodeData: 'id,value,score\na,20,80\nb,40,100\nc,60,123',
        metadata: {
          key: 123,
        },
      },
      type: ImportType.NODE_EDGE_CSV,
    };

    it('should receives importData as object and process graph responses accurately', async () => {
      const store = mockStore(getStore());
      const { nodeData, edgeData } = sampleNodeEdgeData.data;
      const { accessors } = initialState;
      const metadataKey = '123';

      const data = await importNodeEdgeCsv(
        nodeData,
        edgeData,
        accessors,
        metadataKey,
      );

      const expectedActions = [
        fetchBegin(),
        addQuery(data),
        processGraphResponse({
          data,
          accessors,
        }),
        fetchDone(),
      ];

      await store.dispatch(
        importNodeEdgeData(sampleNodeEdgeData, accessors, metadataKey),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
    it('should throw errors if importData parameter is array', async () => {});
  });
});
