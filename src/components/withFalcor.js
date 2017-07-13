import React from 'react'
import getDisplayName from 'recompose/getDisplayName'

import falcorShape from '../utils/falcorShape'

export default ({ prop = 'falcor' } = {}) => WrappedComponent => {
  const WithFalcor = (props, context) => (
    <WrappedComponent
      {...props}
      {...{ [prop]: context.falcor }}
    />
  )

  WithFalcor.displayName = `withFalcor(${getDisplayName(WrappedComponent)})`

  WithFalcor.contextTypes = {
    falcor: falcorShape,
  }

  return WithFalcor
}
