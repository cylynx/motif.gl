import React, { BaseSyntheticEvent, FC, useMemo } from 'react';
import { Block } from 'baseui/block';
import {
  GraphData,
  GraphThunks,
  GraphGroupEdgeProcessors,
  GroupEdgeConfiguration,
} from '@cylynx/motif';
import { Button, KIND, SIZE } from 'baseui/button';
import { useDispatch } from 'react-redux';
import { SubmitHandler, UnpackNestedValue, useForm } from 'react-hook-form';
import DataPreview from './DataPreview';

type ConfigureFieldsProps = { graphData: GraphData };
const ConfigureFields: FC<ConfigureFieldsProps> = ({ graphData }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      groupEdge: true,
    },
  });

  const isEdgeGroupable = useMemo(() => {
    const duplicateDictionary = GraphGroupEdgeProcessors.duplicateDictionary(
      graphData,
    );
    const isGraphGroupEdgeable = Object.keys(duplicateDictionary).length !== 0;
    return isGraphGroupEdgeable;
  }, [graphData]);

  const onSubmit: SubmitHandler<any> = (
    data: UnpackNestedValue<any>,
    e: BaseSyntheticEvent,
  ) => {
    e.preventDefault();

    const { groupEdge } = data;
    const accessors = {
      nodeID: 'id',
      edgeSource: 'source',
      edgeTarget: 'target',
    };
    dispatch(GraphThunks.importSampleData(graphData, accessors, groupEdge));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Block marginTop='scale200'>
        <DataPreview
          isEdgeGroupable={isEdgeGroupable}
          dataType='neo4j'
          graphData={graphData}
        />
      </Block>

      {isEdgeGroupable && <GroupEdgeConfiguration control={control} />}

      <Block position='absolute' bottom='scale300' right='0'>
        <Button type='submit' kind={KIND.primary} size={SIZE.compact}>
          Import Data
        </Button>
      </Block>
    </form>
  );
};

export default ConfigureFields;
