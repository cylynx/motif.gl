import React, { useState } from 'react';

import { Block } from 'baseui/block';
import { useSelector } from 'react-redux';
import { getUI } from '../../redux';
import Editable from '../../components/Editable';

const Header = () => {
  const [value, setValue] = useState(useSelector((state) => getUI(state).name));

  return (
    <Block marginTop='scale300' marginBottom='scale800'>
      <Editable text={value} editIcon onSubmit={(text) => setValue(text)} />
    </Block>
  );
};

export default Header;
