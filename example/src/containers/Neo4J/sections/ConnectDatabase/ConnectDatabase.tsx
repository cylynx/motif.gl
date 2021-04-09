import React, { Dispatch, FC, SetStateAction, useMemo, useState } from 'react';
import { Block } from 'baseui/block';
import { Notification } from 'baseui/notification';
import { Driver } from 'neo4j-driver/types/driver';
import { createDriver } from 'use-neo4j';
import { useDispatch } from 'react-redux';
import { UIThunks, SimpleForm, genSimpleForm } from 'motif.gl';
import {
  neo4jHost,
  neo4jPassword,
  neo4jPort,
  neo4jUsername,
} from '../../../../constants/queryForm';
import { Button } from 'baseui/button';

const DEFAULT_DB_SETTINGS = {
  neo4jHost: 'localhost',
  neo4jPort: '7687',
  neo4jUsername: '',
  neo4jPassword: '',
};

type ConnectDatabaseProps = {
  driver: Driver;
  setDriver: Dispatch<SetStateAction<Driver>>;
};
const ConnectDatabase: FC<ConnectDatabaseProps> = ({ driver, setDriver }) => {
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

  const isFormDisabled = useMemo(() => {
    const isValueEmpty: boolean = Object.values(dbSettings).some((settings) => {
      return settings === '';
    });

    return isValueEmpty;
  }, [dbSettings]);

  return (
    <Block marginTop='scale600'>
      <form onSubmit={onConnectDb}>
        <Block display='flex' width='100%' gridGap='scale600'>
          <Block flex={1}>
            <SimpleForm
              data={genSimpleForm(neo4jHost, dbSettings, updateQueryOption)}
            />
            <SimpleForm
              data={genSimpleForm(neo4jUsername, dbSettings, updateQueryOption)}
            />
          </Block>

          <Block flex={1}>
            <SimpleForm
              data={genSimpleForm(neo4jPort, dbSettings, updateQueryOption)}
            />
            <SimpleForm
              data={genSimpleForm(neo4jPassword, dbSettings, updateQueryOption)}
            />
          </Block>
        </Block>

        <Block marginTop='scale600' display='flex' justifyContent='flex-end'>
          <Button
            type='submit'
            size='compact'
            disabled={isFormDisabled}
            overrides={{
              BaseButton: {
                style: {
                  width: '120px',
                },
              },
            }}
          >
            Connect
          </Button>
        </Block>
      </form>
      <Block marginTop='scale600'>
        <Notification
          kind='negative'
          closeable
          overrides={{
            Body: {
              style: {
                width: '96%',
              },
            },
          }}
        >
          This is a notification
        </Notification>
      </Block>

      <Block marginTop='scale600'>
        <Notification
          kind='positive'
          closeable
          overrides={{
            Body: {
              style: {
                width: '96%',
              },
            },
          }}
        >
          This is a notification
        </Notification>
      </Block>

      <Block position='absolute' bottom='scale300' right='0'>
        <Button
          type='submit'
          disabled={true}
          kind='primary'
          size='compact'
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

export default ConnectDatabase;
