import React from 'react'
import getDisplayName from 'recompose/getDisplayName'

import falcorShape from '../utils/falcorShape'

export default ({ prop = 'falcorModel' } = {}) => WrappedComponent => {
  const InjectFalcorModel = (props, context) => (
    <WrappedComponent
      {...props}
      {...{ [prop]: context.falcor.model }}
    />
  )

  InjectFalcorModel.displayName = `injectFalcorModel(${getDisplayName(WrappedComponent)})`

  InjectFalcorModel.contextTypes = {
    falcor: falcorShape,
  }

  return InjectFalcorModel
}
