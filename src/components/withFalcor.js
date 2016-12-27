import React, {PropTypes} from 'react'
import getDisplayName from 'recompose/getDisplayName'

export default ({prop = 'falcor'} = {}) => (WrappedComponent) => {
  const WithFalcor = (props, context) => (
    <WrappedComponent
      {...props}
      {...{[prop]: context.falcor}}
    />
  )

  WithFalcor.displayName = `withFalcor(${getDisplayName(WrappedComponent)})`

  WithFalcor.contextTypes = {
    falcor: PropTypes.object,
  }

  return WithFalcor
}
