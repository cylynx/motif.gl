// @ts-nocheck
import React from 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import { render } from '@testing-library/react';
import { ToasterContainer } from 'baseui/toast';
import {
  computeEdgeSelection,
  groupEdgesWithAggregation,
  importEdgeListData,
  importJsonData,
  importNodeEdgeData,
  importSampleData,
} from '../thunk';
import {
  initialState,
  addQuery,
  processGraphResponse,
  updateStyleOption,
  overwriteEdgeSelection,
} from '../slice';
import {
  importJson,
  importNodeEdgeCsv,
  importEdgeListCsv,
} from '../processors/import';
import { fetchBegin, fetchDone, updateToast, closeModal } from '../../ui/slice';
import {
  GraphWithGroupEdge,
  SimpleEdge,
  SimpleGraphWithGroupEdge,
} from '../../../constants/sample-data';
import { RootState } from '../../investigate';
import {
  Field,
  GraphData,
  GraphList,
  ImportFormat,
  JsonImport,
  Selection,
  TLoadFormat,
} from '../types';
import * as LAYOUT from '../../../constants/layout-options';
import { DEFAULT_NODE_STYLE } from '../../../constants/graph-shapes';
import {
  groupEdgesForImportation,
  groupEdgesWithConfiguration,
} from '../processors/group-edges';
import { getGraph } from '../selectors';
import { resetState } from '../../import/fileUpload/slice';
import { show } from '../../ui/thunks';
import { TFileContent } from '../../import/fileUpload';

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

