// ts-nocheck
import { render } from '@testing-library/react';
import React from 'react';
import { ToasterContainer } from 'baseui/toast';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import { initialState, addQuery, processGraphResponse } from '../slice';
import { importJson } from '../processors/import';
import { Accessors, GraphData, JsonImport } from '../types';

import * as Constant from './constant';
import { importJsonData } from '../thunk';
import { fetchBegin, fetchDone, updateToast, closeModal } from '../../ui/slice';
import { resetState } from '../../import/fileUpload/slice';

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

describe('Import JSON', () => {
  let store;
  beforeEach(() => {
    render(<ToasterContainer />);
    store = mockStore(getStore());
  });

  afterEach(() => {
    store.clearActions();
  });

  it('should process custom accessors with numeric values accurately', async (done) => {
    const importDataArr = [Constant.simpleGraphThree];
    const groupEdgeToggle = false;

    const customAccessors: Accessors = {
      nodeID: 'custom_id',
      edgeID: 'id',
      edgeSource: 'custom_source',
      edgeTarget: 'custom_target',
    };

    // processes
    const batchDataPromises = importDataArr.map((graphData) => {
      const { data } = graphData;
      return importJson(data as any, customAccessors, groupEdgeToggle);
    });

    const graphDataArr = await Promise.all(batchDataPromises);
    const [graphData] = flatten(graphDataArr);

    // group edge configuration arrangements
    const groupEdgeConfig = { availability: false, toggle: groupEdgeToggle };
    Object.assign(graphData.metadata.groupEdges, groupEdgeConfig);

    const expectedActions = [
      fetchBegin(),
      addQuery([graphData]),
      processGraphResponse({
        data: graphData,
        accessors: customAccessors,
      }),
      updateToast('toast-0'),
      resetState(),
      fetchDone(),
      closeModal(),
    ];

    return store
      .dispatch(
        importJsonData(importDataArr as any, groupEdgeToggle, customAccessors),
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 50);
      });
  });
});
