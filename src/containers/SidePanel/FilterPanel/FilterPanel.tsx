import React, { FC, Fragment, useMemo } from 'react';
import { Block } from 'baseui/block';
import { Button, SIZE } from 'baseui/button';
import { colors } from 'baseui/tokens';
import { useSelector } from 'react-redux';
import Header from '../Header';
import * as Icon from '../../../components/Icons';
import { getGraphFlatten } from '../../../redux';
import { Field, GraphFields } from '../../Graph';
import { SelectOptions } from '../../../components/SelectVariable/SelectVariable';
import FilterSelection from './FilterSelection';

const FilterPanel: FC = () => {
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphFields: GraphFields = graphFlatten.metadata.fields;

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

  return (
    <Fragment>
      <Header />
      <Block display='flex' justifyContent='start' flexDirection='column'>
        <FilterSelection selectOptions={selectOptions} />
        <Button
          startEnhancer={<Icon.Plus />}
          onClick={() => alert('click')}
          size={SIZE.compact}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => {
                return {
                  backgroundColor: colors.green400,
                  textTransform: 'capitalize',
                  color: $theme.colors.inputPlaceholder,
                  width: '120px',
                  marginTop: $theme.sizing.scale300,
                  ':hover': {
                    backgroundColor: colors.green300,
                    color: $theme.colors.backgroundInversePrimary,
                  },
                };
              },
            },
          }}
        >
          add filter
        </Button>
      </Block>
    </Fragment>
  );
};

export default FilterPanel;
