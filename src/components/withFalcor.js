import { PropTypes } from 'react'
import getContext from 'recompose/getContext'
import withProps from 'recompose/withProps'

export default (mapFalcorToProps) => {
  if (mapFalcorToProps) {
    return WrappedComponent => {
      return getContext({
        falcor: PropTypes.object,
      })(withProps(mapFalcorToProps)(WrappedComponent))
    }
  }
  return getContext({
    falcor: PropTypes.object,
  })
}
