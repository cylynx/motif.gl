/*
Copyright (c) 2018-2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow

import * as React from 'react';
import { Property } from './common';

// eslint-disable-next-line import/prefer-default-export
export function Grid() {
  return (
    <>
      <Property name='columns' concern='grid' renderValue={() => '4, 8, 12'} />
      <Property
        name='gutters'
        concern='grid'
        renderValue={() => '16px, 36px, 36px'}
      />
      <Property
        name='margins'
        concern='grid'
        renderValue={() => '16px, 36px, 64px'}
      />
      <Property name='gaps' concern='grid' renderValue={() => '0'} />
      <Property name='maxWidth' concern='grid' renderValue={() => '1280px'} />
    </>
  );
}
