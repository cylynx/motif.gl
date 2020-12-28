import React, { FC, Fragment, useMemo, useState } from 'react';
import { Block } from 'baseui/block';
import { Button, SIZE } from 'baseui/button';
import { colors } from 'baseui/tokens';
import { useSelector } from 'react-redux';
import { ButtonGroup } from 'baseui/button-group';
import Header from '../Header';
import * as Icon from '../../../components/Icons';
import SelectVariable from '../../../components/SelectVariable';
import { getGraphFlatten } from '../../../redux';
import { Field, GraphFields } from '../../Graph';
import { DeleteButton } from '../../../components/DndList';

const validTypes: string[] = ['integer', 'real', 'timestamp', 'date'];

const FilterPanel: FC = () => {
  const [selection, setSelection] = useState([]);
  const graphFlatten = useSelector((state) => getGraphFlatten(state));
  const graphFields: GraphFields = graphFlatten.metadata.fields;

  const nodeOptions = useMemo(
    () =>
      graphFields.nodes
        .filter((f: Field) => validTypes.includes(f.type))
        .map((f: Field) => {
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
      graphFields.edges
        .filter((f: Field) => validTypes.includes(f.type))
        .map((f: Field) => {
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

  return (
    <Fragment>
      <Header />
      <Block display='flex' justifyContent='start' flexDirection='column'>
        <Block
          backgroundColor='backgroundTertiary'
          padding='scale300'
          width='auto'
          display='flex'
        >
          <SelectVariable
            value={selection}
            options={{
              Nodes: nodeOptions,
              Edges: edgeOptions,
            }}
            onChange={(obj) => setSelection([obj])}
            placeholder='Select a field'
          />
          <Block paddingLeft='scale100'>
            <ButtonGroup>
              <DeleteButton
                tooltip='Delete'
                overrides={{
                  BaseButton: {
                    style: ({ $theme }: any) => ({
                      paddingTop: $theme.sizing.scale400,
                      paddingRight: $theme.sizing.scale400,
                      paddingBottom: $theme.sizing.scale400,
                      paddingLeft: $theme.sizing.scale400,
                      ':hover': {
                        backgroundColor: $theme.colors.backgroundNegative,
                      },
                    }),
                  },
                }}
              />
              <Button
                size='mini'
                kind='minimal'
                $as='div'
                overrides={{
                  BaseButton: {
                    style: ({ $theme }: any) => ({
                      paddingTop: $theme.sizing.scale400,
                      paddingRight: $theme.sizing.scale400,
                      paddingBottom: $theme.sizing.scale400,
                      paddingLeft: $theme.sizing.scale400,
                      ':hover': {
                        backgroundColor: colors.yellow600,
                      },
                    }),
                  },
                }}
              >
                <Icon.Time />
              </Button>
            </ButtonGroup>
          </Block>
        </Block>
        <Button
          startEnhancer={<Icon.Plus />}
          onClick={() => alert('click')}
          size={SIZE.compact}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => {
                return {
                  backgroundColor: colors.green500,
                  textTransform: 'capitalize',
                  color: $theme.colors.inputPlaceholder,
                  borderRadius: $theme.sizing.scale200,
                  width: '130px',
                  marginTop: $theme.sizing.scale300,
                  ':hover': {
                    backgroundColor: colors.green400,
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
