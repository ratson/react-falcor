import isFunction from 'lodash/isFunction'
import map from 'lodash/map'

import resolve from './resolve'

export default (mapGetValueToProps = {}) => {
  return resolve(async (falcor, ownProps) => {
    const getValueToProps = isFunction(mapGetValueToProps) ? mapGetValueToProps(ownProps) : mapGetValueToProps
    const props = {}
    await Promise.all(map(getValueToProps, (pathSet, k) => {
      return falcor.getValue(pathSet).then((v) => {
        props[k] = v
      })
    }))
    return props
  })
}
