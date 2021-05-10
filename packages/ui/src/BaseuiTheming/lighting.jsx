/*
Copyright (c) 2018-2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow

import * as React from 'react';
import { useStyletron } from 'baseui';
import { PropertyCompareTheme } from './common';

// eslint-disable-next-line import/prefer-default-export
export function Lighting({ name }) {
  const [css] = useStyletron();
  return (
    <PropertyCompareTheme
      name={name}
      concern='lighting'
      renderBox={({ previewTheme, commonStyles }) => (
        <div
          className={css({
            ...commonStyles,
            boxShadow: previewTheme.lighting[name],
          })}
        />
      )}
      renderValue={({ previewTheme }) => previewTheme.lighting[name]}
    />
  );
}
