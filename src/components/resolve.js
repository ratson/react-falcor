import { AsyncState as asyncState } from 'react-async-state'
import omit from 'lodash/omit'
import withProps from 'recompose/withProps'

import withFalcor from './withFalcor'

export default (mapFalcorToProps) => {
  return WrappedComponent => {
    return withFalcor()(withProps(({ falcor }) => ({
      __v: falcor.getVersion(),
    }))(asyncState((ownProps) => {
      const { falcor } = ownProps
      return mapFalcorToProps(falcor, ownProps)
    }, {
      mergeProps(props, state) {
        return Object.assign({}, omit(props, '__v'), state)
      },
    })(WrappedComponent)))
  }
}
