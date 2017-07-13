import _ from 'lodash'
import warning from 'warning'

import createHOC from '../utils/createHOC'

const defaultState = {
  loading: true,
}

function computePathSetToProps(props, mapPathSetToProps) {
  const pathSetToProps = _.isFunction(mapPathSetToProps)
    ? mapPathSetToProps(props)
    : mapPathSetToProps
  warning(
    typeof pathSetToProps !== 'undefined',
    '"pathSetToProps" is undefined',
  )
  return pathSetToProps || {}
}

function createHandler(mapPathSetToProps) {
  let resolvedCount
  let subscriptions = null
  const resolved = {}

  function unsubscribe() {
    resolvedCount = 0
    if (subscriptions === null) {
      return
    }
    if (subscriptions.length > 0) {
      subscriptions.forEach(x => x.dispose())
      subscriptions = null
    }
  }

  return {
    defaultState,
    computeProps(props) {
      return {
        ...props,
        ...resolved,
      }
    },
    subscribe(falcor, props, setState) {
      const pathSetToProps = computePathSetToProps(props, mapPathSetToProps)
      const propKeys = Object.keys(pathSetToProps)
      subscriptions = propKeys.map(prop => {
        const pathSet = pathSetToProps[prop]
        return falcor.getValue(pathSet).subscribe(
          value => {
            resolved[prop] = value
          },
          () => {},
          () => {
            resolvedCount += 1

            if (resolvedCount === propKeys.length) {
              setState({
                loading: false,
              })
            }
          },
        )
      })
    },
    unsubscribe,
  }
}

export default (mapPathSetToProps, opts) =>
  createHOC(
    createHandler,
    {
      getDisplayName: name => `falcorGetValue(${name})`,
      ...opts,
    },
    mapPathSetToProps,
  )
