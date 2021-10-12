// ts-nocheck
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';
import { render } from '@testing-library/react';
import { ToasterContainer } from 'baseui/toast';
import React from 'react';
import { addQuery, initialState, processGraphResponse } from '../slice';
import { resetState } from '../../import/fileUpload/slice';

import * as Constant from './constants/positive';
import { TFileContent } from '../../import/fileUpload';
import { importNodeEdgeCsv } from '../processors/import';
import { closeModal, fetchBegin, fetchDone, updateToast } from '../../ui/slice';
import { importNodeEdgeData } from '../thunk';

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

describe('Import Node Edge Data', () => {
  let store;
  beforeEach(() => {
    render(<ToasterContainer />);
    store = mockStore(getStore());
  });

  afterEach(() => {
    store.clearActions();
  });
  it('should receive nodeCsv and edgeCsv as array and process graph responses accurately', async (done) => {
    const store = mockStore(getStore());
    const { nodeCsv, edgeCsv } = Constant.sampleNodeEdgeData;
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
    const groupEdgeConfig = {
      toggle: groupEdgeToggle,
      availability: false,
    };
    Object.assign(data.metadata.groupEdges, groupEdgeConfig);

    const expectedActions = [
      fetchBegin(),
      addQuery([data]),
      processGraphResponse({
        data,
        accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      fetchDone(),
      closeModal(),
    ];

    return store
      .dispatch(
        importNodeEdgeData(
          Constant.sampleNodeEdgeData,
          groupEdgeToggle,
          accessors,
          metadataKey,
        ) as any,
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
  });

  it('should receive nodeCsv and edgeCsv as array and process graph responses accurately', async (done) => {
    const store = mockStore(getStore());
    const { nodeCsv, edgeCsv } = Constant.sampleNodeEdgeData;
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
    const groupEdgeConfig = {
      toggle: groupEdgeToggle,
      availability: false,
    };
    Object.assign(data.metadata.groupEdges, groupEdgeConfig);

    const expectedActions = [
      fetchBegin(),
      addQuery([data]),
      processGraphResponse({
        data,
        accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      fetchDone(),
      closeModal(),
    ];

    return store
      .dispatch(
        importNodeEdgeData(
          Constant.sampleNodeEdgeData,
          groupEdgeToggle,
          accessors,
          metadataKey,
        ) as any,
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
  });

  it('should import source and target with whitespace successfully', async (done) => {
    const store = mockStore(getStore());
    const { nodeCsv, edgeCsv } = Constant.whitespaceNodeEdge;
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
      addQuery([data]),
      processGraphResponse({
        data,
        accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      fetchDone(),
      closeModal(),
    ];

    return store
      .dispatch(
        importNodeEdgeData(
          Constant.whitespaceNodeEdge,
          groupEdgeToggle,
          accessors,
          metadataKey,
        ) as any,
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
  });

  it('should process numeric custom nodeID, edgeSource and edgeTarget successfully', async (done) => {
    const store = mockStore(getStore());
    const { nodeCsv, edgeCsv } = Constant.numericAccessorsNodeEdge;
    const accessors = {
      nodeID: 'custom_id',
      edgeID: 'id',
      edgeSource: 'numeric_source',
      edgeTarget: 'numeric_target',
    };

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
    const groupEdgeConfig = { toggle: groupEdgeToggle, availability: true };
    Object.assign(data.metadata.groupEdges, groupEdgeConfig);

    const expectedActions = [
      fetchBegin(),
      addQuery([data]),
      processGraphResponse({
        data,
        accessors,
      }),
      updateToast('toast-0'),
      resetState(),
      fetchDone(),
      closeModal(),
    ];

    return store
      .dispatch(
        importNodeEdgeData(
          Constant.numericAccessorsNodeEdge,
          groupEdgeToggle,
          accessors,
          metadataKey,
        ) as any,
      )
      .then(() => {
        setTimeout(() => {
          expect(store.getActions()).toEqual(expectedActions);
          done();
        }, 300);
      });
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
    await expect(importNodeEdgeData(invalidNodeEdgeData as any)).toThrow(Error);
  });
});
