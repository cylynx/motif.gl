// @ts-nocheck
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import { render } from '@testing-library/react';
import { ToasterContainer } from 'baseui/toast';
import {
  groupEdgesWithAggregation,
  importEdgeListData,
  importJsonData,
  importNodeEdgeData,
  importSingleJsonData,
} from '../thunk';
import {
  initialState,
  addQuery,
  processGraphResponse,
  updateStyleOption,
} from '../slice';
import {
  importJson,
  importNodeEdgeCsv,
  importEdgeListCsv,
} from '../processors/import';
import { fetchBegin, fetchDone, updateToast } from '../../ui/slice';
import { SimpleEdge } from '../../../constants/sample-data';
import { RootState } from '../../investigate';
import {
  Edge,
  Field,
  GraphData,
  GraphList,
  ImportFormat,
  TLoadFormat,
} from '../types';
import * as LAYOUT from '../../../constants/layout-options';
import { DEFAULT_NODE_STYLE } from '../../../constants/graph-shapes';
import {
  groupEdgesForImportation,
  groupEdgesWithConfiguration,
} from '../processors/group-edges';
import { getGraph } from '../selectors';

const mockStore = configureStore([thunk]);
const getStore = (): RootState => {
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
  beforeEach(() => {
    render(<ToasterContainer />);
  });

  describe('importJsonData', () => {
    const jsonDataOne = {
      data: {
        data: {
          nodes: [{ id: 'node-1' }, { id: 'node-2' }],
          edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
          metadata: {
            key: 123,
          },
        },
        style: {
          layout: LAYOUT.RADIAL_DEFAULT,
          nodeStyle: {
            color: {
              id: 'fixed',
              value: DEFAULT_NODE_STYLE.color,
            },
            size: {
              id: 'fixed',
              value: 30,
            },
          },
          edgeStyle: {
            width: {
              id: 'fixed',
              value: 2,
            },
            label: 'none',
          },
        },
      },
      type: 'json',
    };
    const jsonDataTwo = {
      data: {
        data: {
          nodes: [{ id: 'node-3' }, { id: 'node-4' }],
          edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
          metadata: {
            key: 234,
          },
        },
        style: {
          layout: { type: 'graphin-force' },
          nodeStyle: {
            color: { value: 'orange', id: 'fixed' },
            size: { value: 47, id: 'fixed' },
            label: 'id',
          },
          edgeStyle: {
            width: { id: 'fixed', value: 1 },
            label: 'source',
            pattern: 'dot',
            fontSize: 16,
            arrow: 'none',
          },
        },
      },
      type: 'json',
    };

    const simpleGraphOne = {
      data: {
        nodes: [{ id: 'node-3' }, { id: 'node-4' }],
        edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
        metadata: {
          key: 234,
        },
      },
      type: 'json',
    };

    const simpleGraphTwo = {
      data: [
        {
          nodes: [{ id: 'node-3' }, { id: 'node-4' }],
          edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
          metadata: {
            key: 234,
          },
        },
        {
          nodes: [{ id: 'node-1' }, { id: 'node-2' }],
          edges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
          metadata: {
            key: 123,
          },
        },
      ],
      type: 'json',
    };

    const store = mockStore(getStore());

    afterEach(() => {
      store.clearActions();
    });

    it('should receive array of importData and process graph responses accurately', async () => {
      // input
      const importDataArr = [jsonDataOne, jsonDataTwo];
      const groupEdgeToggle = false;

      // processes
      const batchDataPromises = importDataArr.map((graphData: ImportFormat) => {
        const { data } = graphData.data as TLoadFormat;
        return importJson(data, initialState.accessors, groupEdgeToggle);
      });

      const graphDataArr = await Promise.all(batchDataPromises);
      const [firstGraphData, secondGraphData] = flatten(graphDataArr);

      // group edge configuration arrangements
      const groupEdgeToggle = false;
      const groupEdgeConfig = { availability: false, toggle: groupEdgeToggle };
      Object.assign(firstGraphData.metadata.groupEdges, groupEdgeConfig);
      Object.assign(secondGraphData.metadata.groupEdges, groupEdgeConfig);

      // expected results
      const expectedActions = [
        fetchBegin(),
        addQuery(firstGraphData),
        processGraphResponse({
          data: firstGraphData,
          accessors: initialState.accessors,
        }),
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
        importJsonData(importDataArr, groupEdgeToggle, initialState.accessors),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should display different success message in toast with filter applied', async () => {
      const currentStore = getStore();
      Object.assign(currentStore.investigate.graph.present.filterOptions, {
        value: 'something',
      });

      const modifiedStore = mockStore(currentStore);

      // input
      const importDataArr = [jsonDataOne, jsonDataTwo];
      const groupEdgeToggle = false;

      // processes
      const batchDataPromises = importDataArr.map((graphData: ImportFormat) => {
        const { data } = graphData.data as TLoadFormat;
        return importJson(data, initialState.accessors, groupEdgeToggle);
      });

      const graphDataArr = await Promise.all(batchDataPromises);
      const [firstGraphData, secondGraphData] = flatten(graphDataArr);

      // group edge configuration arrangements
      const groupEdgeToggle = false;
      const groupEdgeConfig = { availability: false, toggle: groupEdgeToggle };
      firstGraphData.metadata.groupEdges = groupEdgeConfig;
      secondGraphData.metadata.groupEdges = groupEdgeConfig;

      // expected results
      const expectedActions = [
        fetchBegin(),
        addQuery(firstGraphData),
        processGraphResponse({
          data: firstGraphData,
          accessors: initialState.accessors,
        }),
        addQuery(secondGraphData),
        processGraphResponse({
          data: secondGraphData,
          accessors: initialState.accessors,
        }),
        fetchDone(),
        updateToast('toast-0'),
      ];

      // assertions
      await modifiedStore.dispatch(
        importJsonData(importDataArr, groupEdgeToggle, initialState.accessors),
      );
      expect(modifiedStore.getActions()).toEqual(expectedActions);
    });

    it('should overwrite styles with the last file', async () => {
      // input
      const importDataArr = [jsonDataOne, jsonDataTwo];
      let { styleOptions } = initialState;
      const groupEdgeToggle = false;

      // processes
      const batchDataPromises = importDataArr.map((graphData: ImportFormat) => {
        const { data, style } = graphData.data as TLoadFormat;

        if (style) {
          styleOptions = style;
        }

        return importJson(data, initialState.accessors, groupEdgeToggle);
      });

      const graphDataArr = await Promise.all(batchDataPromises);
      const [firstGraphData, secondGraphData] = flatten(graphDataArr);

      // group edge configuration arrangements
      const groupEdgeConfig = { availability: false, toggle: groupEdgeToggle };
      firstGraphData.metadata.groupEdges = groupEdgeConfig;
      secondGraphData.metadata.groupEdges = groupEdgeConfig;

      // expected results
      const expectedActions = [
        updateStyleOption(styleOptions),
        fetchBegin(),
        addQuery(firstGraphData),
        processGraphResponse({
          data: firstGraphData,
          accessors: initialState.accessors,
        }),
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
        importJsonData(
          importDataArr,
          groupEdgeToggle,
          initialState.accessors,
          true,
        ),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should not overwrite styles if data has no style', async () => {
      // input
      const jsonOneWithoutStyle = {
        data: {
          data: jsonDataOne.data.data,
        },
        type: jsonDataOne.type,
      };

      const jsonTwoWithoutStyle = {
        data: {
          data: jsonDataTwo.data.data,
        },
        type: jsonDataTwo.type,
      };

      const groupEdgeToggle = false;

      const importDataArr = [jsonOneWithoutStyle, jsonTwoWithoutStyle];
      let { styleOptions } = initialState;

      // processes
      const batchDataPromises = importDataArr.map((graphData: ImportFormat) => {
        const { data, style } = graphData.data as TLoadFormat;

        if (style) {
          styleOptions = style;
        }

        return importJson(data, initialState.accessors, groupEdgeToggle);
      });

      const graphDataArr = await Promise.all(batchDataPromises);
      const [firstGraphData, secondGraphData] = flatten(graphDataArr);

      // group edge configuration arrangements
      const groupEdgeConfig = { availability: false, toggle: groupEdgeToggle };
      firstGraphData.metadata.groupEdges = groupEdgeConfig;
      secondGraphData.metadata.groupEdges = groupEdgeConfig;

      // expected results
      const expectedActions = [
        fetchBegin(),
        addQuery(firstGraphData),
        processGraphResponse({
          data: firstGraphData,
          accessors: initialState.accessors,
        }),
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
        importJsonData(
          importDataArr,
          groupEdgeToggle,
          initialState.accessors,
          true,
        ),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });

    describe('Simple Graph Format', () => {
      it('should import with single file contains two graph lists', async () => {
        // input
        const importDataArr = [simpleGraphTwo];
        const groupEdgeToggle = false;

        // processes
        const batchDataPromises = importDataArr.map(
          (graphData: ImportFormat) => {
            const { data } = graphData;
            return importJson(
              data as GraphList,
              initialState.accessors,
              groupEdgeToggle,
            );
          },
        );

        const graphDataArr = await Promise.all(batchDataPromises);
        const [firstGraphData, secondGraphData] = flatten(graphDataArr);

        // group edge configuration arrangements
        const groupEdgeConfig = {
          availability: false,
          toggle: groupEdgeToggle,
        };
        firstGraphData.metadata.groupEdges = groupEdgeConfig;
        secondGraphData.metadata.groupEdges = groupEdgeConfig;

        // expected results
        const expectedActions = [
          fetchBegin(),
          addQuery(firstGraphData),
          processGraphResponse({
            data: firstGraphData,
            accessors: initialState.accessors,
          }),
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
          importJsonData(
            importDataArr,
            groupEdgeToggle,
            initialState.accessors,
          ),
        );
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should import with two files contain three graph lists', async () => {
        // input
        const importDataArr = [simpleGraphOne, simpleGraphTwo];
        const groupEdgeToggle = false;

        // processes
        const batchDataPromises = importDataArr.map(
          (graphData: ImportFormat) => {
            const { data } = graphData;
            return importJson(
              data as GraphList,
              initialState.accessors,
              groupEdgeToggle,
            );
          },
        );

        const graphDataArr = await Promise.all(batchDataPromises);
        const [firstGraphData, secondGraphData, thirdGraphData] = flatten(
          graphDataArr,
        );

        // group edge configuration arrangements
        const groupEdgeConfig = {
          availability: false,
          toggle: groupEdgeToggle,
        };
        firstGraphData.metadata.groupEdges = groupEdgeConfig;
        secondGraphData.metadata.groupEdges = groupEdgeConfig;
        thirdGraphData.metadata.groupEdges = groupEdgeConfig;

        // expected results
        const expectedActions = [
          fetchBegin(),
          addQuery(firstGraphData),
          processGraphResponse({
            data: firstGraphData,
            accessors: initialState.accessors,
          }),
          addQuery(secondGraphData),
          processGraphResponse({
            data: secondGraphData,
            accessors: initialState.accessors,
          }),
          addQuery(thirdGraphData),
          processGraphResponse({
            data: thirdGraphData,
            accessors: initialState.accessors,
          }),
          fetchDone(),
          updateToast('toast-0'),
        ];

        // assertions
        await store.dispatch(
          importJsonData(
            importDataArr,
            groupEdgeToggle,
            initialState.accessors,
          ),
        );
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    describe('Group Edge Aggregations', () => {
      const simpleGraphWithGroupEdge = {
        data: {
          nodes: [{ id: 'node-3' }, { id: 'node-4' }],
          edges: [
            { id: 'edge-2', source: 'node-3', target: 'node-4' },
            { id: 'edge-3', source: 'node-3', target: 'node-4' },
          ],
          metadata: {
            key: 234,
          },
        },
        type: 'json',
      };

      it('should determine whether graph possess duplicate connectivity', async () => {
        // arrange
        const importDataArr = [simpleGraphWithGroupEdge];
        const groupEdgeToggle = false;

        // act
        const batchDataPromises = importDataArr.map(
          (graphData: ImportFormat) => {
            const { data } = graphData;
            return importJson(
              data as GraphList,
              initialState.accessors,
              groupEdgeToggle,
            );
          },
        );

        const graphDataArr = await Promise.all(batchDataPromises);
        const [firstGraphData] = flatten(graphDataArr);

        // group edge configuration arrangements
        const groupEdgeConfig = {
          availability: true,
          toggle: groupEdgeToggle,
        };
        firstGraphData.metadata.groupEdges = groupEdgeConfig;

        // expected results
        const expectedActions = [
          fetchBegin(),
          addQuery(firstGraphData),
          processGraphResponse({
            data: firstGraphData,
            accessors: initialState.accessors,
          }),
          fetchDone(),
          updateToast('toast-0'),
        ];

        // assertions
        await store.dispatch(
          importJsonData(
            importDataArr,
            groupEdgeToggle,
            initialState.accessors,
          ),
        );
        expect(store.getActions()).toEqual(expectedActions);
      });

      it('should perform group edge during importation', async () => {
        // arrange
        const importDataArr = [simpleGraphWithGroupEdge];
        const groupEdgeToggle = true;

        // act
        const batchDataPromises = importDataArr.map(
          (graphData: ImportFormat) => {
            const { data } = graphData;
            return importJson(
              data as GraphList,
              initialState.accessors,
              groupEdgeToggle,
            );
          },
        );

        const graphDataArr = await Promise.all(batchDataPromises);
        const [firstGraphData] = flatten(graphDataArr);

        // group edge configuration arrangements
        const groupEdgeConfig = {
          availability: true,
          toggle: groupEdgeToggle,
          type: 'all',
        };
        firstGraphData.metadata.groupEdges = groupEdgeConfig;
        const modData = groupEdgesForImportation(
          firstGraphData,
          firstGraphData.metadata.groupEdge,
        );

        // expected results
        const expectedActions = [
          fetchBegin(),
          addQuery(firstGraphData),
          processGraphResponse({
            data: modData,
            accessors: initialState.accessors,
          }),
          fetchDone(),
          updateToast('toast-0'),
        ];

        // assertions
        await store.dispatch(
          importJsonData(
            importDataArr,
            groupEdgeToggle,
            initialState.accessors,
          ),
        );

        // perform assertion except process graph response due to random numbers.
        store.getActions().forEach((actions, index) => {
          if (actions.type !== 'graph/processGraphResponse') {
            expect(actions).toEqual(expectedActions[index]);
          }
        });
      });
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

    it('should receive importNodeEdgeData as object and process graph responses accurately', async () => {
      const store = mockStore(getStore());
      const { nodeData, edgeData } = sampleNodeEdgeData.data;
      const { accessors } = initialState;
      const metadataKey = '123';
      const groupEdgeToggle = false;

      const data = await importNodeEdgeCsv(
        nodeData,
        edgeData,
        accessors,
        groupEdgeToggle,
        metadataKey,
      );

      // group edge configurations
      const groupEdgeConfig = { toggle: groupEdgeToggle, availability: false };
      Object.assign(data.metadata.groupEdges, groupEdgeConfig);

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
        importNodeEdgeData(
          sampleNodeEdgeData,
          groupEdgeToggle,
          accessors,
          metadataKey,
        ),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
    it('should throw errors if importNodeEdgeData parameter is array', async () => {
      const importDataArr = [sampleNodeEdgeData];
      await expect(importNodeEdgeData(importDataArr)).toThrow(Error);
    });

    it('should throw errors if source and target fields are invalid', async () => {
      const invalidNodeEdgeData = {
        data: {
          edgeData:
            'id,relation,from,to\ntxn1,hello,a,b\ntxn2,works,b,c\ntxn3,abc,c,a',
          nodeData: 'id,value,score\na,20,80\nb,40,100\nc,60,123',
          metadata: {
            key: 123,
          },
        },
        type: 'nodeEdgeCsv',
      };
      await expect(importNodeEdgeData(invalidNodeEdgeData)).toThrow(Error);
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
      const groupEdgeToggle = false;

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        const { data } = graphData;
        return importEdgeListCsv(data, initialState.accessors, groupEdgeToggle);
      });

      const graphDataArr = await Promise.all(batchDataPromises);
      const [firstGraphData, secondGraphData] = graphDataArr;

      // group edge configurations
      const groupEdgeConfig = { toggle: groupEdgeToggle, availability: false };
      Object.assign(firstGraphData.metadata.groupEdges, groupEdgeConfig);
      Object.assign(secondGraphData.metadata.groupEdges, groupEdgeConfig);

      // expected results
      const expectedActions = [
        fetchBegin(),
        addQuery(firstGraphData),
        processGraphResponse({
          data: firstGraphData,
          accessors: initialState.accessors,
        }),
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
        importEdgeListData(
          importDataArr,
          groupEdgeToggle,
          initialState.accessors,
        ),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should throw errors if importData parameter is not array', async () => {
      await expect(importEdgeListData(firstEdgeListCsv)).toThrow(Error);
    });

    it('should throw errors if source and target fields are invalid', async () => {
      const firstErrorEdgeCsv = {
        data:
          'id,relation,from,to\ntxn1,works,jason,cylynx\ntxn3,abc,cylynx,timothy\ntxn4,says hi to,swan,cylynx',
        type: 'edgeListCsv',
      };

      const secondValidEdgeCsv = {
        data: 'id,source,target\n123,x,y\n456,y,z\n789,z,x',
        type: 'edgeListCsv',
      };
      await expect(
        importEdgeListData([firstErrorEdgeCsv, secondValidEdgeCsv]),
      ).toThrow(Error);
    });
  });

  describe('importSingleJsonData', () => {
    const store = mockStore(getStore());

    it('should receive importData as object and process graph accurately', async () => {
      // input
      const data = SimpleEdge();
      const importData = { data, type: 'json' };
      const groupEdgeToggle = false;

      // processes
      const processedJsonData = await importJson(
        data,
        initialState.accessors,
        groupEdgeToggle,
      );
      const [objectData] = processedJsonData;

      // group edge configurations
      const groupEdgeToggle = false;
      const groupEdgeConfig = { toggle: groupEdgeToggle, availability: false };
      objectData.metadata.groupEdges = groupEdgeConfig;

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

      await store.dispatch(importSingleJsonData(importData, groupEdgeToggle));
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should throw error if importData parameter is an array', async () => {
      const data = SimpleEdge();
      const importData = { data, type: 'json' };

      await expect(importSingleJsonData([importData])).toThrow(Error);
    });

    it('should throw error if source and target fields are invalid', async () => {
      // input
      const invalidData = {
        nodes: [
          {
            id: 'nodeA',
            label: 'nodeA',
          },
          {
            id: 'nodeB',
            label: 'nodeB',
          },
        ],
        edges: [
          {
            id: 'nodeA-nodeB',
            from: 'nodeA',
            to: 'nodeB',
            weight: 100,
          },
        ],
        metadata: {
          key: '123',
        },
      };
      const importData = { data: invalidData, type: 'json' };

      await expect(importSingleJsonData(importData)).toThrow(Error);
    });
  });

  describe('groupEdgesWithAggregation', () => {
    const simpleGraphWithGroupEdge = {
      nodes: [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
      edges: [
        {
          source: 'a',
          target: 'b',
          id: 'a-b1',
          numeric: 1,
          value: 'first',
          date: '19-05-1996',
        },
        {
          source: 'a',
          target: 'b',
          id: 'a-b2',
          numeric: 2,
          value: 'Last',
          date: '20-05-1996',
        },
        {
          source: 'a',
          target: 'b',
          id: 'a-b3',
          numeric: 2,
          value: 'last',
          date: '20-05-1996',
        },
        { source: 'a', target: 'b', id: 'a-b4' },
        {
          source: 'a',
          target: 'b',
          id: 'a-b5',
          value: 'last',
          date: '21-05-1996',
        },
        { source: 'c', target: 'd', id: 'c-d1', numeric: 1 },
        { source: 'c', target: 'd', id: 'c-d2', numeric: 2 },
        { source: 'c', target: 'd', id: 'c-d3', numeric: 2 },
        { source: 'c', target: 'd', id: 'c-d4' },
      ],
      metadata: {
        key: 'QoFR2RwSM',
        fields: {
          nodes: [
            {
              name: 'id',
              format: '',
              type: 'string',
              analyzerType: 'string',
            },
          ],
          edges: [
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
          ],
        },
        groupEdges: {
          toggle: true,
          availability: true,
          type: 'numeric',
          fields: {
            'Y_-ZK2S3P': {
              field: 'numeric',
              aggregation: ['min', 'max', 'average', 'count', 'sum'],
            },
            _8X9zGku9b: {
              field: 'value',
              aggregation: ['first', 'last', 'most_frequent'],
            },
            vVENjKDSxE: {
              field: 'date',
              aggregation: ['first', 'last', 'most_frequent'],
            },
          },
        },
      },
    };

    const importedGraphState = (): RootState => {
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

    it('should group by all', async () => {
      const { graphList, graphFlatten } = getGraph(store.getState());
      const graphIndex = 0;
      const selectedGraphList: GraphData = graphList[graphIndex];

      const { groupEdges } = selectedGraphList.metadata;

      const newGraphData = groupEdgesWithConfiguration(
        selectedGraphList,
        graphFlatten,
        groupEdges,
      );

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

      Object.assign(newGraphData.metadata.fields, {
        edges: uniqueEdgeFields,
      });
      await store.dispatch(groupEdgesWithAggregation(graphIndex));

      store.getActions().forEach((actions) => {
        const { payload } = actions;
        const { nodes, edges, metadata } = payload;
        expect(nodes).toEqual(newGraphData.nodes);
        expect(metadata).toEqual(newGraphData.metadata);

        edges.forEach((edge: Edge, index: number) => {
          const { id, ...results } = edge;
          const { id, ...expected } = newGraphData.edges[index];
          expect(results).toEqual(expected);
        });
      });
    });
  });
});
