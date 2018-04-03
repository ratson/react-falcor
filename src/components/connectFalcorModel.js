import React from 'react'
import getDisplayName from 'recompose/getDisplayName'

import falcorShape from '../utils/falcorShape'

const defaultBuildDisplayName = name => `connectFalcorModel(${name})`

export default ({
  prop = 'falcorModel',
  buildDisplayName = defaultBuildDisplayName,
} = {}) => WrappedComponent => {
  const ConnectFalcorModel = (props, context) => (
    <WrappedComponent {...props} {...{ [prop]: context.falcor.model }} />
  )

  ConnectFalcorModel.displayName = buildDisplayName(
    getDisplayName(WrappedComponent),
  )

  ConnectFalcorModel.contextTypes = {
    falcor: falcorShape,
  }

  return ConnectFalcorModel
}
