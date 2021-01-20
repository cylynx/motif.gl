// @ts-nocheck
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import { render } from '@testing-library/react';
import { ToasterContainer } from 'baseui/toast';
import {
  importEdgeListData,
  importJsonData,
  importNodeEdgeData,
  importSingleJsonData,
} from '../thunk';
import { initialState, addQuery, processGraphResponse } from '../slice';
import {
  importJson,
  importNodeEdgeCsv,
  importEdgeListCsv,
} from '../processors/import';
import { fetchBegin, fetchDone, updateToast } from '../../ui/slice';
import { SimpleEdge } from '../../../constants/sample-data';

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
  const jsonDataOne = {
    data: {
      nodes: [{ id: 'node-1' }, { id: 'node-2' }],
      edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
      metadata: {
        key: 123,
      },
    },
    type: 'json',
  };
  const jsonDataTwo = {
    data: {
      nodes: [{ id: 'node-3' }, { id: 'node-4' }],
      edges: [{ id: 'edge-2', source: 'node-3s', target: 'node-4' }],
      metadata: {
        key: 234,
      },
    },
    type: 'json',
  };

  beforeEach(() => {
    render(<ToasterContainer />);
  });

  describe('importJsonData', () => {
    const store = mockStore(getStore());

    it('should receive array of importData and process graph responses accurately', async () => {
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
        updateToast('toast-0'),
      ];

      // assertions
      await store.dispatch(importJsonData(importDataArr));
      expect(store.getActions()).toEqual(expectedActions);
    });
    it('should throw error if importData parameter is not array', async () => {
      // assertions
      expect(importJsonData(jsonDataOne)).toThrow(Error);
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
      type: 'nodeEdgeCsv',
    };

    it('should receive importData as object and process graph responses accurately', async () => {
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
        updateToast('toast-0'),
      ];

      await store.dispatch(
        importNodeEdgeData(sampleNodeEdgeData, accessors, metadataKey),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
    it('should throw errors if importData parameter is array', async () => {
      const importDataArr = [jsonDataOne, jsonDataTwo];
      await expect(importNodeEdgeData(importDataArr)).toThrow(Error);
    });
  });

  describe('importEdgeListData', () => {
    const store = mockStore(getStore());

    const firstEdgeListCsv = {
      data:
        'id,relation,source,target\ntxn1,works,jason,cylynx\ntxn3,abc,cylynx,timothy\ntxn4,says hi to,swan,cylynx',
      type: 'edgeListCsv',
    };

    const secondEdgeListCsv = {
      data: 'id,source,target\n123,x,y\n456,y,z\n789,z,x',
      type: 'edgeListCsv',
    };

    it('should receive importData as array and process graph responses accurately', async () => {
      // input
      const importDataArr = [firstEdgeListCsv, secondEdgeListCsv];

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data } = graphData;
        return importEdgeListCsv(data, initialState.accessors);
      });

      const graphDataArr = await Promise.all(batchDataPromises);
      const [firstGraphData, secondGraphData] = graphDataArr;

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
        updateToast('toast-0'),
      ];

      // assertions
      await store.dispatch(
        importEdgeListData(importDataArr, initialState.accessors),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should throw errors if importData parameter is not array', async () => {
      await expect(importEdgeListData(firstEdgeListCsv)).toThrow(Error);
    });
  });

  describe('importSingleJsonData', () => {
    const store = mockStore(getStore());

    it('should receive importData as object and process graph accurately', async () => {
      // input
      const data = SimpleEdge();
      const importData = { data, type: 'json' };

      // processes
      const processedJsonData = await importJson(data, initialState.accessors);
      const [objectData] = processedJsonData;

      // expected results
      const expectedActions = [
        fetchBegin(),
        addQuery(objectData),
        processGraphResponse({
          data: objectData,
          accessors: initialState.accessors,
        }),
        fetchDone(),
        updateToast('toast-0'),
      ];

      await store.dispatch(importSingleJsonData(importData));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should throw error if importData parameter is an array', async () => {
      const data = SimpleEdge();
      const importData = { data, type: 'json' };

      await expect(importSingleJsonData([importData])).toThrow(Error);
    });
  });
});
