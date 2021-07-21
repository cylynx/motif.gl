import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import { render } from '@testing-library/react';
import React from 'react';
import { ToasterContainer } from 'baseui/toast';
import {
  addQuery,
  initialState,
  overwriteEdgeSelection,
  processGraphResponse,
} from '../slice';
import { closeModal, fetchBegin, fetchDone, updateToast } from '../../ui/slice';
import { resetState } from '../../import/fileUpload/slice';

import * as Constant from './constant';
import { importEdgeListCsv } from '../processors/import';
import { computeEdgeSelection, importEdgeListData } from '../thunk';
import { combineGraphs } from '../../../utils/graph-utils/utils';
import { Field, Selection } from '../types';
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

describe('Import Edge List Data', () => {
  let store;
  beforeEach(() => {
    render(<ToasterContainer />);
    store = mockStore(getStore());
  });

  afterEach(() => {
    store.clearActions();
  });

  it('should import header with quotes successfully', async (done) => {
    const store = mockStore(getStore());
    const importDataArr = [Constant.quotesHeaderCsv];
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
    const [graphData] = graphDataArr;

    const groupEdgeConfig = { toggle: groupEdgeToggle, availability: false };
    Object.assign(graphData.metadata.groupEdges, groupEdgeConfig);

    const expectedActions = [
      fetchBegin(),
      addQuery([graphData]),
      processGraphResponse({
        data: graphData,
        accessors: initialState.accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      fetchDone(),
      closeModal(),
    ];

    // assertions
    return store
      .dispatch(
        importEdgeListData(
          importDataArr,
          groupEdgeToggle,
          initialState.accessors,
        ) as any,
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
  });

  it('should receive importData as array and process graph responses accurately', async (done) => {
    const store = mockStore(getStore());

    // input
    const importDataArr = [
      Constant.firstEdgeListCsv,
      Constant.secondEdgeListCsv,
    ];
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

    const mergedGraph = combineGraphs([firstGraphData, secondGraphData]);

    // expected results
    const expectedActions = [
      fetchBegin(),
      addQuery([firstGraphData, secondGraphData]),
      processGraphResponse({
        data: mergedGraph,
        accessors: initialState.accessors,
      }),

      updateToast('toast-0'),
      resetState(),
      fetchDone(),
      closeModal(),
    ];

    // assertions
    return store
      .dispatch(
        importEdgeListData(
          importDataArr,
          groupEdgeToggle,
          initialState.accessors,
        ) as any,
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
  });

  it('should throw errors if importData parameter is not array', async () => {
    await expect(importEdgeListData(Constant.firstEdgeListCsv as any)).toThrow(
      Error,
    );
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
