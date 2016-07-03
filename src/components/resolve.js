import { AsyncState as asyncState } from 'react-async-state'
import compose from 'recompose/compose'
import omit from 'lodash/omit'

import withFalcor from './withFalcor'

export default (mapFalcorToProps) => compose(
  withFalcor(({ falcor }) => ({
    __v: falcor.getVersion(),
  })),
  asyncState((ownProps) => {
    const { falcor } = ownProps
    return mapFalcorToProps(falcor, ownProps)
  }, {
    mergeProps(props, state) {
      return Object.assign(omit(props, '__v'), state)
    },
  }),
)
