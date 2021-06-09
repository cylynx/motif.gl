import React, { FC, useMemo, MouseEvent, useCallback } from 'react';
import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { HeadingMedium } from 'baseui/typography';
import { useSelector } from 'react-redux';
import FilterSelection from './FilterSelection';
import AddFilterButton from './AddFilterButton';
import useGraphFilter from './hooks/UseGraphFilter';

import { GraphSelectors, Field, GraphFields } from '../../../redux/graph';
import { SelectOptions } from '../../../components/SelectVariable/SelectVariable';
import QuestionMarkTooltip from '../../../components/ui/QuestionMarkTooltip';

const FilterPanel: FC = () => {
  const [css, theme] = useStyletron();
  const graphFlatten = useSelector((state) =>
    GraphSelectors.getGraphFlatten(state),
  );
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
      __ungrouped: [],
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

  const FilterSelections = Object.entries(filterOptions)
    .map((entry) => {
      const [key] = entry;
      return (
        <FilterSelection
          graphFlatten={graphFlatten}
          selectOptions={selectOptions}
          data-testid='filter-panel:filter-selection'
          key={key}
          idx={key}
        />
      );
    })
    .reverse();

  const AddFilterButtonMemo = useMemo(() => {
    return (
      <AddFilterButton
        onClick={onAddFilterClick}
        disabled={!isEnableAddFilter}
      />
    );
  }, [onAddFilterClick, isEnableAddFilter]);

  return (
    <Block data-testid='filter-panel'>
      <HeadingMedium marginTop='scale300' marginBottom='scale300'>
        Filters{' '}
        <QuestionMarkTooltip
          tooltip={
            <Block width='185px'>
              Add filters to your graph to limit the data that is displayed.
              Multiple filters apply additively.
            </Block>
          }
        />
      </HeadingMedium>
      {AddFilterButtonMemo}
      <hr
        className={css({ borderColor: theme.colors.contentInverseSecondary })}
      />
      <Block
        display='flex'
        justifyContent='start'
        flexDirection='column'
        gridGap='scale200'
      >
        {FilterSelections}
      </Block>
    </Block>
  );
};

export default FilterPanel;
