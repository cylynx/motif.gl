import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import { addData } from './add-data-thunk';
import { initialState, addQuery, processGraphResponse } from './graph-slice';
import { importJson } from '../processors/import-data';
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

const simpleJSONData = {
  nodes: [{ id: 'node-1' }, { id: 'node-2' }],
  edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
  metadata: {
    key: 123,
  },
};

describe('addData thunk', () => {
  it('should dispatch calls correctly given input data', async () => {
    const store = mockStore(getStore());
    const importData = {
      data: simpleJSONData,
      type: 'json',
    };
    const processedData = await importJson(
      simpleJSONData,
      initialState.accessors,
    );
    const expectedActions = [
      fetchBegin(),
      addQuery(processedData[0]),
      processGraphResponse({
        data: processedData[0],
        accessors: initialState.accessors,
      }),
      fetchDone(),
    ];

    await store.dispatch(addData(importData));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
