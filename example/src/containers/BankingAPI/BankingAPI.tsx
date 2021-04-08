import React, { useState, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Button, KIND, SIZE } from 'baseui/button';
import { Block } from 'baseui/block';
import { GraphThunks, NestedForm, genNestedForm } from 'motif.gl';
import { queryForm } from '../../constants/queryForm';

const ENDPOINT = 'https://banking-demo.cylynx.io/api/';

const DEFAULT_QUERY_SETTINGS = {
  query: { id: 'customers', customer: '', risk_category: 'high' },
};

const BankingAPI = () => {
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
        dispatch(GraphThunks.importSampleData(data));
      });
  };

  return (
    <Fragment>
      <form onSubmit={onSubmitForm}>
        <NestedForm
          data={genNestedForm(queryForm, queryOptions, updateQueryOption)}
        />

        <Block position='absolute' bottom='scale300' right='0'>
          <Button
            type='submit'
            disabled={false}
            kind={KIND.primary}
            size={SIZE.compact}
          >
            Import
          </Button>
        </Block>
      </form>
    </Fragment>
  );
};

export default BankingAPI;
