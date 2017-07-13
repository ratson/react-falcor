import React from 'react'
import getDisplayName from 'recompose/getDisplayName'

import falcorShape from '../utils/falcorShape'

export default WrappedComponent => {
  const InjectFalcorModel = (props, context) => (
    <WrappedComponent
      {...props}
      falcorModel={context.falcor.model}
    />
  )

  InjectFalcorModel.displayName = `injectFalcorModel(${getDisplayName(WrappedComponent)})`

  InjectFalcorModel.contextTypes = {
    falcor: falcorShape,
  }

  return InjectFalcorModel
}
