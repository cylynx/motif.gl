import React, {
  useState,
  useContext,
  Fragment,
  FC,
  Dispatch,
  SetStateAction,
} from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { Select, Value } from 'baseui/select';
import { FormControl } from 'baseui/form-control';
import { Textarea } from 'baseui/textarea';
// @ts-ignore
import { GraphThunks, UIThunks, SimpleForm, genSimpleForm } from 'motif.gl';
import {
  Neo4jProvider,
  Neo4jContext,
  createDriver,
  useDatabases,
} from 'use-neo4j';
import { QueryResult } from 'neo4j-driver/types/result';
import Record from 'neo4j-driver/types/record';
import { Driver } from 'neo4j-driver/types/driver';
import {
  neo4jHost,
  neo4jPort,
  neo4jUsername,
  neo4jPassword,
} from '../../constants/queryForm';
import { toMotifFormat } from './utils';
import { Neo4jContextState } from 'use-neo4j/dist/neo4j.context';

const DEFAULT_DB_SETTINGS = {
  neo4jHost: 'localhost',
  neo4jPort: '7687',
  neo4jUsername: '',
  neo4jPassword: '',
};

type Neo4JProps = {
  driver: Driver;
  setDriver: Dispatch<SetStateAction<Driver>>;
};
const OldNeo4j: FC<Neo4JProps> = ({ driver, setDriver }) => {
  const dispatch = useDispatch();
  const [dbSettings, setDbSettings] = useState(DEFAULT_DB_SETTINGS);

  const updateQueryOption = (data: any) => {
    setDbSettings((state) => {
      return { ...state, ...data };
    });
  };

  const onConnectDb = (e: React.FormEvent) => {
    e.preventDefault();
    const connectionDriver: Driver = createDriver(
      'bolt',
      dbSettings.neo4jHost,
      dbSettings.neo4jPort,
      dbSettings.neo4jUsername,
      dbSettings.neo4jPassword,
    );
    connectionDriver
      .verifyConnectivity()
      .then(() => {
        setDriver(driver);
      })
      .catch((err) => dispatch(UIThunks.show(err.message, 'negative')));
  };

  return (
    <Fragment>
      {driver && (
        <Neo4jProvider driver={driver}>
          <CypherQuery />
        </Neo4jProvider>
      )}
      {!driver && (
        <form onSubmit={onConnectDb}>
          <Block display='flex' width='100%' gridGap='18px'>
            <Block flex={1}>
              <SimpleForm
                data={genSimpleForm(neo4jHost, dbSettings, updateQueryOption)}
              />
              <SimpleForm
                data={genSimpleForm(
                  neo4jUsername,
                  dbSettings,
                  updateQueryOption,
                )}
              />
            </Block>
            <Block flex={1}>
              <SimpleForm
                data={genSimpleForm(neo4jPort, dbSettings, updateQueryOption)}
              />
              <SimpleForm
                data={genSimpleForm(
                  neo4jPassword,
                  dbSettings,
                  updateQueryOption,
                )}
              />
            </Block>
          </Block>
          <Block marginTop='10px' display='flex' justifyContent='flex-end'>
            <Button type='submit'>Connect</Button>
          </Block>
        </form>
      )}
    </Fragment>
  );
};

const CypherQuery = () => {
  const dispatch = useDispatch();
  const { driver } = useContext(Neo4jContext) as Neo4jContextState;
  const { loading, databases } = useDatabases();
  const [query, setQuery] = React.useState(`MATCH (n) RETURN n LIMIT 3`);
  const [queryDb, setQueryDb] = React.useState<Value>([]);
  const [error, setError] = React.useState('');

  const dbOptions = databases?.map((x) => {
    return { id: x.name, label: x.name };
  });

  const onQueryData = (e: React.FormEvent) => {
    e.preventDefault();
    (driver as Driver)
      .session({ database: queryDb[0].id as string })
      .run(query)
      .then((res: QueryResult) => {
        const { nodes, edges } = toMotifFormat(res.records as Record[]);
        return { nodes, edges };
      })
      .then((data) => {
        dispatch(GraphThunks.importSampleData(data));
      })
      .catch((error) => setError(error.message));
  };

  return (
    <form onSubmit={onQueryData}>
      {!loading && databases && (
        <>
          <FormControl label='Database'>
            <Select
              value={queryDb}
              options={dbOptions}
              onChange={(params) => setQueryDb(params.value)}
              placeholder='Select Database'
              size='compact'
            />
          </FormControl>
          <FormControl label='Cypher Query' error={error}>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              placeholder='Enter cypher query here...'
              overrides={{
                Input: {
                  style: {
                    height: '200px',
                    width: '100vw',
                  },
                },
              }}
            />
          </FormControl>
          <Block display='flex' width='100%' justifyContent='space-between'>
            {/*<LabelMedium color='positive'>{`Successfully connected to ${driver._address._host} as ${driver._authToken.principal}`}</LabelMedium>*/}
            <Button type='submit'>Import Data</Button>
          </Block>
        </>
      )}
    </form>
  );
};

export default OldNeo4j;
