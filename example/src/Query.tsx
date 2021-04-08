import React, { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { GraphThunks, UISlices } from 'motif.gl';
import { NestedForm, genNestedForm } from './form';
import { queryForm } from './queryForm';

const ENDPOINT = 'https://banking-demo.cylynx.io/api/';

const DEFAULT_QUERY_SETTINGS = {
  query: { id: 'customers', customer: '', risk_category: 'high' },
};

const ImportFromAPI = () => {
  const dispatch = useDispatch();

  const [queryOptions, setQueryOptions] = useState(DEFAULT_QUERY_SETTINGS);

  const updateQueryOption = (data: any) => {
    setQueryOptions(data);
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    let querypath = `${ENDPOINT}${queryOptions.query.id}?`;
    for (const [key, value] of Object.entries(queryOptions.query)) {
      if (key !== 'id' && value) {
        querypath = `${querypath}${key}=${value}&`;
      }
    }

    querypath = querypath.slice(0, -1);
    fetch(querypath)
      .then((response) => response.json())
      .then((data) => {
        dispatch(GraphThunks.importSingleJsonData({ data, type: 'json' }));
        dispatch(UISlices.closeModal());
      });
  };

  return (
    <Fragment>
      <form onSubmit={onSubmitForm}>
        <NestedForm
          data={genNestedForm(queryForm, queryOptions, updateQueryOption)}
        />
        <Block marginTop='10px' display='flex' justifyContent='flex-end'>
          <Button type='submit'>Import Data</Button>
        </Block>
      </form>
    </Fragment>
  );
};

export default ImportFromAPI;
