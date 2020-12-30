import React, { FC, Fragment, useMemo, useState, MouseEvent } from 'react';
import shortid from 'shortid';
import { Block } from 'baseui/block';
import { useSelector } from 'react-redux';
import Header from '../Header';
import FilterSelection from './FilterSelection';
import AddFilterButton from './AddFilterButton';

import { getGraphFlatten } from '../../../redux';
import { Field, GraphFields } from '../../Graph';
import { SelectOptions } from '../../../components/SelectVariable/SelectVariable';
import useGraphFilter from './hooks/UseGraphFilter';

type FilterSelectionsType = {
  [key: string]: any;
};

const FilterPanel: FC = () => {
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphFields: GraphFields = graphFlatten.metadata.fields;

  const [filterOptions, { addFilter }] = useGraphFilter(graphFlatten);

  const nodeOptions = useMemo(
    () =>
      (graphFields.nodes as Field[]).map((f: Field) => {
        return {
          id: f.name,
          label: f.name,
          type: f.type,
          analyzerType: f.analyzerType,
          format: f.format,
          from: 'nodes',
        };
      }),
    [graphFields],
  );

  const edgeOptions = useMemo(
    () =>
      (graphFields.edges as Field[]).map((f: Field) => {
        return {
          id: f.name,
          label: f.name,
          type: f.type,
          analyzerType: f.analyzerType,
          format: f.format,
          from: 'edges',
        };
      }),
    [graphFields],
  );

  const selectOptions: SelectOptions = useMemo(() => {
    return {
      Nodes: nodeOptions,
      Edges: edgeOptions,
    };
  }, [edgeOptions, nodeOptions]);

  const onAddFilterClick = (_: MouseEvent<HTMLButtonElement>) => {
    addFilter();
  };

  const FilterSelections = Object.entries(filterOptions).map((entry) => {
    const [key] = entry;
    return (
      <FilterSelection
        graphFlatten={graphFlatten}
        selectOptions={selectOptions}
        key={key}
        idx={key}
      />
    );
  });

  return (
    <Fragment>
      <Header />
      <Block display='flex' justifyContent='start' flexDirection='column'>
        {FilterSelections}
        <AddFilterButton onClick={onAddFilterClick} />
      </Block>
    </Fragment>
  );
};

export default FilterPanel;
