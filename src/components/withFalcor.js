import { PropTypes } from 'react'
import compose from 'recompose/compose'
import getContext from 'recompose/getContext'
import withProps from 'recompose/withProps'

export default (mapFalcorToProps) => {
  const funcs = [
    getContext({
      falcor: PropTypes.object,
    }),
  ]
  if (mapFalcorToProps) {
    funcs.push(withProps(mapFalcorToProps))
  }
  return compose(...funcs)
}
