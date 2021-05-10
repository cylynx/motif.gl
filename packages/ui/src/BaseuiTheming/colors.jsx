/*
Copyright (c) 2018-2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow

import * as React from "react"
import { useStyletron, expandBorderStyles } from "baseui/styles"
import { colors } from "baseui/tokens"
import { PropertyCompareTheme } from "./common"

function getTokenFromCode(code) {
  let res = ""
  Object.entries(colors).forEach(([name, value]) => {
    if (value === code) res = name
  })
  return res
}

// eslint-disable-next-line import/prefer-default-export
export function Color({ name }) {
  const [css] = useStyletron()
  return (
    <PropertyCompareTheme
      name={name}
      concern="colors"
      renderBox={({ previewTheme, commonStyles }) => (
        <div
          className={css({
            ...commonStyles,
            ...expandBorderStyles(previewTheme.borders.border600),
            backgroundColor: previewTheme.colors[name],
          })}
        />
      )}
      renderValue={({ previewTheme }) => (
        <>
          <div>{previewTheme.colors[name]}</div>
          <div>{getTokenFromCode(previewTheme.colors[name])}</div>
        </>
      )}
    />
  )
}
