import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import addData from './index';
import {
  initialState,
  addQuery,
  processGraphResponse,
} from '../redux/graphSlice';
import {
  fetchBegin,
  fetchDone,
  setBottomLock,
  setScoreLock,
  setBottomOpen,
} from '../redux/uiSlice';

const getData = (type) => {
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
    case 'score':
      simpleJSONData.edges[0].data = {
        score: [
          2.4669448502752394e-8,
          0.0000015858786746827042,
          3.6277524748966577e-12,
          2.5527963821404863e-9,
          0.00002864326272102155,
          7.723923637444402e-9,
          4.003233853929708e-9,
          0.9999675128859348,
          1.5164078785901573e-9,
          3.9248534715014887e-7,
          0.0000016792011583752624,
          3.683347536863764e-8,
          1.7903039945332553e-9,
          8.348233243778563e-11,
          1.0710946419298142e-7,
        ],
      };
      newData.edges[0].data = {
        score: [
          2.4669448502752394e-8,
          0.0000015858786746827042,
          3.6277524748966577e-12,
          2.5527963821404863e-9,
          0.00002864326272102155,
          7.723923637444402e-9,
          4.003233853929708e-9,
          0.9999675128859348,
          1.5164078785901573e-9,
          3.9248534715014887e-7,
          0.0000016792011583752624,
          3.683347536863764e-8,
          1.7903039945332553e-9,
          8.348233243778563e-11,
          1.0710946419298142e-7,
        ],
      };
      return [simpleJSONData, newData];
    case 'both':
      simpleJSONData.edges[0].data = {
        time: 1593774283,
        score: [
          2.4669448502752394e-8,
          0.0000015858786746827042,
          3.6277524748966577e-12,
          2.5527963821404863e-9,
          0.00002864326272102155,
          7.723923637444402e-9,
          4.003233853929708e-9,
          0.9999675128859348,
          1.5164078785901573e-9,
          3.9248534715014887e-7,
          0.0000016792011583752624,
          3.683347536863764e-8,
          1.7903039945332553e-9,
          8.348233243778563e-11,
          1.0710946419298142e-7,
        ],
      };
      newData.edges[0].data = {
        time: 1593774283,
        score: [
          2.4669448502752394e-8,
          0.0000015858786746827042,
          3.6277524748966577e-12,
          2.5527963821404863e-9,
          0.00002864326272102155,
          7.723923637444402e-9,
          4.003233853929708e-9,
          0.9999675128859348,
          1.5164078785901573e-9,
          3.9248534715014887e-7,
          0.0000016792011583752624,
          3.683347536863764e-8,
          1.7903039945332553e-9,
          8.348233243778563e-11,
          1.0710946419298142e-7,
        ],
      };
      return [simpleJSONData, newData];
    default:
      return [simpleJSONData, newData];
  }
};

const mockStore = configureMockStore([thunk]);
const getStore = (type) => {
  const graphState = cloneDeep(initialState);
  const store = {
    investigate: {
      ui: {},
      graph: {
        present: graphState,
      },
    },
  };
  switch (type) {
    case 'time':
      store.investigate.graph.present.getFns.getEdgeTime = (edge) =>
        edge.data.time;
      return store;
    case 'score':
      store.investigate.graph.present.getFns.getEdgeScore = (edge) =>
        edge.data.score;
      return store;
    case 'both':
      store.investigate.graph.present.getFns = {
        getEdgeTime: (edge) => edge.data.time,
        getEdgeScore: (edge) => edge.data.score,
      };
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
  it('should dispatch calls correctly given input data with only score', () => {
    // Act
    const [simpleJSONData, newData] = getData('score');
    const store = mockStore(getStore('score'));
    store.dispatch(addData(simpleJSONData));
    // Assert
    const expectedActions = [
      fetchBegin(),
      addQuery(newData),
      processGraphResponse(newData),
      fetchDone(),
      setBottomLock(),
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('should dispatch calls correctly given input data with both score and time', () => {
    // Act
    const [simpleJSONData, newData] = getData('both');
    const store = mockStore(getStore('both'));
    store.dispatch(addData(simpleJSONData));
    // Assert
    const expectedActions = [
      fetchBegin(),
      addQuery(newData),
      processGraphResponse(newData),
      fetchDone(),
      setBottomOpen(true),
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });
});
