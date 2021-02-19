import React from 'react';

import { Block } from 'baseui/block';
import Header from '../Header';
import MainSection from './Section/MainSection';
import ItemResults from './Section/ItemResults';

const SearchPanel = () => {
  return (
    <Block>
      <Header />
      <MainSection />
      <ItemResults />
    </Block>
  );
};

export default SearchPanel;
