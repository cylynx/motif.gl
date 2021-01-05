import React, { FC, Fragment, useMemo, MouseEvent, useCallback } from 'react';
import { Block } from 'baseui/block';
import { useSelector } from 'react-redux';
import Header from '../Header';
import FilterSelection from './FilterSelection';
import AddFilterButton from './AddFilterButton';
import useGraphFilter from './hooks/UseGraphFilter';

import { getGraphFlatten } from '../../../redux';
import { Field, GraphFields } from '../../Graph';
import { SelectOptions } from '../../../components/SelectVariable/SelectVariable';

const FilterPanel: FC = () => {
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphFields: GraphFields = graphFlatten.metadata.fields;
  const { filterOptions, addFilter } = useGraphFilter();

  const nodeOptions = useMemo(
    () =>
      (graphFields.nodes as Field[]).map((f: Field) => {
        const optionKey = `nodes-${f.name}`;
        return {
          id: f.name,
          label: f.name,
          type: f.type,
          analyzerType: f.analyzerType,
          format: f.format,
          from: 'nodes',
          optionKey,
        };
      }),
    [graphFields],
  );

  const edgeOptions = useMemo(
    () =>
      (graphFields.edges as Field[]).map((f: Field) => {
        const optionKey = `edges-${f.name}`;
        return {
          id: f.name,
          label: f.name,
          type: f.type,
          analyzerType: f.analyzerType,
          format: f.format,
          from: 'edges',
          optionKey,
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

  const isEnableAddFilter = useMemo(() => {
    const { edges, nodes } = graphFlatten;
    return edges.length !== 0 && nodes.length !== 0;
  }, [graphFlatten]);

  const onAddFilterClick = useCallback(
    (_: MouseEvent<HTMLButtonElement>) => {
      if (isEnableAddFilter === false) {
        return;
      }

      addFilter();
    },
    [isEnableAddFilter],
  );

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

  const AddFilterButtonMemo = useMemo(() => {
    return (
      <AddFilterButton
        onClick={onAddFilterClick}
        disabled={!isEnableAddFilter}
      />
    );
  }, [onAddFilterClick, isEnableAddFilter]);

  return (
    <Fragment>
      <Header />
      <Block display='flex' justifyContent='start' flexDirection='column'>
        {FilterSelections}
        {AddFilterButtonMemo}
      </Block>
    </Fragment>
  );
};

export default FilterPanel;
