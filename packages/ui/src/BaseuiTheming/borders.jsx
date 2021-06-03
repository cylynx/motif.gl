/*
Copyright (c) 2018-2020 Uber Technologies, Inc.

This source code is licensed under the MIT license found in the
LICENSE file in the root directory of this source tree.
*/
// @flow

import * as React from "react"
import { useStyletron } from "baseui"
import { Property, PropertyCompareTheme } from "./common"

export function Border({ name }) {
  const [css] = useStyletron()
  return (
    <PropertyCompareTheme
      name={name}
      concern="borders"
      renderBox={({ previewTheme, commonStyles }) => (
        <div
          className={css({
            ...commonStyles,
            ...previewTheme.borders[name],
          })}
        />
      )}
      renderValue={({ previewTheme }) => (
        <>
          <div>{previewTheme.borders[name].borderStyle}</div>
          <div>{previewTheme.borders[name].borderWidth}</div>
          <div>{previewTheme.borders[name].borderColor}</div>
        </>
      )}
    />
  )
}

export function Radius({ name }) {
  const [css, theme] = useStyletron()
  return (
    <Property
      name={name}
      concern="borders"
      renderPreview={() => (
        <div
          className={css({
            backgroundColor: theme.colors.contentPrimary,
            borderRadius: theme.borders[name],
            height: "50px",
            width: "50px",
          })}
        />
      )}
      renderValue={() => theme.borders[name]}
    />
  )
}
