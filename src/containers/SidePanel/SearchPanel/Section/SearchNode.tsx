import React, { useState, Fragment } from 'react';
import { Block } from 'baseui/block';
import { LabelXSmall } from 'baseui/typography';

import { OnChangeParams, Value } from 'baseui/select';
import SingleStringSelect from '../../../../components/SingleStringSelect';
import ResultAccordion from '../Components/ResultAccordion';
import useGraphSearch from '../hooks/useGraphSearch';
import { Node } from '../../../../redux/graph';

const SearchNode = () => {
  const [searchCase, setSearchCase] = useState<Value>([]);
  const [result, setResult] = useState<Node[]>([]);
  const { nodeOptions, searchNodes } = useGraphSearch();

  const onSearchChange = ({ value }: OnChangeParams): void => {
    setSearchCase(value);

    if (value.length === 0) {
      setResult([]);
      return;
    }

    const [selectedOption] = value;
    const result: Node[] = searchNodes(selectedOption.id as string);
    setResult(result);
  };

  return (
    <Block>
      <SingleStringSelect
        options={nodeOptions}
        labelKey='label'
        valueKey='id'
        placeholder='Find a node'
        onChange={onSearchChange}
        value={searchCase}
      />

      {searchCase.length > 0 && (
        <Fragment>
          <Block color='primary300' marginTop='scale800'>
            <LabelXSmall>
              Found {result.length} Node{result.length === 1 ? '' : 's'}
            </LabelXSmall>
          </Block>

          <Block marginTop='scale200'>
            <ResultAccordion results={result} />
          </Block>
        </Fragment>
      )}
    </Block>
  );
};

export default SearchNode;
