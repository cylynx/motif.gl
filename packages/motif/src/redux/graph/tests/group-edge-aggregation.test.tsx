// ts-nocheck
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import { flatten } from 'underscore';
import React from 'react';
import { render } from '@testing-library/react';
import { ToasterContainer } from 'baseui/toast';
import {
  addQuery,
  initialState,
  processGraphResponse,
  overwriteEdgeSelection,
} from '../slice';
import { resetState } from '../../import/fileUpload/slice';
import * as Constant from './constant';
import { importJson } from '../processors/import';
import {
  clearError,
  closeModal,
  fetchBegin,
  fetchDone,
  updateToast,
} from '../../ui/slice';
import {
  groupEdgesWithAggregation,
  importJsonData,
  computeEdgeSelection,
} from '../thunk';
import { Field, GraphData, Selection } from '../types';
import {
  groupEdgesForImportation,
  groupEdgesWithConfiguration,
} from '../processors/group-edges';
import { getGraph } from '../selectors';

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

describe('Group Edges', () => {
  let store;
  beforeEach(() => {
    render(<ToasterContainer />);
    store = mockStore(getStore());
  });

  afterEach(() => {
    store.clearActions();
  });

  describe('Group Edge For Importation', () => {
    it('should perform group edge during importation', async (done) => {
      // arrange
      const importDataArr = [Constant.simpleGraphWithGroupEdge];
      const groupEdgeToggle = true;

      // act
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data } = graphData;
        return importJson(data, initialState.accessors, groupEdgeToggle);
      });

      const graphDataArr = await Promise.all(batchDataPromises);
      const [firstGraphData] = flatten(graphDataArr);

      // group edge configuration arrangements
      const groupEdgeConfig = {
        availability: true,
        toggle: groupEdgeToggle,
        type: 'all',
      };
      firstGraphData.metadata.groupEdges = groupEdgeConfig;
      const { graphData: modData, groupEdgeIds } = groupEdgesForImportation(
        firstGraphData,
        firstGraphData.metadata.groupEdges,
      );

      firstGraphData.metadata.groupEdges.ids = groupEdgeIds;

      // expected results
      const expectedActions = [
        fetchBegin(),
        addQuery([firstGraphData]),
        processGraphResponse({
          data: modData,
          accessors: initialState.accessors,
        }),
        updateToast('toast-0'),
        resetState(),
        clearError(),
        fetchDone(),
        closeModal(),
      ];

      // assertions
      return store
        .dispatch(
          importJsonData(
            importDataArr as any,
            groupEdgeToggle,
            initialState.accessors,
          ),
        )
        .then(() => {
          // perform assertion except process graph response due to random numbers.
          setTimeout(() => {
            store.getActions().forEach((actions, index) => {
              if (actions.type !== 'graph/processGraphResponse') {
                expect(actions).toEqual(expectedActions[index]);
              }
            });
            done();
          }, 50);
        });
    });
  });

  describe('Group Edges With Aggregation', () => {
    describe('Group By All', () => {
      const simpleGraphWithGroupEdge = Constant.graphWithGroupEdge;

      const importedGraphState = () => {
        const store = {
          investigate: {
            ui: {},
            widget: {},
            graph: {
              present: {
                graphList: [simpleGraphWithGroupEdge],
                graphFlatten: simpleGraphWithGroupEdge,
              },
            },
          },
        };
        return store;
      };

      const store = mockStore(importedGraphState());
      const graphIndex = 0;
      let newGraphData: GraphData;
      let newGroupEdgeIds = [];
      beforeEach(() => {
        const { graphList, graphFlatten } = getGraph(store.getState());
        const selectedGraphList = graphList[graphIndex];

        const { groupEdges } = selectedGraphList.metadata;

        const { graphData, groupEdgeIds } = groupEdgesWithConfiguration(
          selectedGraphList,
          graphFlatten,
          groupEdges,
        );

        newGraphData = graphData;
        newGroupEdgeIds = groupEdgeIds;
      });

      afterEach(() => {
        store.clearActions();
      });

      it('should display the correct title and visibility', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex) as any);

        store.getActions().forEach((actions) => {
          const { payload, type } = actions;

          if (type === 'graph/updateGraphFlatten') {
            const { nodes, metadata } = payload;
            expect(nodes).toEqual(newGraphData.nodes);

            const { visible, title } = metadata;
            expect(visible).toEqual(newGraphData.metadata.visible);
            expect(title).toEqual(newGraphData.metadata.title);
          }
        });
      });

      it('should compute the correct grouped edges', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex) as any);

        store.getActions().forEach((actions) => {
          const { payload, type } = actions;

          if (type === 'graph/updateGraphFlatten') {
            const { edges } = payload;
            expect(edges).toEqual(newGraphData.edges);
          }
        });
      });

      it('should derive the correct group edge configurations', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex) as any);

        store.getActions().forEach((actions) => {
          const { payload } = actions;
          const { metadata, type } = payload;

          if (type === 'graph/updateGraphFlatten') {
            const { groupEdges } = metadata;
            expect(groupEdges).toEqual(newGraphData.metadata.groupEdges);
          }
        });
      });

      it('should display the correct edge properties', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex) as any);

        const aggregatedEdgeFields: Field[] = [
          {
            analyzerType: 'INT',
            format: '',
            name: 'min numeric',
            type: 'integer',
          },
          {
            analyzerType: 'INT',
            format: '',
            name: 'max numeric',
            type: 'integer',
          },
          {
            analyzerType: 'INT',
            format: '',
            name: 'average numeric',
            type: 'integer',
          },
          {
            analyzerType: 'INT',
            format: '',
            name: 'count numeric',
            type: 'integer',
          },
          {
            analyzerType: 'INT',
            format: '',
            name: 'sum numeric',
            type: 'integer',
          },
          {
            analyzerType: 'STRING',
            format: '',
            name: 'first value',
            type: 'string',
          },
          {
            analyzerType: 'STRING',
            format: '',
            name: 'last value',
            type: 'string',
          },
          {
            analyzerType: 'STRING',
            format: '',
            name: 'most_frequent value',
            type: 'string',
          },
          {
            analyzerType: 'STRING',
            format: '',
            name: 'first date',
            type: 'string',
          },
          {
            analyzerType: 'STRING',
            format: '',
            name: 'last date',
            type: 'string',
          },
          {
            analyzerType: 'STRING',
            format: '',
            name: 'most_frequent date',
            type: 'string',
          },
        ];

        const uniqueEdgeFields = [
          ...newGraphData.metadata.fields.edges,
          ...aggregatedEdgeFields,
        ];

        const modData = cloneDeep(newGraphData);

        Object.assign(modData.metadata.fields, {
          edges: uniqueEdgeFields,
        });

        store.getActions().forEach((actions) => {
          const { payload } = actions;
          const { metadata, type } = payload;

          if (type === 'graph/updateGraphFlatten') {
            const { fields } = metadata;
            expect(fields.edges).toEqual(modData.metadata.fields.edges);
          }
        });
      });

      it('should update valid group edge ids', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex) as any);

        store.getActions().forEach((actions) => {
          const { payload, type } = actions;

          if (type === 'graph/updateGroupEdgeIds') {
            expect(newGroupEdgeIds).toEqual(payload.groupEdgeIds);
          }
        });
      });
    });

    describe('Group By Types', () => {
      const { graphWithGroupEdge } = Constant;

      const importedGraphState = () => {
        const store = {
          investigate: {
            ui: {},
            widget: {},
            graph: {
              present: {
                graphList: [graphWithGroupEdge],
                graphFlatten: graphWithGroupEdge,
              },
            },
          },
        };
        return store;
      };

      const store = mockStore(importedGraphState());
      const graphIndex = 0;
      let newGraphData: GraphData;
      let newGroupEdgeIds = [];
      beforeEach(() => {
        const { graphList, graphFlatten } = getGraph(store.getState());
        const selectedGraphList = graphList[graphIndex];

        const { groupEdges } = selectedGraphList.metadata;

        const { graphData, groupEdgeIds } = groupEdgesWithConfiguration(
          selectedGraphList,
          graphFlatten,
          groupEdges,
        );

        newGraphData = graphData;
        newGroupEdgeIds = groupEdgeIds;
      });

      afterEach(() => {
        store.clearActions();
      });

      it('should compute the correct grouped edges', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex) as any);

        store.getActions().forEach((actions) => {
          const { payload, type } = actions;

          if (type === 'graph/updateGraphFlatten') {
            const { edges } = payload;
            expect(edges).toEqual(newGraphData.edges);
          }
        });
      });

      it('should derive correct group edge configuration', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex) as any);

        store.getActions().forEach((actions) => {
          const { payload, type } = actions;

          if (type === 'graph/updateGraphFlatten') {
            const { groupEdges } = payload.metadata;

            expect(groupEdges).toEqual(newGraphData.metadata.groupEdges);
          }
        });
      });

      it('should update valid group edge ids', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex) as any);

        store.getActions().forEach((actions) => {
          const { payload, type } = actions;

          if (type === 'graph/updateGroupEdgeIds') {
            expect(newGroupEdgeIds).toEqual(payload.groupEdgeIds);
          }
        });
      });
    });
  });

  describe('computeEdgeSelection', () => {
    const { sampleGraphFlatten } = Constant;
    const aggregatedEdgeFields: Field[] = [
      {
        name: 'id',
        format: '',
        type: 'string',
        analyzerType: 'string',
      },
      {
        name: 'source',
        format: '',
        type: 'string',
        analyzerType: 'string',
      },
      {
        name: 'target',
        format: '',
        type: 'string',
        analyzerType: 'string',
      },
      {
        name: 'numeric',
        format: '',
        type: 'integer',
        analyzerType: 'INT',
      },
      {
        name: 'value',
        format: '',
        type: 'string',
        analyzerType: 'STRING',
      },
      {
        name: 'date',
        format: '',
        type: 'string',
        analyzerType: 'STRING',
      },

      {
        analyzerType: 'INT',
        format: '',
        name: 'min numeric',
        type: 'integer',
      },
      {
        analyzerType: 'INT',
        format: '',
        name: 'max numeric',
        type: 'integer',
      },
      {
        analyzerType: 'INT',
        format: '',
        name: 'average numeric',
        type: 'integer',
      },
      {
        analyzerType: 'INT',
        format: '',
        name: 'count numeric',
        type: 'integer',
      },
      {
        analyzerType: 'INT',
        format: '',
        name: 'sum numeric',
        type: 'integer',
      },
      {
        analyzerType: 'STRING',
        format: '',
        name: 'first value',
        type: 'string',
      },
      {
        analyzerType: 'STRING',
        format: '',
        name: 'last value',
        type: 'string',
      },
      {
        analyzerType: 'STRING',
        format: '',
        name: 'most_frequent value',
        type: 'string',
      },
      {
        analyzerType: 'STRING',
        format: '',
        name: 'first date',
        type: 'string',
      },
      {
        analyzerType: 'STRING',
        format: '',
        name: 'last date',
        type: 'string',
      },
      {
        analyzerType: 'STRING',
        format: '',
        name: 'most_frequent date',
        type: 'string',
      },
    ];

    Object.assign((sampleGraphFlatten as any).metadata.fields, {
      edges: aggregatedEdgeFields,
    });

    const importedGraphState = () => {
      const store = {
        investigate: {
          ui: {},
          widget: {},
          graph: {
            present: {
              graphFlatten: sampleGraphFlatten,
              edgeSelection: [
                {
                  label: 'id',
                  id: 'id',
                  type: 'string',
                  selected: true,
                },
                {
                  label: 'source',
                  id: 'source',
                  type: 'string',
                  selected: true,
                },
                {
                  label: 'target',
                  id: 'target',
                  type: 'string',
                  selected: true,
                },
              ],
            },
          },
        },
      };
      return store;
    };

    const store = mockStore(importedGraphState());

    beforeEach(() => {
      store.dispatch(computeEdgeSelection() as any);
    });

    afterEach(() => {
      store.clearActions();
    });

    it('should append edge selection based on edge fields', () => {
      const { edgeSelection, graphFlatten } = getGraph(store.getState());
      const { edges: edgeFields } = graphFlatten.metadata.fields;

      const computedEdgeSelection = edgeFields.map((edgeField: Field) => {
        const { name, type } = edgeField;
        const existingSelection = edgeSelection.find(
          (selection: Selection) => selection.id === edgeField.name,
        );
        const isSelected: boolean = existingSelection?.selected ?? false;

        return {
          id: name,
          label: name,
          type,
          selected: isSelected,
        };
      });

      const expectedActions = [overwriteEdgeSelection(computedEdgeSelection)];

      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
