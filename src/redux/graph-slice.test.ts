// @ts-nocheck
import { FilterCriteria } from 'src/containers/Graph';
import graph, {
  initialState,
  addQuery,
  processGraphResponse,
  updateGraphList,
  deleteGraphList,
  changeVisibilityGraphList,
  resetState,
  updateFilterAttributes,
  GraphState,
  resetFilters,
  removeFilterAttributes,
} from './graph-slice';
import { importJson } from '../processors/import-data';

const JsonData = {
  nodes: [{ id: 'node-1' }, { id: 'node-2' }],
  edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
  metadata: {
    key: 123,
  },
};

const JsonData2 = {
  nodes: [{ id: 'node-2' }, { id: 'node-3' }],
  edges: [{ id: 'edge-2', source: 'node-2', target: 'node-3' }],
  metadata: {
    key: 234,
  },
};

const sampleGraphList = importJson(JsonData, initialState.accessors);

const sampleGraphList2 = importJson(JsonData2, initialState.accessors);

describe('graph reducer', () => {
  afterEach(() => {
    graph(undefined, {
      type: resetState.type,
    });

    graph(undefined, {
      type: resetFilters.type,
    });
  });

  it('should handle initial state', () => {
    expect(graph(undefined, {})).toEqual(initialState);
  });

  it('addQuery should add to graphList', async () => {
    const sampleGraphData = (await sampleGraphList)[0];
    const results = graph(initialState, {
      type: addQuery.type,
      payload: sampleGraphData,
    });
    expect(results.graphList).toHaveLength(1);
    expect(results.graphList).toEqual([sampleGraphData]);
  });

  it('processGraphResponse should add to graphFlatten and change graphVisible', async () => {
    const sampleGraphData = (await sampleGraphList)[0];
    const results = graph(initialState, {
      type: processGraphResponse.type,
      payload: {
        data: sampleGraphData,
        accessors: initialState.accessors,
      },
    });

    expect(results.graphFlatten.nodes).toHaveLength(JsonData.nodes.length);
    expect(results.graphFlatten.edges).toHaveLength(JsonData.edges.length);
  });

  it('processGraphResponse should contain only unique ids', async () => {
    const sampleGraphData = (await sampleGraphList)[0];
    const sampleGraphData2 = (await sampleGraphList2)[0];
    let results = graph(initialState, {
      type: processGraphResponse.type,
      payload: {
        data: sampleGraphData,
        accessors: initialState.accessors,
      },
    });
    results = graph(results, {
      type: processGraphResponse.type,
      payload: {
        data: sampleGraphData2,
        accessors: initialState.accessors,
      },
    });

    expect(results.graphFlatten.nodes).toHaveLength(3);
    expect(results.graphFlatten.edges).toHaveLength(2);
  });

  it('updateGraphList should switch order of GraphList', async () => {
    const sampleGraphData = (await sampleGraphList)[0];
    const sampleGraphData2 = (await sampleGraphList2)[0];
    const modGraphList = { graphList: [sampleGraphData, sampleGraphData2] };
    const modState = { ...initialState, ...modGraphList };
    const results = graph(modState, {
      type: updateGraphList.type,
      payload: {
        from: 0,
        to: 1,
      },
    });

    expect(results.graphList).toHaveLength(2);
    expect(results.graphList).toEqual([sampleGraphData2, sampleGraphData]);
  });

  it('deleteGraphList should remove the given list', async () => {
    const sampleGraphData = (await sampleGraphList)[0];

    const modGraphList = {
      graphList: [sampleGraphData],
    };
    const modState = { ...initialState, ...modGraphList };
    const results = graph(modState, {
      type: deleteGraphList.type,
      payload: 0,
    });

    expect(results.graphList).toHaveLength(0);
  });

  it('updateFilterAttributes should accept a filter attribute', () => {
    const key = 'randomKey';
    const criteria: FilterCriteria = {
      id: 'id',
      from: 'nodes',
      selection: [
        {
          id: 'id',
          label: 'id',
          type: 'string',
          analyzerType: 'STRING',
          format: '',
          from: 'nodes',
          optionKey: 'nodes-id',
        },
      ],
      analyzerType: 'STRING',
      isFilterReady: false,
      stringOptions: [
        {
          id: 'node-1',
          label: 'node-1',
        },
        {
          id: 'node-2',
          label: 'node-2',
        },
      ],
    };

    const action: { key: string; criteria: FilterCriteria } = {
      key,
      criteria,
    };

    const results: GraphState = graph(initialState, {
      type: updateFilterAttributes.type,
      payload: action,
    });

    const { filterOptions } = results;
    expect(filterOptions[key]).toStrictEqual(criteria);
  });

  it('removeFilterAttributes should delete a filter attribute', () => {
    const key = 'randomKey';
    const criteria: FilterCriteria = {
      id: 'id',
      from: 'nodes',
      selection: [
        {
          id: 'id',
          label: 'id',
          type: 'string',
          analyzerType: 'STRING',
          format: '',
          from: 'nodes',
          optionKey: 'nodes-id',
        },
      ],
      analyzerType: 'STRING',
      isFilterReady: false,
      stringOptions: [
        {
          id: 'node-1',
          label: 'node-1',
        },
        {
          id: 'node-2',
          label: 'node-2',
        },
      ],
    };

    const action: { key: string; criteria: FilterCriteria } = {
      key,
      criteria,
    };

    const updateResults: GraphState = graph(initialState, {
      type: updateFilterAttributes.type,
      payload: action,
    });

    const deleteResults: GraphState = graph(updateResults, {
      type: removeFilterAttributes.type,
      payload: {
        key,
      },
    });

    const { filterOptions } = deleteResults;
    expect(filterOptions).toEqual({});
    expect(filterOptions[key]).toEqual(undefined);
  });

  describe('changeVisibiltyGraphList', () => {
    let importedResults;
    beforeEach(async () => {
      // add sample data
      const sampleJson = {
        nodes: [
          { id: 'node-2', custom: '123' },
          { id: 'node-3', custom: '234' },
        ],
        edges: [
          { id: 'edge-2', source: 'node-2', target: 'node-3', custom: '123' },
        ],
        metadata: {
          key: 234,
        },
      };

      const sampleData = importJson(sampleJson, initialState.accessors);
      const sampleGraphData = (await sampleData)[0];

      const addQueryResults = graph(initialState, {
        type: addQuery.type,
        payload: sampleGraphData,
      });

      importedResults = graph(addQueryResults, {
        type: processGraphResponse.type,
        payload: {
          data: sampleGraphData,
          accessors: initialState.accessors,
        },
      });
    });

    it('should not affect nodes and edges selection', async () => {
      const hiddenResults = graph(importedResults, {
        type: changeVisibilityGraphList.type,
        payload: {
          index: 0,
          isVisible: false,
        },
      });

      expect(importedResults.nodeSelection).toStrictEqual(
        hiddenResults.nodeSelection,
      );
      expect(importedResults.edgeSelection).toStrictEqual(
        hiddenResults.edgeSelection,
      );
    });

    it('should change turn off visible but not delete from list', async () => {
      const results = graph(importedResults, {
        type: changeVisibilityGraphList.type,
        payload: { index: 0, isVisible: false },
      });

      expect(results.graphList).toHaveLength(1);
      expect(results.graphList[0].metadata.visible).toEqual(false);
    });

    it('should reset graph data when all graph list are hidden', async () => {
      const results = graph(importedResults, {
        type: changeVisibilityGraphList.type,
        payload: { index: 0, isVisible: false },
      });

      expect(results.graphFlatten).toStrictEqual(initialState.graphFlatten);
    });

    afterEach(() => {
      importedResults = initialState;
    });
  });
});
