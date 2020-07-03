import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import addData from './index';
import { addQuery, processGraphResponse } from '../redux/graphSlice';
import {
  fetchBegin,
  fetchDone,
  setBottomLock,
  setScoreLock,
  setBottomOpen,
} from '../redux/uiSlice';

const getData = type => {
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
  switch (type) {
    case 'time':
      simpleJSONData.edges[0].data = {
        time: 1593774283,
      };
      newData.edges[0].data = {
        time: 1593774283,
      };
      return [simpleJSONData, newData];
    default:
      return [simpleJSONData, newData];
  }
};

const mockStore = configureMockStore([thunk]);
const getStore = type => {
  const store = {
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
  };
  switch (type) {
    case 'time':
      store.investigate.graph.present.getFns.getEdgeTime = edge =>
        edge.data.time;
      return store;
    default:
      return store;
  }
};

describe('addData thunk', () => {
  it('should dispatch calls correctly given input data with no time or score', () => {
    // Act
    const [simpleJSONData, newData] = getData();
    const store = mockStore(getStore());
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
  it('should dispatch calls correctly given input data with only time', () => {
    // Act
    const [simpleJSONData, newData] = getData('time');
    const store = mockStore(getStore('time'));
    store.dispatch(addData(simpleJSONData));
    // Assert
    const expectedActions = [
      fetchBegin(),
      addQuery(newData),
      processGraphResponse(newData),
      fetchDone(),
      setBottomOpen(true),
      setScoreLock(),
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });
});
