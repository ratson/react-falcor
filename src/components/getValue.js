import isFunction from 'lodash/isFunction'
import map from 'lodash/map'

import resolve from './resolve'

function defaultTransformProps(props) {
  return props
}

export default (mapGetValueToProps = {}, transformProps = defaultTransformProps) => {
  return resolve(async (falcor, ownProps) => {
    const getValueToProps = isFunction(mapGetValueToProps) ? mapGetValueToProps(ownProps) : mapGetValueToProps
    const props = {}
    await Promise.all(map(getValueToProps, (pathSet, k) => {
      return falcor.getValue(pathSet).then((v) => {
        props[k] = v
      })
    }))
    return transformProps(props)
  })
}
