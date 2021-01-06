// @ts-nocheck
import { combineReducers } from '@reduxjs/toolkit';
import { initialState as initialStateGraph } from './graph-slice';
import { initialStateUi } from './ui-slice';
import {
  investigateReducer,
  getUI,
  getGraph,
  getStyleOptions,
  getGraphList,
  getGraphFlatten,
  getGraphVisible,
  getFilterOptions,
  getGraphFiltered,
  getAccessors,
  getWidget,
} from './combine-reducers';
import { FilterOptions, GraphData, Node } from '../containers/Graph';

const clientReducer = combineReducers({
  investigate: investigateReducer,
});

describe('selectors', () => {
  it('initial selectors should be valid', async () => {
    const results = clientReducer({}, {});
    expect(getUI(results)).toEqual(initialStateUi);
    expect(getGraph(results)).toEqual(initialStateGraph);
    expect(getAccessors(results)).toEqual(initialStateGraph.accessors);
    expect(getGraphList(results)).toEqual(initialStateGraph.graphList);
    expect(getGraphFlatten(results)).toEqual(initialStateGraph.graphFlatten);
    expect(getStyleOptions(results)).toEqual(initialStateGraph.styleOptions);
    expect(getGraphVisible(results)).toEqual(initialStateGraph.graphFlatten);
    expect(getFilterOptions(results)).toEqual(initialStateGraph.filterOptions);
  });

  describe('getGraphFiltered', () => {
    const mockGraphFlatten: GraphData = {
      nodes: [
        { id: 'node-1' },
        { id: 'node-2' },
        { id: 'node-3' },
        { id: 'node-4' },
      ],
      edges: [
        { id: 'edge-1', source: 'node-1', target: 'node-2' },
        { id: 'edge-2', source: 'node-3', target: 'node-4' },
      ],
      metadata: {
        fields: {
          nodes: [
            {
              name: 'id',
              format: '',
              type: 'string',
              analyzerType: 'STRING',
            },
          ],
          edges: [
            {
              name: 'id',
              format: '',
              type: 'string',
              analyzerType: 'STRING',
            },
            {
              name: 'source',
              format: '',
              type: 'string',
              analyzerType: 'STRING',
            },
            {
              name: 'target',
              format: '',
              type: 'string',
              analyzerType: 'STRING',
            },
          ],
        },
      },
    };

    it('should filter node properties', () => {
      const filterNodeOption: FilterOptions = {
        firstKey: {
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
          isFilterReady: true,
          stringOptions: [
            {
              id: 'node-1',
              label: 'node-1',
            },
            {
              id: 'node-2',
              label: 'node-2',
            },
            {
              id: 'node-3',
              label: 'node-3',
            },
            {
              id: 'node-4',
              label: 'node-4',
            },
          ],
          caseSearch: [
            {
              id: 'node-1',
              label: 'node-1',
            },
          ],
        },
      };

      const reducer = clientReducer(
        {
          investigate: {
            graph: {
              graphFlatten: mockGraphFlatten,
              filterOptions: filterNodeOption,
            },
          },
        },
        {},
      );
      const results: GraphData = getGraphFiltered(reducer);
      const { nodes } = results;
      expect(nodes[0].id).toEqual('node-1');
      expect(nodes.length).toEqual(1);
    });

    it('should filter edge properties', () => {
      const filterEdgeOption: FilterOptions = {
        secondKey: {
          id: 'id',
          from: 'edges',
          selection: [
            {
              id: 'id',
              label: 'id',
              type: 'string',
              analyzerType: 'STRING',
              format: '',
              from: 'edges',
              optionKey: 'edges-id',
            },
          ],
          analyzerType: 'STRING',
          isFilterReady: true,
          stringOptions: [
            {
              id: 'edge-1',
              label: 'edge-1',
            },
            {
              id: 'edge-2',
              label: 'edge-2',
            },
          ],
          caseSearch: [
            {
              id: 'edge-1',
              label: 'edge-1',
            },
          ],
        },
      };

      const reducer = clientReducer(
        {
          investigate: {
            graph: {
              present: {
                graphFlatten: mockGraphFlatten,
                filterOptions: filterEdgeOption,
              },
            },
          },
        },
        {},
      );

      const results: GraphData = getGraphFiltered(reducer);
      const { nodes, edges } = results;

      const isNodeIdsPresent: boolean = nodes.every((node: Node) =>
        ['node-1', 'node-2'].includes(node.id),
      );

      expect(isNodeIdsPresent).toBe(true);
      expect(edges[0].id).toBe('edge-1');
    });
  });
});
