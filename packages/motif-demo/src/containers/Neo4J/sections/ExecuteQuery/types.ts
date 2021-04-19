import { Value } from 'baseui/select';
import { Driver } from 'neo4j-driver/types/driver';
import { GraphData } from '@cylynx/motif';

export type ExecuteQueryState = {
  db: Value;
  query: string;
  graphData: GraphData;
};

export type ExecuteQueryProps = CypherQueryProps & {
  driver: Driver;
};

export type CypherQueryProps = {
  nextStep: () => void;
  states: ExecuteQueryState;
  onStateChange: (name: string, value: string | Value | GraphData) => void;
};
