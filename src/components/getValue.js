import _ from 'lodash'

import resolve from './resolve'

function defaultTransformProps(props) {
  return props
}

export default (mapGetValueToProps = {}, transformProps = defaultTransformProps) => {
  return resolve(async (falcor, ownProps) => {
    const getValueToProps = _.isFunction(mapGetValueToProps) ? mapGetValueToProps(ownProps) : mapGetValueToProps
    const props = {}
    await Promise.all(_.map(getValueToProps, (pathSet, k) => {
      return falcor.getValue(pathSet).then((v) => {
        props[k] = v
      })
    }))
    return transformProps(props)
  })
}
