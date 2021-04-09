import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Block } from 'baseui/block';
import { Driver } from 'neo4j-driver/types/driver';
import { createDriver } from 'use-neo4j';
import { SimpleForm, genSimpleForm } from 'motif.gl';
import {
  neo4jHost,
  neo4jPassword,
  neo4jPort,
  neo4jUsername,
} from '../../../../constants/queryForm';
import { Button } from 'baseui/button';
import { TNotification } from './types';
import BaseNotification from '../../../../components/BaseNotification';

const DEFAULT_DB_SETTINGS = {
  neo4jHost: 'localhost',
  neo4jPort: '7687',
  neo4jUsername: '',
  neo4jPassword: '',
};

type ConnectDatabaseProps = {
  driver: Driver;
  setDriver: Dispatch<SetStateAction<Driver>>;
  nextStep: () => void;
};
const ConnectDatabase: FC<ConnectDatabaseProps> = ({
  driver,
  setDriver,
  nextStep,
}) => {
  const [dbSettings, setDbSettings] = useState(DEFAULT_DB_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<TNotification>({});

  useEffect(() => {
    if (isContinueDisabled === false) {
      const {
        // @ts-ignore
        _address: { _hostPort },
      } = driver;
      setNotification({
        kind: 'info',
        children: (
          <Block as='span'>
            You are currently connected to <b>{_hostPort}</b>
          </Block>
        ),
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    setIsLoading(true);

    connectionDriver
      .verifyConnectivity()
      .then(() => {
        setDriver(connectionDriver);

        setNotification({
          kind: 'positive',
          children: <Block as='span'>Connected</Block>,
        });
      })
      .catch((err) => {
        setNotification({
          kind: 'negative',
          children: <Block as='span'>{err.message}</Block>,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const isFormDisabled = useMemo(() => {
    const isValueEmpty: boolean = Object.values(dbSettings).some((settings) => {
      return settings === '';
    });

    return isValueEmpty;
  }, [dbSettings]);

  const isContinueDisabled = useMemo(() => {
    return Object.keys(driver).length === 0;
  }, [driver]);

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
            isLoading={isLoading}
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

      {Object.keys(notification).length !== 0 && (
        <Block marginTop='scale600'>
          <BaseNotification kind={notification.kind}>
            {notification.children}
          </BaseNotification>
        </Block>
      )}

      <Block position='absolute' bottom='scale300' right='0'>
        <Button
          type='button'
          disabled={isContinueDisabled ?? isLoading}
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

export default ConnectDatabase;
