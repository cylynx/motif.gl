import React, { ChangeEvent, FC, useContext, useMemo, useState } from 'react';
import { Neo4jContext, Neo4jProvider, useDatabases } from 'use-neo4j';
import { Neo4jContextState } from 'use-neo4j/dist/neo4j.context';
import { Select, OnChangeParams } from 'baseui/select';
import { Driver } from 'neo4j-driver/types/driver';
import { QueryResult } from 'neo4j-driver/types/result';
import { toMotifFormat } from '../../utils';
import Record from 'neo4j-driver/types/record';
import { FormControl } from 'baseui/form-control';
import { Textarea } from 'baseui/textarea';
import { Block } from 'baseui/block';
import { Button } from 'baseui/button';
import { LabelSmall } from 'baseui/typography';
import { GraphData } from 'motif.gl';
import { ExecuteQueryProps, CypherQueryProps } from './types';
import { TNotification } from '../ConnectDatabase/types';
import BaseNotification from '../../../../components/BaseNotification';

const CypherQuery: FC<CypherQueryProps> = ({
  nextStep,
  states: { db, query, graphData },
  onStateChange,
}) => {
  const { driver } = useContext(Neo4jContext) as Neo4jContextState;
  const { loading, databases } = useDatabases();
  const [isBtnLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<TNotification>({});

  const dbOptions = databases?.map((x) => {
    return { id: x.name, label: x.name };
  });

  const isQueryBtnDisable: boolean = useMemo(() => {
    const isFormEmpty = db.length === 0 || query === '';
    return isFormEmpty;
  }, [db, query]);

  const isContinueBtnDisable: boolean = useMemo(() => {
    const { nodes, edges } = graphData;
    const isGraphEmpty = nodes.length === 0 && edges.length === 0;
    return isGraphEmpty;
  }, [graphData]);

  const onQueryData = (e: React.FormEvent) => {
    e.preventDefault();

    if (db.length === 0) {
      return;
    }

    setIsLoading(true);

    (driver as Driver)
      .session({ database: db[0].id as string })
      .run(query)
      .then((res: QueryResult) => {
        const { nodes, edges } = toMotifFormat(res.records as Record[]);
        return { nodes, edges };
      })
      .then((data: GraphData) => {
        const { nodes, edges } = data;
        onStateChange('graphData', data);

        const nodeLength = nodes.length;
        const edgesLength = edges.length;

        setNotification({
          kind: 'positive',
          children: (
            <Block as='span'>
              Imported <b>{nodeLength} Node(s)</b> and{' '}
              <b>{edgesLength} Edge(s)</b>.
            </Block>
          ),
        });
      })
      .catch((error) => {
        onStateChange('graphData', {
          nodes: [],
          edges: [],
        });
        setNotification({
          kind: 'negative',
          children: error.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Block marginTop='scale600'>
      <form onSubmit={onQueryData}>
        {!loading && databases && (
          <>
            <FormControl label='Schema'>
              <Select
                value={db}
                options={dbOptions}
                onChange={(params: OnChangeParams) => {
                  onStateChange('db', params.value);
                }}
                placeholder='Select Database'
                size='compact'
              />
            </FormControl>

            {db.length !== 0 && (
              <>
                <Block
                  marginTop='scale300'
                  display='flex'
                  justifyContent='space-between'
                  alignItems='baseline'
                >
                  <LabelSmall>Query</LabelSmall>

                  <Button
                    size='compact'
                    disabled={isBtnLoading ?? isQueryBtnDisable}
                    isLoading={isBtnLoading}
                    type='submit'
                  >
                    Execute Query
                  </Button>
                </Block>

                <Block marginTop='scale300'>
                  <Textarea
                    value={query}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                      const { value } = e.currentTarget;
                      onStateChange('query', value);
                    }}
                    placeholder='Enter Cypher Query here...'
                    required
                    overrides={{
                      Input: {
                        style: {
                          height: '200px',
                          width: '100vw',
                          fontSize: '14px`',
                        },
                      },
                    }}
                  />
                </Block>
              </>
            )}
          </>
        )}
      </form>

      {notification.kind && (
        <Block marginTop='scale300'>
          <BaseNotification kind={notification.kind} height='50px'>
            {notification.children}
          </BaseNotification>
        </Block>
      )}

      <Block position='absolute' bottom='scale300' right='0'>
        <Button
          type='button'
          disabled={isContinueBtnDisable}
          kind='primary'
          size='compact'
          onClick={() => nextStep()}
          overrides={{
            BaseButton: {
              style: {
                width: '120px',
              },
            },
          }}
        >
          Continue
        </Button>
      </Block>
    </Block>
  );
};

const ExecuteQuery: FC<ExecuteQueryProps> = ({
  driver,
  nextStep,
  states,
  onStateChange,
}) => {
  return (
    <Neo4jProvider driver={driver}>
      <CypherQuery
        nextStep={nextStep}
        states={states}
        onStateChange={onStateChange}
      />
    </Neo4jProvider>
  );
};

export default ExecuteQuery;
