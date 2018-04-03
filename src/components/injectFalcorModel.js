import React from 'react'
import getDisplayName from 'recompose/getDisplayName'

import falcorShape from '../utils/falcorShape'

const defaultBuildDisplayName = name => `injectFalcorModel(${name})`

export default ({
  prop = 'falcorModel',
  buildDisplayName = defaultBuildDisplayName,
} = {}) => WrappedComponent => {
  const InjectFalcorModel = (props, context) => (
    <WrappedComponent {...props} {...{ [prop]: context.falcor.model }} />
  )

  InjectFalcorModel.displayName = buildDisplayName(
    getDisplayName(WrappedComponent),
  )

  InjectFalcorModel.contextTypes = {
    falcor: falcorShape,
  }

  return InjectFalcorModel
}