describe('thunk.test.js', () => {
  beforeEach(() => {
    render(<ToasterContainer />);
  });

  describe('importJsonData', () => {
    const jsonDataOne = {
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
    };
    const jsonDataTwo = {
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
    };

    const simpleGraphOne = {
      data: {
        nodes: [{ id: 'node-3' }, { id: 'node-4' }],
        edges: [{ id: 'edge-2', source: 'node-3', target: 'node-4' }],
        metadata: {
          key: 234,
        },
        key: 234,
      },
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
        const { data } = graphData as JsonImport;
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
        resetState(),
        closeModal(),
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
        const { data } = graphData as TLoadFormat;
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
        resetState(),
        closeModal(),
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
        const { data, style } = graphData as TLoadFormat;

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
        resetState(),
        closeModal(),
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

    it('should import successfully without metadata', async () => {
      const graphWithoutMetadata = simpleGraphOne;
      delete graphWithoutMetadata.data.metadata;
      const groupEdgeToggle = false;

      const importDataArr = [graphWithoutMetadata];

      // processes
      const batchDataPromises = importDataArr.map((graphData: ImportFormat) => {
        const { data } = graphData;
        return importJson(
          data as GraphList,
          initialState.accessors,
          groupEdgeToggle,
        );
      });

      const graphDataArr = await Promise.all(batchDataPromises);
      const [graphData] = flatten(graphDataArr);

      // group edge configuration arrangements
      const groupEdgeConfig = {
        availability: false,
        toggle: groupEdgeToggle,
      };
      graphData.metadata.groupEdges = groupEdgeConfig;

      // expected results
      const expectedActions = [
        fetchBegin(),
        addQuery(graphData),
        processGraphResponse({
          data: graphData,
          accessors: initialState.accessors,
        }),
        fetchDone(),
        updateToast('toast-0'),
        resetState(),
        closeModal(),
      ];

      // assertions
      await store.dispatch(
        importJsonData(importDataArr, groupEdgeToggle, initialState.accessors),
      );
      expect(store.getActions()).toEqual(expectedActions);
    });

    it('should not overwrite styles if data has no style', async () => {
      // input
      const jsonOneWithoutStyle = {
        data: jsonDataOne.data,
      };

      const jsonTwoWithoutStyle = {
        data: jsonDataTwo.data,
      };

      const groupEdgeToggle = false;

      const importDataArr = [jsonOneWithoutStyle, jsonTwoWithoutStyle];
      let { styleOptions } = initialState;

      // processes
      const batchDataPromises = importDataArr.map((graphData: ImportFormat) => {
        const { data, style } = graphData as TLoadFormat;

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
        resetState(),
        closeModal(),
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
          resetState(),
          closeModal(),
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
          resetState(),
          closeModal(),
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
          resetState(),
          closeModal(),
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
          resetState(),
          closeModal(),
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
      edgeCsv: [
        {
          fileName: 'test-1.csv',
          content:
            'id,relation,source,target\ntxn1,hello,a,b\ntxn2,works,b,c\ntxn3,abc,c,a',
        },
      ],
      nodeCsv: [
        {
          fileName: 'test-2.csv',
          content: 'id,value,score\na,20,80\nb,40,100\nc,60,123',
        },
      ],
    };

    it('should receive nodeCsv and edgeCsv as array and process graph responses accurately', async () => {
      const store = mockStore(getStore());
      const { nodeCsv, edgeCsv } = sampleNodeEdgeData;
      const { accessors } = initialState;
      const metadataKey = '123';
      const groupEdgeToggle = false;

      const nodeCsvs: string[] = nodeCsv.map(
        (nodeCsv: TFileContent) => nodeCsv.content as string,
      );
      const edgeCsvs: string[] = edgeCsv.map(
        (edgeCsv: TFileContent) => edgeCsv.content as string,
      );

      const data = await importNodeEdgeCsv(
        nodeCsvs,
        edgeCsvs,
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
        resetState(),
        closeModal(),
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

    const firstEdgeListCsv =
      'id,relation,source,target\ntxn1,works,jason,cylynx\ntxn3,abc,cylynx,timothy\ntxn4,says hi to,swan,cylynx';

    const secondEdgeListCsv = 'id,source,target\n123,x,y\n456,y,z\n789,z,x';

    it('should receive importData as array and process graph responses accurately', async () => {
      // input
      const importDataArr = [firstEdgeListCsv, secondEdgeListCsv];
      const groupEdgeToggle = false;

      // processes
      const batchDataPromises = importDataArr.map((graphData) => {
        return importEdgeListCsv(
          graphData,
          initialState.accessors,
          groupEdgeToggle,
        );
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
        resetState(),
        closeModal(),
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
      const firstErrorEdgeCsv =
        'id,relation,from,to\ntxn1,works,jason,cylynx\ntxn3,abc,cylynx,timothy\ntxn4,says hi to,swan,cylynx';

      const secondValidEdgeCsv = 'id,source,target\n123,x,y\n456,y,z\n789,z,x';
      await expect(
        importEdgeListData([firstErrorEdgeCsv, secondValidEdgeCsv]),
      ).toThrow(Error);
    });
  });

  describe('importSampleData', () => {
    const store = mockStore(getStore());

    it('should receive importData as object and process graph accurately', async () => {
      // input
      const data = SimpleEdge();
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
        resetState(),
        closeModal(),
      ];

      await store.dispatch(importSampleData(data, groupEdgeToggle));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('groupEdgesWithAggregation', () => {
    describe('Group By All', () => {
      const simpleGraphWithGroupEdge = SimpleGraphWithGroupEdge();

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
      const graphIndex = 0;
      let newGraphData = {};
      beforeEach(() => {
        const { graphList, graphFlatten } = getGraph(store.getState());
        const selectedGraphList: GraphData = graphList[graphIndex];

        const { groupEdges } = selectedGraphList.metadata;

        newGraphData = groupEdgesWithConfiguration(
          selectedGraphList,
          graphFlatten,
          groupEdges,
        );
      });

      afterEach(() => {
        store.clearActions();
      });

      it('should display the correct title and visibility', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex));

        store.getActions().forEach((actions) => {
          const { payload } = actions;
          const { nodes, metadata } = payload;
          expect(nodes).toEqual(newGraphData.nodes);

          const { visible, title } = metadata;
          expect(visible).toEqual(newGraphData.visible);
          expect(title).toEqual(newGraphData.title);
        });
      });

      it('should compute the correct grouped edges', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex));

        store.getActions().forEach((actions) => {
          const { payload } = actions;
          const { edges } = payload;
          expect(edges).toEqual(newGraphData.edges);
        });
      });

      it('should derive the correct group edge configurations', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex));

        store.getActions().forEach((actions) => {
          const { payload } = actions;
          const { metadata } = payload;

          const { groupEdges } = metadata;
          expect(groupEdges).toEqual(newGraphData.metadata.groupEdges);
        });
      });

      it('should display the correct edge properties', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex));

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
          const { metadata } = payload;

          const { fields } = metadata;
          expect(fields.edges).toEqual(modData.metadata.fields.edges);
        });
      });
    });

    describe('Group By Types', () => {
      const graphWithGroupEdge = GraphWithGroupEdge();

      const importedGraphState = (): RootState => {
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
      let newGraphData = {};
      beforeEach(() => {
        const { graphList, graphFlatten } = getGraph(store.getState());
        const selectedGraphList: GraphData = graphList[graphIndex];

        const { groupEdges } = selectedGraphList.metadata;

        newGraphData = groupEdgesWithConfiguration(
          selectedGraphList,
          graphFlatten,
          groupEdges,
        );
      });

      afterEach(() => {
        store.clearActions();
      });

      it('should compute the correct grouped edges', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex));

        store.getActions().forEach((actions) => {
          const { payload } = actions;
          const { edges } = payload;
          expect(edges).toEqual(newGraphData.edges);
        });
      });

      it('should derive correct group edge configuration', async () => {
        await store.dispatch(groupEdgesWithAggregation(graphIndex));

        store.getActions().forEach((actions) => {
          const { payload } = actions;
          const { groupEdges } = payload.metadata;

          expect(groupEdges).toEqual(newGraphData.metadata.groupEdges);
        });
      });
    });
  });

  describe('computeEdgeSelection', () => {
    const simpleGraphWithGroupEdge = SimpleGraphWithGroupEdge();
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

    Object.assign(simpleGraphWithGroupEdge.metadata.fields, {
      edges: aggregatedEdgeFields,
    });

    const importedGraphState = (): RootState => {
      const store = {
        investigate: {
          ui: {},
          widget: {},
          graph: {
            present: {
              graphFlatten: simpleGraphWithGroupEdge,
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
      store.dispatch(computeEdgeSelection());
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
