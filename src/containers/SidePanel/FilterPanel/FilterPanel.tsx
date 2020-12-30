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

type FilterSelectionsType = {
  [key: string]: any;
};

const FilterPanel: FC = () => {
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphFields: GraphFields = graphFlatten.metadata.fields;
  const [filterSelections, setFilterSelections] = useState<
    FilterSelectionsType
  >({});

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

  const addFilter = (_: MouseEvent<HTMLButtonElement>) => {
    const filterSelectionKey: string = shortid.generate();
    setFilterSelections((filterSelection: FilterSelectionsType) => ({
      ...filterSelection,
      [filterSelectionKey]: {},
    }));
  };

  const deleteFilter = (idx: string) => {
    setFilterSelections((filterSelection: FilterSelectionsType) => {
      const { [idx]: value, ...res } = filterSelection;
      return res;
    });
  };

  const FilterSelections = Object.entries(filterSelections).map((entry) => {
    const [key] = entry;
    return (
      <FilterSelection
        graphFlatten={graphFlatten}
        selectOptions={selectOptions}
        key={key}
        idx={key}
        onDeleteBtnClick={deleteFilter}
      />
    );
  });

  return (
    <Fragment>
      <Header />
      <Block display='flex' justifyContent='start' flexDirection='column'>
        {FilterSelections}
        <AddFilterButton onClick={addFilter} />
      </Block>
    </Fragment>
  );
};

export default FilterPanel;
