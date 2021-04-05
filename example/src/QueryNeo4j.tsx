// @ts-nocheck
import React, { useState, useContext, Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'baseui/button';
import { Block } from 'baseui/block';
import { LabelMedium } from 'baseui/typography';
import { FormControl } from 'baseui/form-control';
import { Textarea } from 'baseui/textarea';
import { GraphThunks, UISlices, UIThunks } from 'motif.gl';
import Neo4j from 'neo4j-driver';
import { Neo4jProvider, Neo4jContext, createDriver, useReadSession} from 'use-neo4j';
import { SimpleForm, genSimpleForm } from './form';
import {
  neo4jHost,
  neo4jPort,
  neo4jUsername,
  neo4jPassword,
} from './queryForm';

const DEFAULT_DB_SETTINGS = {
  neo4jHost: 'localhost',
  neo4jPort: '7687',
  neo4jUsername: '',
  neo4jPassword: '',
};



const buildNode = (n: any) => {
  let node = {};
  if(n.properties) {
    for (let [key, value] of Object.entries(n.properties)) {
      node[key] = value instanceof Neo4j.types.Integer ? value.toInt() : value
    }
  }
  node.id = n.identity.toString();
  node.labels = n.labels[0]
  return {...node};
}

const buildEdge = (e: any) => {
  let edge = {};
  if(e.properties) {
    for (let [key, value] of Object.entries(e.properties)) {
      edge[key] = value instanceof Neo4j.types.Integer ? value.toInt() : value
    }
  }
  edge.id = e.identity.toString();
  edge.source = e.start.toString();
  edge.target = e.end.toString();
  edge.relationship = e.type
  return { ...edge };
}

 
/* Adapted from https://github.com/neo4j-contrib/neovis.js/blob/master/src/neovis.js */
const toMotifFormat = (records: any) => {
  let nodes = []
  let edges = []
  records.forEach(record => {
    Object.values(record.toObject()).map(async v => {
      if (v instanceof Neo4j.types.Node) {
        let node = buildNode(v);
          try {
            nodes.push(node)
          } catch (e) {
            console.log(e, 'error');
          }
      }
      else if (v instanceof Neo4j.types.Relationship) {
        let edge = buildEdge(v);
        edges.push(edge);
      } else if (v instanceof Neo4j.types.Path) {
        let startNode = buildNode(v.start);
        let endNode = buildNode(v.end);

        nodes.push(startNode)
        nodes.push(endNode)

        for (let obj of v.segments) {
          nodes.push(buildNode(obj.start))
          nodes.push(buildNode(obj.end))
          edges.push(buildEdge(obj.relationship));
        }
      } else if (v instanceof Array) {
        for (let obj of v) {
          if (obj instanceof Neo4j.types.Node) {
            let node = buildNode(obj);
            nodes.push(node);

          } else if (obj instanceof Neo4j.types.Relationship) {
            let edge = buildEdge(obj);
            edges.push(edge);
          }
        }
      }
        else {
        console.log('Invalid format')
      }
    })
  })

  console.log(nodes, edges)
  return {nodes, edges}
}


const QueryNeo4j = ({ driver, setDriver }) => {
  const dispatch = useDispatch();
  const [dbSettings, setDbSettings] = useState(DEFAULT_DB_SETTINGS);

  const updateQueryOption = (data: any) => {
    setDbSettings((state) => {
      return { ...state, ...data };
    });
  };

  const onConnectDb = (e: React.FormEvent) => {
    e.preventDefault();
    const driver = createDriver('neo4j', dbSettings.neo4jHost, dbSettings.neo4jPort, dbSettings.neo4jUsername, dbSettings.neo4jPassword)
    driver.verifyConnectivity().then(() => {
      setDriver(driver);
    }).catch(err => dispatch(UIThunks.show(err.message, 'negative')))
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
          <Block display='flex' flexDirection="" width='100%' gridGap='18px'>
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
  const { driver, database } = useContext(Neo4jContext)
  const [query, setQuery] = React.useState(`MATCH (n) RETURN n LIMIT 3`);
  const [error, setError] = React.useState('');

  const session = useReadSession()
  console.log(driver, database)

  const onQueryData = (e: React.FormEvent) => {

    e.preventDefault();
    session.run(query).then((res) => {
      const {nodes, edges} = toMotifFormat(res.records)
      return {nodes, edges}
    })
    .then((data) => {
      dispatch(GraphThunks.importSingleJsonData({ data, type: 'json' }));
      dispatch(UISlices.closeModal());
    })
    .catch((error) => setError(error.message));
  };


  return (
      <form onSubmit={onQueryData}>
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
        <Block display="flex" width="100%" justifyContent="space-between">
          <LabelMedium color="positive">{`Successfully connected to ${driver._address._host} as ${driver._authToken.principal}`}</LabelMedium>
          <Button type='submit'>Import Data</Button>
        </Block>
      </form>
  );
};

export default QueryNeo4j;
