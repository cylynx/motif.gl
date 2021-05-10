/*
Copyright (c) 2018-2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow

import * as React from "react"
import { useStyletron } from "baseui"
import { Property } from "./common"

// eslint-disable-next-line import/prefer-default-export
export function Sizing({ name }) {
  const [css, theme] = useStyletron()
  return (
    <Property
      name={name}
      concern="sizing"
      renderPreview={() => (
        <div
          className={css({
            backgroundColor: theme.colors.contentPrimary,
            height: theme.sizing[name],
            width: theme.sizing[name],
          })}
        />
      )}
      renderValue={() => theme.sizing[name]}
    />
  )
}
