/* eslint-disable import/prefer-default-export */
/*
Copyright (c) 2018-2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow

import * as React from 'react';
import { useStyletron } from 'baseui';
import { Property } from './common';

export function Type({ name }) {
  const [css, theme] = useStyletron();
  return (
    <Property
      name={name}
      concern='typography'
      renderPreview={() => (
        <div className={css({ ...theme.typography[name] })}>Example</div>
      )}
      renderValue={() => (
        <>
          <div>{theme.typography[name].fontSize}</div>
          <div>{theme.typography[name].fontWeight}</div>
          <div>{theme.typography[name].lineHeight}</div>
        </>
      )}
    />
  );
}
