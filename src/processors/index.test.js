import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import addData from './index';
import { addQuery, processGraphResponse } from '../redux/graphSlice';
import {
  fetchBegin,
  fetchDone,
  setBottomLock,
  setScoreLock,
} from '../redux/uiSlice';

const simpleJSONData = {
  nodes: [{ id: 'node-1' }, { id: 'node-2' }],
  edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
};

const newData = {
  nodes: [
    {
      id: 'node-1',
      label: 'node-1',
      data: { category: 'Other', label: 'node-1' },
      style: { nodeSize: 20, primaryColor: '#008080' },
    },
    {
      id: 'node-2',
      label: 'node-2',
      data: { category: 'Other', label: 'node-2' },
      style: { nodeSize: 20, primaryColor: '#008080' },
    },
  ],
  edges: [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2',
      label: 'edge-1',
      style: {
        endArrow: true,
      },
    },
  ],
  metadata: { key: 0 },
};

const mockStore = configureMockStore([thunk]);

describe('addData thunk', () => {
  it('should dispatch calls correctly given simple input data', () => {
    const store = mockStore({
      investigate: {
        ui: {},
        graph: {
          present: {
            getFns: {},
            styleOptions: {
              layout: {
                name: 'concentric',
              },
              nodeSize: 'default',
              edgeWidth: 'fix',
              resetView: true,
              groupEdges: true,
            },
            graphList: [],
            graphFlatten: { nodes: [], edges: [] },
            graphGrouped: { nodes: [], edges: [] },
            graphVisible: { nodes: [], edges: [] },
            tsData: false,
            // Set a large interval to display the data on initialize regardless of resetView
            timeRange: [-2041571596000, 2041571596000],
            selectTimeRange: [-2041571596000, 2041571596000],
            detailedSelection: {
              type: null,
              data: null,
            },
          },
        },
      },
    });
    // Act
    store.dispatch(addData(simpleJSONData));

    // Assert
    const expectedActions = [
      fetchBegin(),
      addQuery(newData),
      processGraphResponse(newData),
      fetchDone(),
      setBottomLock(),
      setScoreLock(),
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });
});
